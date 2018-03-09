import {
  create,
  attribute,
  clickable,
  collection,
  hasClass,
  isVisible,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable(':organization/:repo/requests'),

  requests: collection('.request-item', {
    isApproved: hasClass('approved'),
    isRejected: hasClass('rejected'),
    isPending: hasClass('pending')
  })
});
