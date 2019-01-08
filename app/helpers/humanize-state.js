import { helper } from '@ember/component/helper';

export default helper((params) => {
  let [state] = params;

  if (state === 'created') {
    return 'received';
  }

  if (state === 'received') {
    return 'booting';
  }
  return state;
});
