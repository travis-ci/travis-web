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
    isPending: hasClass('pending'),

    commitLink: {
      scope: 'a:first-child'
    },

    commitMissing: {
      scope: '.row-item:eq(1) em'
    },

    commitMessage: {
      scope: '.row-item:eq(3)'
    },

    buildNumber: {
      scope: '.row-item:eq(4) .inner-underline'
    },

    requestMessage: {
      scope: '.row-item:eq(5)'
    }
  })
});
