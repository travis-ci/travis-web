import {
  create,
  attribute,
  clickable,
  collection,
  hasClass,
  isHidden,
  isPresent,
  text,
  visitable,
  fillable
} from 'ember-cli-page-object';

import {
  EMAIL_SETTINGS,
  EMAIL_SETTINGS_TITLE,
  EMAIL_SETTINGS_DESCRITION,
  EMAIL_SETTINGS_TOGGLE,
  EMAIL_SETTINGS_RESUBSCRIBE_LIST,
  EMAIL_SETTINGS_RESUBSCRIBE_ITEM,
  EMAIL_SETTINGS_RESUBSCRIBE_BUTTON
} from '../helpers/selectors';

function existingRepositoriesCollection(scope) {
  return collection(`${scope} li.profile-repolist-item`, {
    name: text('a.profile-repo'),
    isActive: hasClass('active', '.switch'),
    isMigrated: isPresent('a.already-migrated'),
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
  visit: visitable('/account'),
  visitOrganization: visitable('/organizations/:name'),
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
    text: text('[data-test-message]'),

    link: {
      scope: 'a'
    }
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

  settings: {
    visit: clickable('li[data-test-settings-tab] a'),

    isPresent: isPresent('li[data-test-settings-tab]'),
    isHidden: isHidden('li[data-test-settings-tab]'),

    features: collection('.features-list .feature', {
      name: text('.name'),
      description: text('.description'),
      isOn: hasClass('active', '.switch'),

      click: clickable('.switch')
    }),

    emailSettings: {
      scope: EMAIL_SETTINGS,
      title: text(EMAIL_SETTINGS_TITLE),
      description: text(EMAIL_SETTINGS_DESCRITION),
      toggle: {
        scope: EMAIL_SETTINGS_TOGGLE,
        isOn: hasClass('active'),
        click: clickable()
      },
      resubscribeList: {
        scope: EMAIL_SETTINGS_RESUBSCRIBE_LIST,
        items: collection(EMAIL_SETTINGS_RESUBSCRIBE_ITEM, {
          click: clickable(EMAIL_SETTINGS_RESUBSCRIBE_BUTTON)
        })
      }
    }
  },

  billing: {
    visit: clickable('li[data-test-billing-tab] a'),

    manageButton: {
      scope: '.manage-subscription',
      href: attribute('href'),
      isDisabled: hasClass('disabled'),
    },

    marketplaceButton: {
      scope: '.marketplace-button',
      href: attribute('href')
    },

    plan: {
      scope: '.plan',
      name: text('[data-test-plan-name]'),
      concurrency: text('[data-test-plan-concurrency]')
    },

    trial: {
      scope: '.billing',
      name: text('[data-test-trial-message]'),

      link: {
        scope: '[data-test-trial-link]',
        href: attribute('href')
      }
    },

    education: {
      scope: '.billing',
      name: text('[data-test-education-message]'),
    },

    address: {
      scope: '.contact .address',
    },

    source: text('[data-test-source]'),

    creditCardNumber: { scope: '[data-test-credit-card]' },
    price: { scope: '[data-test-price]' },

    annualInvitation: { scope: '[data-test-annual-invitation]' },

    expiryMessage: {
      scope: '[data-test-expiry-message]'
    },

    contactSupport: {
      scope: '.manual-help',
    },

    invoices: {
      scope: '.invoices',
      items: collection('[data-test-invoice]', {
        href: attribute('href')
      })
    },
  },
});
