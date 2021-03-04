export default {
  signalingServerUrl: 'https://satellite.jellystone.yoga',
  iceServers: [
    // TURN
    {
      'urls': 'turn:turn.jellystone.yoga:3478?transport=udp',
      'url': 'turn:turn.jellystone.yoga:3478?transport=udp',
      username: 'webrtc',
      credential: 'wubalubadubdub'
    }

    // // STUN ONLY
    // {
    //   'urls': 'stun:stun.l.google.com:19302',
    //   'url': 'stun:stun.l.google.com:19302'
    // },

    // {
    //   'url': 'stun:global.stun.twilio.com:3478?transport=udp',
    //   'urls': 'stun:global.stun.twilio.com:3478?transport=udp'
    // }
  ]
}
