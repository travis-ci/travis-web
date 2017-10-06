import { helper } from '@ember/component/helper';

export default helper((size) => {
  if (size) {
    return (size / 1024 / 1024).toFixed(2);
  }
});
