import { isPresent, isEqual } from '@ember/utils';

function createValidator(validate, errorMessage) {
  return (value) => validate(value) || errorMessage;
}

export const regexp = (rule, errorMessage = 'This field is invalid') => {
  const validator = createValidator((value) => new RegExp(rule).test(value), errorMessage);
  validator.kind = regexp;
  return validator;
};

export const email = (errorMessage = 'Email has incorrect format') => {
  const validator = regexp('\\S+@\\S+\\.\\S+', errorMessage);
  validator.kind = email;
  return validator;
};

export const creditCard = (errorMessage = 'Credit card has incorrect format') => {
  const validator = regexp('^\\d{4}\\s?\\d{4}\\s?\\d{4}\\s?\\d{4}$', errorMessage);
  validator.kind = creditCard;
  return validator;
};

export const max = (length) => {
  const validator = createValidator((value) => value.length <= length,
    `Must be less than ${length} characters`);
  validator.kind = length;
  return validator;
};

export const equal = (length) => {
  const validator = createValidator((value) => value.length === length,
    `Must be equal to ${length} characters`);
  validator.kind = length;
  return validator;
};

export const presense = (errorMessage = 'This field is required') => {
  const validator = createValidator((value) => isPresent(value), errorMessage);
  validator.kind = presense;
  return validator;
};

export const difference = (sample, errorMessage) => {
  const validator = createValidator(
    (value) => !isEqual(value, sample),
    errorMessage || `This field should be different from ${sample}`
  );
  validator.kind = difference;
  return validator;
};
