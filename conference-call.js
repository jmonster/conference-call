import {LitElement, html, css} from 'lit-element';
import './video-grid';
import config from './config.js'

export class ConferenceCall extends LitElement {
  static get styles() {
    return css`
      :host {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `;
  }

  static get properties() {
    return {
      signalingServerUrl: { type: String },
      channel: { type: String },
      peers: { type: Object },
      tracks: { type: Object },
      signaler: { type: Object }, // socketio socket
      iceServers: { type: Array },
      canConnect: { type: Boolean }
    };
  }

  constructor() {
    super();

    this.channel = 'unspecified' // TODO make this dynamic??
    this.signalingServerUrl = config.signalingServerUrl
    this.iceServers = config.iceServers

    this.canConnect = true
    this.peers = {}
    this.tracks = {}
  }

  _initSignaler() {
    this.signaler = io(this.signalingServerUrl, {
      auth: {
        tbd: 123
      },
      
      query: {
        channel: this.channel
      }
    })
    
    this.signaler.on('connect', () => {
      console.debug('socket.io id', this.signaler.id)
      console.debug('socket.io channel', this.channel)

      console.dir(this.peers)
      
      // - 'participants' is emitted to the newly connected user
      //   when they first join a channel
      this.signaler.on('participants', (ids) => {
        // these are the people we establish an RTCPeerConnection with
        ids = ids.filter((id) => id !== this.signaler.id) // remove self
        ids.forEach((id) => this._connectToPeer(id))
      })

      this.signaler.on('signal', async (remotePeerId, {offer, answer, candidate}) => {
        let rtcpc = this.peers[remotePeerId]

        // OFFER
        if (offer) {
          console.debug(remotePeerId, 'received OFFER')

          if (!rtcpc) rtcpc = this.peers[remotePeerId] = this._createRTCPC(remotePeerId);

          this.requestUpdate() // render changes to this.peers

          rtcpc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await rtcpc.createAnswer();
          await rtcpc.setLocalDescription(answer);

          this.signaler.emit('signal', remotePeerId, {answer});
        }

        // ANSWER
        if (answer) {
          console.debug(remotePeerId, 'received ANSWER')
          
          try {
            if (!rtcpc) {
              throw new Error('Unexpected missing rtcpc.. better dig in, dogg.')
            }

            await rtcpc.setRemoteDescription(new RTCSessionDescription(answer));
          } catch(err) {
            console.error(err)
          }
        }


        // CANDIDATE
        if (candidate) {
          console.debug(remotePeerId, 'received CANDIDATE')

          try {
            if (!rtcpc) {
              // this appears to happen when the signal serve delivers an old message, or something
              console.debug('Received candidate for unknown peer', remotePeerId)
              return false;
            }

            await rtcpc.addIceCandidate(candidate)
          } catch(err) {
            console.error('Error adding received ICE candidate', err)
            debugger
          }
        }
      })
    });

    this.signaler.on('connect_error', (err) => {
      console.error('unable to connect to signaler')
      this.canConnect = true
    })

    this.signaler.on('disconnect', (event) => {
      console.error('disconnected from signaler')
      this.canConnect = true
    })
  }

  _createRTCPC(remotePeerId) {
    const configuration = {iceServers: this.iceServers};
    const rtcpc = new RTCPeerConnection(configuration);

    if (this.userMedia) {
      this.userMedia.getTracks().forEach((t) => {
        rtcpc.addTrack(t)
      })
    }

    rtcpc.onicecandidate = ({candidate}) => {
      if (candidate) {
        this.signaler.emit('signal', remotePeerId, {candidate})
      }
    }

    rtcpc.onicecandidateerror = (err) => {
      console.error(remotePeerId,'icecandidateerror', err)
    }

    rtcpc.onconnectionstatechange = async (event) => {
      console.debug(remotePeerId, 'rtcpc.connectionState', rtcpc.connectionState)
      
      switch(rtcpc.connectionState) {
        case "new":
        case "checking": // connecting...
          break;
        case "connected": // online
          break;
        case "disconnected": // disconnecting...
        case "closed": // offline
        case "failed": // error
          this._destroyRTCPC(remotePeerId, rtcpc)
          this.requestUpdate() // render changes to this.peers
          if (rtcpc.reconnectRequested) this._connectToPeer(remotePeerId)
          break;
        default: // unknown
          break;
      }
    };

    // rtcpc.addEventListener('track', ({track}) => {
    rtcpc.ontrack = ({track}) => {
      // initialize to [] or fetch existing array
      const tracks = this.tracks[remotePeerId] = this.tracks[remotePeerId] || []

      // add track
      tracks.push(track)

      // TODO when/where/how can a track be removed?
      // besides on disconnection, webrtc seems to have removed the mediastream
      // so you can't listen for it there.. :thinking-face: or can you idk.

      // update UI to reflect changes to `this.tracks`
      this.requestUpdate()
    };

    // rtcpc.addEventListener('datachannel', ({channel}) => {
    rtcpc.ondatachannel = ({channel}) => {
      channel.addEventListener('open', () => console.debug(remotePeerId, 'datachannel open'))
      channel.addEventListener('message', ({data}) => console.info(remotePeerId, data))
      channel.addEventListener('closing', () => console.debug(remotePeerId, 'datachannel closing'))
      channel.addEventListener('close', () => console.debug(remotePeerId, 'datachannel close'))
      channel.addEventListener('error', (err) => console.error(remotePeerId, err))
    };

    //
    // This approach does NOT work with Safari
    // or else you encounter this error when the wrong caller/order occures:
    // > InvalidAccessError: Failed to set remote answer sdp: Failed to apply the description for 0: Failed to set SSL role for the transport.
    // Chrome, of course, works fine.
    //
    // rtcpc.addEventListener('negotiationneeded', async () => {
    //   console.debug('negotiationneeded')

    //   // create and send local offer
    //   const offer = await rtcpc.createOffer()
    //   await rtcpc.setLocalDescription(offer)
    //   this.signaler.emit('signal', remotePeerId, {offer})
    // })

    // rtcpc.addEventListener("iceconnectionstatechange", async (event) => {
    rtcpc.oniceconnectionstatechange = async (event) => {
      console.debug(remotePeerId, rtcpc.iceConnectionState, 'iceconnectionstatechange')

      if (rtcpc.iceConnectionState === "failed") {
        /* possibly reconfigure the connection in some way here */
        /* then request ICE restart */

        if (rtcpc.restartIce) {
          rtcpc.restartIce()
        } else {
          // this doesn't work with Safari (as is, at least)
          // const offer = await rtcpc.createOffer({iceRestart: true})
          // await rtcpc.setLocalDescription(offer)
          // this.signaler.emit('signal', remotePeerId, {offer})

          console.log('dreaming of .restartIce()')
          rtcpc.reconnectRequested = true

          _destroyRTCPC(remotePeerId, rtcpc)
        }
      }
    };

    return rtcpc;
  }

  _destroyRTCPC(remotePeerId, rtcpc) {
    rtcpc.close()

    delete this.peers[remotePeerId]
    delete this.tracks[remotePeerId]

    delete rtcpc.onconnectionstatechange
    delete rtcpc.oniceconnectionstatechange
    delete rtcpc.onicecandidateerror
    delete rtcpc.onicecandidate
    delete rtcpc.ontrack
    delete rtcpc.ondatachannel
  }

  async _connectToPeer(remotePeerId) {
    let rtcpc = this.peers[remotePeerId]

    if (rtcpc) {
      console.error(`Already connected to ${this.peers[remotePeerId]}; aborting call _connectToPeer`)
      return
    }

    // create new peer connection
    rtcpc = this.peers[remotePeerId] = this._createRTCPC(remotePeerId)

    this.requestUpdate() // render changes to this.peers

    // create a new data channel
    // const dataChannel = rtcpc.createDataChannel('jag')
    // dataChannel.onmessage = (({data}) => { console.debug('received', data)})

    // create and send local offer
    // This code IS necessary when NOT using the reneggotiation approach
    // which, at the time of writing, does not work properly in Safari
    // See notes by renegotiation listener
    const offer = await rtcpc.createOffer()
    await rtcpc.setLocalDescription(offer)
    this.signaler.emit('signal', remotePeerId, {offer})

    // TODO return rtcpc and add it to this.peers[] outside of this function
  }

  async _onClickConnect() {
    this.canConnect = false
    await this._attachAV()
    this._initSignaler();
  }

  async _attachAV() {
    try {
      this.userMedia = await window.navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      for (const [remotePeerId, rtcpc] of Object.entries(this.peers)) {
        this.userMedia.getTracks().forEach((t) => {
          rtcpc.addTrack(t)
        })
      }
    } catch(err) {
      console.error(err)
      debugger
    }
  }

  updated() {
    const ids = Object.keys(this.tracks)
    ids.forEach((remotePeerId) => {
      const stream = new MediaStream(this.tracks[remotePeerId])
      const element = this.shadowRoot.querySelector(`video[id='${remotePeerId}']`)
      if (element) element.srcObject = stream
    })
  }

  render() {
    return html`
        ${this.canConnect
          ? html`<button @click="${this._onClickConnect}" ?disabled=${!this.canConnect} style="font-size:3rem; background-color: greenyellow; padding: 42px;">connect to socket.io</button>`
          : html``
        }
        
        <video-grid>
          ${Object.keys(this.peers).map(remotePeerId => html`
            <video playsinline autoplay id="${remotePeerId}" slot="video"></video>
          `)}
        </video-grid>
    `;
  }
}

window.customElements.define('conference-call', ConferenceCall);
