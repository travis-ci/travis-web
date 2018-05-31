import {
  create,
  attribute,
  clickable,
  collection,
  hasClass,
  isPresent,
  text,
  visitable,
  fillable
} from 'ember-cli-page-object';

function existingRepositoriesCollection(scope) {
  return collection(`${scope} li.profile-repolist-item`, {
    name: text('a.profile-repo'),
    isActive: hasClass('active', '.switch'),
    isDisabled: hasClass('non-admin', 'a.profile-repo'),
    toggle: clickable('.switch'),
    ariaChecked: attribute('aria-checked', '.switch'),
    role: attribute('role', '.switch')
  });
}

function githubAppsRepositoryCollection(scope) {
  return collection(`${scope} li.profile-repolist-item`, {
    name: text('a.profile-repo'),

    isPublic: isPresent('.icon.public'),
    isPrivate: isPresent('.icon.private'),

    settings: {
      scope: '.profile-settings',
      isDisabled: hasClass('disabled')
    }
  });
}

export default create({
  visit: visitable('profile/:username'),
  name: text('.profile-header h1'),
  nameBadge: { scope: '.profile-header .badge' },
  login: text('.login'),

  avatar: {
    scope: '.profile-header .avatar-wrapper',

    src: attribute('src', 'img'),
    checkmark: { scope: '.checkmark' }
  },

  syncButton: {
    scope: '.sync-button',
    lastSynced: text('.sync-last'),
    text: text('.button'),
    click: clickable('.button'),
  },

  subscriptionStatus: {
    scope: '.subscription-status',
    text: text('[data-test-message]')
  },

  filter: fillable('.profile-repositories-filter input.search'),
  noRepositoriesFoundByFilter: text('#administerable-repositories .no-results'),

  notFoundOrgName: text('.page-title .h2--red'),

  administerableRepositories: existingRepositoriesCollection('#administerable-repositories'),
  deprecatedBadge: { scope: '.badge.deprecated' },

  githubAppsInvitation: {
    scope: '#github-apps-invitation',

    isExpanded: hasClass('expanded'),

    link: {
      scope: 'a.migrate-or-activate',
      href: attribute('href')
    },

    migrateButton: { scope: '[data-test-migrate-github-apps] '},
  },

  manageGithubAppsLink: {
    scope: '[data-test-github-apps-integration-header] a',
    href: attribute('href')
  },

  githubAppsRepositories: githubAppsRepositoryCollection('#github-apps-repositories'),

  notLockedGithubAppsFilter: fillable('.not-locked-profile-repositories-filter input.search'),
  notLockedGithubAppsRepositories: githubAppsRepositoryCollection('#not-locked-github-apps-repositories'),
  notLockedGithubAppsPages: collection('#github-apps-repositories .pagination-navigation [data-test-page-pagination-link]', {
    visit: clickable()
  }),

  lockedGithubAppsRepositories: githubAppsRepositoryCollection('#locked-github-apps-repositories'),

  token: {
    scope: '.profile-user',

    show: clickable('.token-actions button.show-token'),
    value: text('.auth-token'),
    obfuscatedCharacters: text('.obfuscated-chars'),
    tokenCopiedText: text('.token-copied-text'),
  },

  accounts: collection('.profile-aside .account', {
    name: text('.account-name'),
    visit: clickable('.account-name'),

    avatar: {
      scope: '.avatar-wrapper',
      checkmark: { scope: '.checkmark' }
    },
  }),

  billing: {
    visit: clickable('li[data-test-billing-tab] a'),

    plan: {
      scope: '.plan',
      name: text('[data-test-plan-name]'),
      concurrency: text('[data-test-plan-concurrency]')
    },

    address: {
      scope: '.contact .address',
    },

    source: text('[data-test-source]'),

    creditCardNumber: text('[data-test-credit-card]'),
    price: text('[data-test-price]'),

    annualInvitation: { scope: '[data-test-annual-invitation]' },

    invoices: collection('[data-test-invoice]', {
      href: attribute('href')
    }),

    edit: {
      plans: collection('[data-test-plan]', {
        name: text('[data-test-name]'),
        concurrency: text('[data-test-concurrency]'),
        price: text('[data-test-price]'),

        isHighlighted: hasClass('highlighted'),
      }),

      creditCard: {
        number: { scope: '[name=number]' },
        name: { scope: '[name=name]' },
        expiryMonth: { scope: '[name=expiryMonth]' },
        expiryYear: { scope: '[name=expiryYear]' },
        cvc: { scope: '[name=cvc]' }
      },

      billing: {
        firstName: { scope: '[name=firstName]'},
        lastName: { scope: '[name=lastName] '},
        company: { scope: '[name=company]' },
        address: { scope: '[name=address]' },
        address2: { scope: '[name=address2] '},
        city: { scope: '[name=city]' },
        state: { scope: '[name=state]' },
        country: { scope: '[name=country]' },
        zipCode: { scope: '[name=zipCode]' },
        email: { scope: '[name=email]' },
        vatId: { scope: '[name=vatId]' },
      },

      save: {
        scope: '.save'
      }
    }
  },
});
