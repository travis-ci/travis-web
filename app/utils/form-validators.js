import { isPresent } from '@ember/utils';

function createValidator(validate, errorMessage) {
  return (value) => validate(value) || errorMessage;
}

export const regexp = (rule, errorMessage = 'This field is invalid') => (
  createValidator((value) => new RegExp(rule).test(value), errorMessage)
);

export const email = (errorMessage = 'Email has incorrect format') => (
  regexp('\\S+@\\S+\\.\\S+', errorMessage)
);

export const presense = (errorMessage = 'This field is required') => (
  createValidator((value) => isPresent(value), errorMessage)
);
