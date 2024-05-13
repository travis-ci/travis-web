import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { not, reads, filterBy, alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import config from 'travis/config/environment';
import { countries, states, zeroVatThresholdCountries, nonZeroVatThresholdCountries, stateCountries } from 'travis/utils/countries';
import { isPresent } from '@ember/utils';
export default Component.extend({
  stripe: service(),
  store: service(),
  auth: service(),
  accounts: service(),
  flashes: service(),
  metrics: service(),
  storage: service(),
  router: service(),
  wizard: service('wizard-state'),
  countries,
  user: null,
  account: alias('accounts.user'),
  stripeElement: null,
  stripeLoading: false,
  couponId: null,
  options: config.stripeOptions,
  showSwitchToFreeModal: false,
  showPlanSwitchWarning: false,
  availablePlans: reads('account.eligibleV2Plans'),
  defaultPlans: filterBy('availablePlans', 'trialPlan'),
  defaultPlanId: reads('defaultPlans.firstObject.id'),
  showCancelButton: false,
  travisTermsUrl: 'https://www.ideracorp.com/Legal/PrivacyShield',
  travisPolicyUrl: 'https://www.ideracorp.com/Legal/PrivacyShield',
  subscription: null,
  vatId: null,

  displayedPlans: reads('availablePlans'),

  selectedPlan: computed('displayedPlans.[].id', 'defaultPlanId', {
    get() {
      if (isPresent(this._selectedPlan)) {
        return this._selectedPlan;
      }

      let plan = this.storage.selectedPlanId;
      if (plan == null) {
        plan = this.defaultPlanId;
      }

      return this.displayedPlans.findBy('id', plan);
    },
    set(k, v) {
      this.set('_selectedPlan', v);
      return this._selectedPlan;
    }}),

  isTrial: computed('selectedPlan', function () {
    let plan = this.selectedPlan;
    return plan ? plan.isTrial : true;
  }),

  hasLocalRegistration: false,

  firstName: '',
  lastName: '',
  company: '',
  address: '',
  city: '',
  country: '',
  billingEmail: '',
  billingEmails: computed('billingEmail', function () {
    return (this.billingEmail || '').split(',');
  }),

  states: computed('country', function () {
    const { country } = this;

    return states[country];
  }),

  isStateCountry: computed('country', function () {
    const { country } = this;

    return !!country && stateCountries.includes(country);
  }),

  isZeroVatThresholdCountry: computed('country', function () {
    const { country } = this;
    return !!country && zeroVatThresholdCountries.includes(country);
  }),

  isNonZeroVatThresholdCountry: computed('country', function () {
    const { country } = this;
    return !!country && nonZeroVatThresholdCountries.includes(country);
  }),

  isVatMandatory: computed('isNonZeroVatThresholdCountry', 'hasLocalRegistration', function () {
    const { isNonZeroVatThresholdCountry, isZeroVatThresholdCountry, hasLocalRegistration } = this;
    return isZeroVatThresholdCountry || (isNonZeroVatThresholdCountry ? hasLocalRegistration : false);
  }),

  showNonZeroVatConfirmation: reads('isNonZeroVatThresholdCountry'),

  showVatField: computed('country', 'isNonZeroVatThresholdCountry', 'hasLocalRegistration', function () {
    const { country, isNonZeroVatThresholdCountry, hasLocalRegistration } = this;
    return country && (isNonZeroVatThresholdCountry ? hasLocalRegistration : true);
  }),

  isStateMandatory: reads('isStateCountry'),

  isLoading: false,
  planDetailsVisible: false,

  isNewSubscription: not('subscription.id'),

  creditCardInfo: null,

  creditCardInfoEmpty: computed('subscription.creditCardInfo', function () {
    return !this.creditCardInfo.lastDigits;
  }),

  getPriceInfo: computed('selectedPlan', function () {
    let plan = this.selectedPlan;
    return `$${plan.startingPrice} ${(plan.isAnnual ? ' annualy' : ' monthly')}`;
  }),

  getActivateButtonText: computed('selectedPlan', function () {
    let text = 'Verify Your Account';
    let plan = this.selectedPlan;
    if (plan && !plan.isTrial) {
      text = `Activate ${plan.name}`;
    }
    return text;
  }),

  canActivate: computed('country', 'zipCode', 'address', 'lastName', 'firstName', 'city', 'stripeElement', 'billingEmail', function () {
    let valid = (val) => !(val === null || val.trim() === '');
    return valid(this.billingEmail) && valid(this.country) &&
           valid(this.zipCode) && valid(this.address) &&
           valid(this.lastName) && valid(this.firstName) &&
           this.stripeElement && valid(this.city);
  }),

  createSubscription: task(function* () {
    this.metrics.trackEvent({
      action: 'Pay Button Clicked',
      category: 'Subscription',
    });
    const { stripeElement, selectedPlan } = this;
    try {
      this.set('subscription', this.newV2Subscription());
      const { token } = yield this.stripe.createStripeToken.perform(stripeElement);
      if (token) {
        const organizationId = null;
        const plan = selectedPlan && selectedPlan.id && this.store.peekRecord('v2-plan-config', selectedPlan.id);
        const org = organizationId && this.store.peekRecord('organization', organizationId);

        this.subscription.setProperties({
          organization: org,
          plan: plan,
          v1SubscriptionId: this.v1SubscriptionId,
        });
        if (!this.subscription.id) {
          this.subscription.creditCardInfo.setProperties({
            token: token.id,
            lastDigits: token.card.last4
          });
          this.subscription.setProperties({
            coupon: this.couponId
          });
          const { clientSecret } = yield this.subscription.save();
          yield this.stripe.handleStripePayment.perform(clientSecret);
        } else {
          yield this.subscription.creditCardInfo.updateToken.perform({
            subscriptionId: this.subscription.id,
            tokenId: token.id,
            tokenCard: token.card
          });
          yield this.subscription.save();
          yield this.subscription.changePlan.perform(selectedPlan.id, this.couponId);
          yield this.accounts.fetchV2Subscriptions.perform();
          yield this.retryAuthorization.perform();
        }
        this.metrics.trackEvent({ button: 'pay-button' });
        this.storage.clearBillingData();
        this.storage.clearSelectedPlanId();
        this.storage.wizardStep = 2;
        this.wizard.update.perform(2);
        yield this.accounts.fetchV2Subscriptions.perform().then(() => {
          this.router.transitionTo('/account/repositories');
        });
      }
      this.flashes.success('Your account has been successfully activated');
    } catch (error) {
      yield this.accounts.fetchV2Subscriptions.perform().then(() => {
        if (this.accounts.user.subscription || this.accounts.user.v2subscription) {
          this.storage.clearBillingData();
          this.storage.clearSelectedPlanId();
          this.storage.wizardStep = 2;
          this.wizard.update.perform(2);
          this.router.transitionTo('account.repositories');
        } else {
          this.handleError();
        }
      });
    }
  }).drop(),

  skipSubscription() {
    this.storage.clearBillingData();
    this.storage.clearSelectedPlanId();
    this.storage.wizardStep = 2;
    this.wizard.update.perform(2);
    this.router.transitionTo('account.repositories');
  },

  newV2Subscription() {
    const plan = this.store.createRecord('v2-plan-config');
    const billingInfo = this.store.createRecord('v2-billing-info');
    const creditCardInfo = this.store.createRecord('v2-credit-card-info');
    let empty = (val) => val === null || val.trim() === '';
    if (empty(this.lastName) || empty(this.address) ||
        empty(this.city) || empty(this.zipCode) ||
        empty(this.country) || empty(this.billingEmail)
    ) {
      throw new Error('Fill all required fields');
    }
    billingInfo.setProperties({
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      city: this.city,
      company: this.company,
      zipCode: this.zipCode,
      country: this.country,
      state: this.state,
      billingEmail: this.billingEmail,
      hasLocalRegistration: this.hasLocalRegistration,
      vatId: this.vatId
    });
    creditCardInfo.setProperties({
      token: '',
      lastDigits: ''
    });
    return this.store.createRecord('v2-subscription', {
      billingInfo,
      plan,
      creditCardInfo,
    });
  },
  handleError() {
    let message = this.get('selectedPlan.isTrial')
      ? 'Credit card verification failed, please try again or use a different card.'
      : 'An error occurred when creating your subscription. Please try again.';
    this.flashes.error(message);
  },

  validateCoupon: task(function* () {
    return yield this.store.findRecord('coupon', this.couponId, {
      reload: true,
    });
  }).drop(),

  coupon: reads('validateCoupon.last.value'),
  couponError: reads('validateCoupon.last.error'),
  isValidCoupon: reads('coupon.valid'),
  couponHasError: computed('couponError', {
    get() {
      return !!this.couponError;
    },
    set(key, value) {
      return value;
    }
  }),

  trialEndDate: computed(() => {
    let futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);
    return futureDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }),

  actions: {
    complete(stripeElement) {
      this.set('stripeElement', stripeElement);
    },
    handleCouponFocus() {
      this.set('couponHasError', false);
    },

    clearCreditCardData() {
      this.subscription.set('creditCardInfo', null);
    },
    changePlan() {
      this.set('showPlansSelector', true);
    },
    closePlansModal() {
      this.set('showPlansSelector', false);
    },
    verifyAccount() {

    },
    subscribe() {
      if  (this.canActivate) {
        this.createSubscription.perform();
      }
    },
    skipActivation() {
      this.skipSubscription();
    },
    changeCountry(country) {
      this.set('country', country);
      this.set('hasLocalRegistration', false);
    },
    togglePlanDetails() {
      this.set('planDetailsVisible', !this.planDetailsVisible);
    }

  }
});
