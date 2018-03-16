import {
  create,
  collection,
  hasClass,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable(':organization/:repo/requests'),

  requests: collection('.request-item', {
    isApproved: hasClass('approved'),
    isRejected: hasClass('rejected'),
    isPending: hasClass('pending'),

    isHighlighted: hasClass('highlighted'),

    commitLink: {
      scope: '[data-requests-item-related-model] a'
    },

    commitMissing: {
      scope: '[data-requests-item-commit-missing]'
    },

    commitMessage: {
      scope: '[data-requests-item-commit-message]'
    },

    createdAt: {
      scope: '[data-requests-item-created-at]'
    },

    buildNumber: {
      scope: '[data-requests-item-build] .inner-underline'
    },

    requestMessage: {
      scope: '[data-requests-item-message]'
    }
  }),

  missingNotice: {
    scope: '.missing-notice'
  }
});
