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
  EMAIL_SETTINGS_RESUBSCRIBE_BUTTON,

  INSIGHTS_SETTINGS,
  INSIGHTS_SETTINGS_TITLE,
  INSIGHTS_SETTINGS_DESCRIPTION,
  INSIGHTS_SETTINGS_LIST,
  INSIGHTS_SETTINGS_LIST_ITEM,
  INSIGHTS_SETTINGS_LIST_ITEM_DESCRIPTION,
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
  flash: text('[data-test-components-flash-item]'),

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
    scope: '[data-test-account-token]',
    show: clickable('.token-actions button.show-token'),
    value: text('.auth-token'),
    obfuscatedCharacters: collection('.obfuscated-chars'),
    tokenCopiedText: text('.token-copied-text'),
  },

  atomToken: {
    scope: '[data-test-atom-token]',
    show: clickable('.token-actions button.show-token'),
    value: text('.auth-token'),
    obfuscatedCharacters: collection('.obfuscated-chars'),
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
          isSelected: hasClass('visibility-setting-list-item--selected'),
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

    planYellowMessage: {
      scope: '[data-test-plan-yellow-message]',
      isPresent: isPresent(),
    },

    planManualMessage: {
      scope: '[data-test-plan-manual-message]',
      isPresent: isPresent(),
    },

    manageButton: {
      scope: '.manage-subscription',
      href: attribute('href'),
      isDisabled: hasClass('disabled'),
    },

    newSubscriptionButton: {
      scope: '[data-test-manage-button]',
      isDisabled: hasClass('disabled'),
    },

    getPlanButton: {
      scope: '[data-test-get-a-plan]',
      isDisabled: hasClass('disabled'),
      isHidden: isHidden()
    },

    resubscribeSubscriptionButton: {
      scope: '[data-test-resubscribe-subscription]'
    },

    changePlanResubscribe: {
      scope: '[data-test-resubscribe-change-plan]'
    },

    inactiveResubscribeSubscriptionButton: {
      scope: '[data-test-resubscribe-subscription-disabled]',
      isDisabled: hasClass('disabled'),
    },

    inactiveChangePlanResubscribe: {
      scope: '[data-test-resubscribe-change-plan-disabled]',
      isDisabled: hasClass('disabled'),
    },

    changeSubscriptionButton: {
      scope: '[data-test-change-subscription]'
    },

    cancelSubscriptionButton: {
      scope: '[data-test-cancel-subscription]'
    },

    keepSubscriptionButton: {
      scope: '[data-test-keep-subscription]'
    },

    openCancelSubscriptionModal: {
      scope: '[data-test-open-cancel-subscription-modal]'
    },

    openCancelSubscriptionConfirmationModal: {
      scope: '[data-test-open-cancel-subscription-confirmation-modal]'
    },

    cancellationRequestedButton: {
      scope: '[data-test-cancellation-requested-button]',
      isPresent: isPresent()
    },

    dataTestCancelSubscriptionModal: {
      scope: '[data-test-cancel-subscription-modal]',

      error: {
        scope: '[data-test-cancel-subscription-error]'
      },

      cancelReasonOptions: collection('[data-test-cancel-reason-option]')
    },

    editContactAddressButton: {
      scope: '[data-test-edit-contact-address]'
    },

    editBillingAddressButton: {
      scope: '[data-test-edit-billing-address]'
    },

    billingEmails: collection('[data-test-multiple-input-field]', {
      fillEmail: fillable(''),
    }),

    editContactAddressForm: {
      scope: '[data-test-edit-contact-address-form]',
      isPresent: isPresent(),
      fillIn: fillable(''),

      inputs: {
        scope: 'input'
      },

      updateContactAddressButton: {
        scope: '[data-test-update-contact-address-button]',
      },

      cancelContactAddressButton: {
        scope: '[data-test-cancel-contact-address-button]',
      },
    },

    editBillingAddressForm: {
      scope: '[data-test-edit-billing-address-form]',
      isPresent: isPresent(),
      fillIn: fillable(''),

      inputs: {
        scope: 'input'
      },

      updateBillingAddressButton: {
        scope: '[data-test-update-billing-address-button]',
      },

      cancelBillingAddressButton: {
        scope: '[data-test-cancel-billing-address-button]',
      },
    },

    noPermissionMessage: {
      scope: '[data-test-no-permission-message]',
    },

    billingFormHeading: {
      scope: '[data-test-billing-info-title]',
    },

    billingCouponForm: {
      scope: '[data-test-coupon-form]',
      isPresent: isPresent(),
      fillIn: fillable(''),

      submitCoupon: {
        scope: '[data-test-coupon-button]'
      },

      validCoupon: {
        scope: '[data-test-valid-coupon]'
      },

      invalidCoupon: {
        scope: '[data-test-invalid-coupon]'
      }
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

      proceedPayment: {
        scope: '[data-test-proceed-to-payment-button]'
      },

      backToPlans: {
        scope: '[data-test-back-to-plans]'
      }
    },

    switchPlan: {
      scope: '.travis-form__field--switch',
      isPresent: isPresent(),
    },

    stripeForm: {
      scope: '[data-test-stripe-form]'
    },

    billingPaymentForm: {
      scope: '[data-test-payment-form]',
      isPresent: isPresent(),
      fillIn: fillable(''),

      completePayment: {
        scope: '[data-test-complete-payment]'
      },

      paymentInfo: {
        scope: '[data-test-payment-info]'
      },

      flashErrorMessage: {
        scope: '.flash-message .message'
      },

      contactDetails: {
        scope: '[data-test-contact-details]',

        contactHeading: {
          scope: '[data-test-contact-heading]',
          text: text()
        },

        firstName: {
          scope: '[data-test-contact-firstName]',
          text: text()
        },

        company: {
          scope: '[data-test-contact-company]',
          text: text()
        },

        email: {
          scope: '[data-test-contact-email]',
          text: text()
        },

        contactEditButton: {
          scope: '[data-test-edit-contact-button]',
          text: text()
        },

        billingHeading: {
          scope: '[data-test-billing-heading]',
          text: text()
        },

        address: {
          scope: '[data-test-billing-address]',
          text: text()
        },

        city: {
          scope: '[data-test-billing-city]',
          text: text()
        },

        country: {
          scope: '[data-test-billing-country]',
          text: text()
        },

        billingEditButton: {
          scope: '[data-test-edit-billing-button]',
          text: text()
        }
      },

    },

    billingPlanChoices: {
      scope: '[data-test-billing-plan-choices]',
      isPresent: isPresent(),

      boxes: {
        scope: '[data-test-plan-box]',
      },

      lastBox: {
        visit: clickable('[data-test-plan-box]:last-child'),
      },
    },

    selectedPlan: {
      scope: '.highlight-plan',
      isHighlighted: hasClass('highlight-plan'),

      heading: {
        scope: '[data-test-selected-plan-heading]',
        text: text()
      },

      name: {
        scope: '.highlight-plan [data-test-selected-plan-name]',
        text: text()
      },

      credits: {
        scope: '.highlight-plan [data-test-selected-plan-credits]',
        text: text()
      },

      osscredits: {
        scope: '.highlight-plan [data-test-selected-plan-oss-credits]',
        text: text()
      },

      repos: {
        scope: '.highlight-plan [data-test-selected-plan-repos]',
        text: text()
      },

      os: {
        scope: '.highlight-plan [data-test-selected-plan-os]',
        text: text()
      },

      price: {
        scope: '.highlight-plan [data-test-selected-plan-price]',
        text: text()
      },

      changePlan: {
        scope: '[data-test-change-selected-plan]',
        text: text()
      },

      subscribeButton: {
        scope: '[data-test-subscribe-button]',
      }
    },

    warningMessage: {
      scope: '[data-test-warning-message]',
      text: text()
    },

    selectedAddonOverview: {
      scope: '.selected-plan',
      name: {
        scope: '[data-test-selected-addon-name]',
        text: text()
      },
      price: {
        scope: '[data-test-selected-addon-price]',
        text: text()
      },
      changeAddon: {
        scope: '[data-test-change-selected-addon]',
        text: text()
      }
    },

    selectedAddon: {
      scope: '.highlight-plan',
      price: {
        scope: '[data-test-selected-addon-price]',
        text: text()
      },
      name: {
        scope: '[data-test-selected-addon-name]',
        text: text()
      },
      desc: {
        scope: '[data-test-selected-addon-desc]',
        text: text()
      }
    },

    selectedPlanOverview: {
      scope: '[data-test-selected-plan]',

      heading: {
        scope: '[data-test-selected-plan-heading]',
        text: text()
      },

      name: {
        scope: '[data-test-selected-plan-name]',
        text: text()
      },

      credits: {
        scope: '[data-test-selected-plan-credits]',
        text: text()
      },

      osscredits: {
        scope: '[data-test-selected-plan-oss-credits]',
        text: text()
      },

      users: {
        scope: '[data-test-selected-plan-users]',
        text: text()
      },

      repos: {
        scope: '[data-test-selected-plan-repos]',
        text: text()
      },

      os: {
        scope: '[data-test-selected-plan-os]',
        text: text()
      },

      price: {
        scope: '[data-test-selected-plan-price]',
        text: text()
      },

      changePlan: {
        scope: '[data-test-change-selected-plan]',
        text: text()
      },

      subscribeButton: {
        scope: '[data-test-subscribe-button]',
      }
    },

    freeTierPlan: {
      scope: '.select-plan-free_tier_plan'
    },

    marketplaceButton: {
      scope: '.marketplace-button',
      href: attribute('href')
    },

    plan: {
      name: text('[data-test-plan-name]'),
      concurrency: {
        scope: '[data-test-plan-concurrency]'
      },
      description: {
        scope: '[data-test-plan-description]'
      }
    },

    manualSubscription: {
      banner: {
        scope: '[data-test-manual-subscription-banner]'
      }
    },

    trial: {
      scope: '.billing',
      bannerInformation: text('[data-test-help-text]'),
      overviewHeading: text('[data-test-overview-heading]'),
      buildsRunningOutBanner: text('[data-test-trial-running-out]'),
      buildsRanOutBanner: text('[data-test-trial-ran-out]'),
      subtext: text('[data-test-trial-subtext]'),
      name: {
        scope: '[data-test-trial-message]',
        hasRedText: hasClass('red'),
        text: text(),
      },
      openSourceMessage: {
        scope: '[data-test-open-source-box]',
        isPresent: isPresent(),
        heading: text('[data-test-open-source-header]'),
        body: text('[data-test-open-source-jobs]')
      },
      link: {
        scope: '[data-test-trial-link]',
        href: attribute('href')
      },
      activateButton: {
        scope: '[data-test-activate-button]',
        isDisabled: hasClass('disabled'),
        text: text()
      },
      subscribeMessage: {
        scope: '[data-test-subscribe-message]',
        text: text()
      }
    },

    education: {
      scope: '.billing',
      name: text('[data-test-education-message]'),
    },

    billingSubscription: {
      greyStatus: text('[data-test-grey-status]'),
      activeStatus: text('[data-test-active-status]'),
      canceledStatus: text('[data-test-grey-status]'),
      expiredStatus: text('[data-test-expired-status]'),
      manualStatus: text('[data-test-manual-status]')
    },

    userDetails: {
      scope: '[data-test-user-details]',
    },

    billingDetails: {
      scope: '[data-test-billing-details]'
    },

    source: text('[data-test-source]'),

    creditCardNumber: { scope: '[data-test-credit-card]' },
    price: { scope: '[data-test-price]' },

    period: {
      scope: '[data-test-selected-plan-period]',
      text: text()
    },

    annualInvitation: { scope: '[data-test-annual-invitation]' },

    expiryMessage: {
      scope: '[data-test-expiry-message]'
    },

    planMessage: {
      scope: '[data-test-plan-message]'
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
        invoiceCardStatus: text('td', { at: 3 }),
        invoiceUrl: {
          scope: '[data-test-invoice-url]',
          href: attribute('href'),
          isDisabled: hasClass('disabled')
        }
      }),
      invoiceTableHeaders: collection('[data-test-table-header-row] th'),

      invoiceSelectYear: {
        scope: '[data-test-invoice-select-year]'
      }
    },

    autoRefill: {
      scope: '.auto-refill',
      toggleText: text('auto-refill-name'),
    }
  },

  planUsage: {
    visit: clickable('li[data-test-plan-usage-tab] a'),
    page: {
      minutesTotal: {
        scope: '[data-test-plan-usage-minutes-total]',
        text: text()
      },
      senders: {
        scope: '[data-test-sender-build-times]',
        items: collection('[data-test-usage-sender]', {
          login: text('td', { at: 0 }),
          credits: text('td', { at: 1 }),
        })
      }
    },
    checkUserActivity: {
      visit: clickable('[data-test-plan-usage-check-user-activity]'),
      uniqueUsers: {
        scope: '[data-test-plan-usage-user-statistics-modal-unique-users]',
        text: text()
      },
      userName: {
        scope: '[data-test-plan-usage-user-statistics-modal-user-name]',
        text: text()
      },
      minutesConsumed: {
        scope: '[data-test-plan-usage-user-statistics-modal-minutes-consumed]',
        text: text()
      },
      creditsConsumed: {
        scope: '[data-test-plan-usage-user-statistics-modal-credits-consumed]',
        text: text()
      },
    }
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
        isHidden: isHidden(),
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
