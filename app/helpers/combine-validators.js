import { helper } from '@ember/component/helper';

export function combineValidators(validators) {
  return validators.reduce((previousValidator, currentValidator) => (
    (value) => {
      const currentValidatorResult = currentValidator(value);
      return currentValidatorResult === true ? previousValidator(value) : currentValidatorResult;
    }
  ), () => true);
}

export default helper(combineValidators);
