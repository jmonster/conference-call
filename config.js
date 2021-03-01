export default {
  signalingServerUrl: 'https://satellite.jellystone.yoga',
  iceServers: [
    // STUN
    {
      'urls': 'stun:stun.l.google.com:19302',
      'url': 'stun:stun.l.google.com:19302'
    },
    {
      'url': 'stun:global.stun.twilio.com:3478?transport=udp',
      'urls': 'stun:global.stun.twilio.com:3478?transport=udp'
    }
  ]
}
