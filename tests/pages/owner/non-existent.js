import {
  create,
  contains,
  visitable,
  text,
  isHidden
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/non-existent-owner'),
  showsBarricadeIllustration: contains('svg', { scope: '.page-graphic' }),
  errorMessage: text('.missing-notice .page-title'),
  errorMessageProisHidden: isHidden('.missing-notice p'),
  errorMessageProUnauthenticated: contains('.missing-notice p')
});
