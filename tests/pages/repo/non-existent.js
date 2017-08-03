import {
  create,
  contains,
  visitable,
  text,
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/non-existent/repository'),
  showsBarricadeIllustration: contains('svg', { scope: '.page-graphic' }),
  errorMessage: text('.missing-notice .page-title'),
  errorMessageProUnauthenticated: contains('.missing-notice p')
});
