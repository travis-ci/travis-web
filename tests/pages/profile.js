import {
  create,
  attribute,
  clickable,
  collection,
  hasClass,
  is,
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
  EMAIL_SETTINGS_RESUBSCRIBE_BUTTON,

  INSIGHTS_SETTINGS,
  INSIGHTS_SETTINGS_TITLE,
  INSIGHTS_SETTINGS_DESCRIPTION,
  INSIGHTS_SETTINGS_LIST,
  INSIGHTS_SETTINGS_LIST_ITEM,
  INSIGHTS_SETTINGS_LIST_ITEM_DESCRIPTION,
  INSIGHTS_SETTINGS_LIST_ITEM_SELECTED,
  INSIGHTS_SETTINGS_SUBMIT,
  INSIGHTS_SETTINGS_MODAL,
  INSIGHTS_SETTINGS_MODAL_TITLE,
  INSIGHTS_SETTINGS_MODAL_DESCRIPTION,
  INSIGHTS_SETTINGS_MODAL_CLOSE,
  INSIGHTS_SETTINGS_MODAL_CANCEL,
  INSIGHTS_SETTINGS_MODAL_CONFIRM,
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

  filter: fillable('[data-test-legacy-repos] [data-test-filter-field] [data-test-input-field]'),
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

    migrateButton: { scope: '[data-test-migrate-github-apps] ' },
  },

  manageGithubAppsLink: {
    scope: '[data-test-github-apps-integration-header] a',
    href: attribute('href')
  },

  githubAppsRepositories: githubAppsRepositoryCollection('#github-apps-repositories'),

  githubAppsFilter: fillable('[data-test-github-app-repos] [data-test-filter-field] [data-test-input-field]'),
  githubAppsPages: collection('#github-apps-repositories .pagination-navigation [data-test-page-pagination-link]', {
    visit: clickable()
  }),

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

  sidebarMigrate: {
    scope: '[data-test-sidebar-migrate]',
    isPresent: isPresent(),

    signUpButton: {
      scope: '[data-test-migrate-signup]',
      click: clickable()
    }
  },

  migrateDialog: {
    scope: '[data-test-migrate-dialog]',
    isPresent: isPresent(),

    accountsSelect: {
      scope: '[data-test-migrate-accounts-select]',
      click: clickable(),

      options: collection('[data-test-account-option]')
    },

    submit: {
      scope: '[data-test-migrate-submit]',
      isPresent: isPresent(),
      click: clickable()
    }
  },

  migrateBannerAccepted: {
    scope: '[data-test-migrate-banner-accepted]',
    isPresent: isPresent()
  },

  migrateBannerRequested: {
    scope: '[data-test-migrate-banner-requested]',
    isPresent: isPresent()
  },

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
    },

    insightsSettings: {
      scope: INSIGHTS_SETTINGS,
      title: text(INSIGHTS_SETTINGS_TITLE),
      description: text(INSIGHTS_SETTINGS_DESCRIPTION),
      visibilityList: {
        scope: INSIGHTS_SETTINGS_LIST,
        items: collection(INSIGHTS_SETTINGS_LIST_ITEM, {
          click: clickable(),
          description: text(INSIGHTS_SETTINGS_LIST_ITEM_DESCRIPTION),
          isSelected: is(INSIGHTS_SETTINGS_LIST_ITEM_SELECTED),
        }),
      },
      submit: {
        scope: INSIGHTS_SETTINGS_SUBMIT,
        click: clickable(),
        isDisabled: attribute('disabled'),
      },
    },

    insightsSettingsModal: {
      scope: INSIGHTS_SETTINGS_MODAL,
      title: text(INSIGHTS_SETTINGS_MODAL_TITLE),
      description: text(INSIGHTS_SETTINGS_MODAL_DESCRIPTION),
      closeButton: {
        scope: INSIGHTS_SETTINGS_MODAL_CLOSE,
        click: clickable(),
      },
      cancelButton: {
        scope: INSIGHTS_SETTINGS_MODAL_CANCEL,
        click: clickable(),
      },
      confirmButton: {
        scope: INSIGHTS_SETTINGS_MODAL_CONFIRM,
        click: clickable(),
      },
    }
  },

  billing: {
    visit: clickable('li[data-test-billing-tab] a'),

    manageButton: {
      scope: '.manage-subscription',
      href: attribute('href'),
      isDisabled: hasClass('disabled'),
    },

    noPermissionMessage: {
      scope: '[data-test-no-permission-message]',
    },

    billingFormHeading: {
      scope: '[data-test-billing-info-title]',
    },

    billingForm: {
      scope: '[data-test-billing-form]',
      isPresent: isPresent(),
      fillIn: fillable(''),

      input: {
        scope: '[data-test-billing-form] input',
        isPresent: isPresent(),
      },

      select: {
        scope: '[data-test-billing-form] [data-billing-form-select]',
        isPresent: isPresent(),
      },

      billingSelectCountry: {
        scope: '.billing-country'
      },

      switchPlan: {
        scope: '.travis-form__field--switch',
        isPresent: isPresent(),
      }
    },

    billingPaymentForm: {
      scope: '[data-test-payment-form]',
      isPresent: isPresent(),
      fillIn: fillable(''),

      input: {
        scope: '[data-test-payment-form] input',
        isPresent: isPresent(),
      },

      cardMonthSelect: {
        scope: '[data-test-select-card-month]',
        isPresent: isPresent(),
      },

      cardYearSelect: {
        scope: '[data-test-select-card-year]',
        isPresent: isPresent(),
      },

      completeButton: {
        scope: '[data-test-complete-button]'
      },

      paymentInfo: {
        scope: '[data-test-payment-info]'
      },

      flashErrorMessage: {
        scope: '.flash-message .message'
      }
    },

    billingPlanChoices: {
      scope: '[data-test-billing-plan-choices]',
      isPresent: isPresent(),

      boxes: {
        scope: '[data-test-plan-box]',
      },

      lastBox: {
        visit: clickable('[data-test-plan-box]:last-child'),
      }
    },

    selectedBillingPlan: {
      scope: '[data-test-selected-plan]',
      isPresent: isPresent(),

      name: {
        scope: '[data-test-selected-plan-name]'
      },

      jobs: {
        scope: '[data-test-selected-plan-jobs]'
      },

      freeJobs: {
        scope: '[data-test-selected-plan-free-jobs]'
      },

      price: {
        scope: '[data-test-selected-plan-price]'
      }
    },

    subscribeButton: {
      scope: '[data-test-proceed-to-payment-button]',
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
      scope: '[data-test-invoices]',
      items: collection('[data-test-invoice]', {
        invoiceDate: text('td', { at: 0 }),
        invoiceCardDigits: text('td', { at: 1 }),
        invoiceCardPrice: text('td', { at: 2 }),
        invoiceUrl: {
          scope: '[data-test-invoice-url]',
          href: attribute('href')
        }
      }),
      invoiceTableHeaders: collection('[data-test-table-header-row] th'),

      invoiceSelectYear: {
        scope: '[data-test-invoice-select-year]'
      }
    },
  },

  migrate: {
    visit: clickable('li[data-test-migrate-tab] a'),

    isPresent: isPresent('li[data-test-migrate-tab]'),
    isHidden: isHidden('li[data-test-migrate-tab]'),

    page: {
      scope: '[data-test-migrate-page]',

      title: {
        scope: '[data-test-title]',
        isPresent: isPresent()
      },

      commonIntro: {
        scope: '[data-test-common-intro]',
        isPresent: isPresent()
      },

      step1Intro: {
        scope: '[data-test-step1-intro]',
        isPresent: isPresent()
      },

      activateButton: {
        scope: '[data-test-activate-button]',
        isPresent: isPresent(),
        click: clickable()
      },

      manualNote: {
        scope: '[data-test-manual-note]',
        isPresent: isPresent()
      },

      step2Intro: {
        scope: '[data-test-step2-intro]',
        isPresent: isPresent()
      },

      activateLink: {
        scope: '[data-test-activate-link]',
        isPresent: isPresent(),
        href: attribute('href')
      },

      repoFilter: {
        scope: '[data-test-repo-filter]',
        isPresent: isPresent(),
      },

      selectAll: {
        scope: '[data-test-select-all]',
        isPresent: isPresent(),
        checked: hasClass('travis-form__field-checkbox--checked', 'travis-form__field-checkbox')
      },

      repoList: {
        scope: '[data-test-repo-list]',
        isPresent: isPresent(),

        repos: collection('[data-test-repo]', {
          checked: hasClass('travis-form__field-checkbox--checked', 'travis-form__field-checkbox'),
          disabled: hasClass('travis-form__field-checkbox--disabled', 'travis-form__field-checkbox'),
        })
      },

      migrateButton: {
        scope: '[data-test-migrate-button]',
        isPresent: isPresent(),
        click: clickable()
      }

    }
  }
});
