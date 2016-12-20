import {
  create,
  visitable,
  text
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/404'),
  errorHeader: text('.error-text'),
});
