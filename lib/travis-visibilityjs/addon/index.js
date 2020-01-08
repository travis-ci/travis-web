let Visibility;

if (typeof self.FastBoot === 'undefined') {
  Visibility = self.Visibility;
} else {
  Visibility = {
    every() {}
  };
}

export default Visibility;
