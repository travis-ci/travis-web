import { helper } from '@ember/component/helper';

export default helper((params) => {
  const [num] = params;
  return num + 1;
});
