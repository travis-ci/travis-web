let Pusher;

if (typeof self.FastBoot === 'undefined') {
  Pusher = self.Pusher;
} else {
  Pusher = {};
}

export default Pusher;
