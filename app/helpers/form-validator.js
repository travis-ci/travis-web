import { helper } from '@ember/component/helper';

export function formValidator(params) {
  const validator = params[0];
  return validator(...params.slice(1));
}

export default helper(formValidator);
