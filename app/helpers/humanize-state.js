import { helper } from '@ember/component/helper';

export default helper((params) => {
  let [state] = params;
  if (state === 'received') {
    return 'booting';
  }
  return state;
});
