import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { or, not, reads, filterBy, alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { typeOf } from '@ember/utils';
import config from 'travis/config/environment';
import { countries,states,zeroVatThresholdCountries, nonZeroVatThresholdCountries, stateCountries } from 'travis/utils/countries';

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
  states: computed('country', function() {
    const { country } = this;
    return states[country];
  }),

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
  travisTermsUrl: "/terms",
  travisPolicyUrl: "/policy",
  subscription: null,
  vatId: null,

  displayedPlans: reads('availablePlans'),

  selectedPlan: computed('displayedPlans.[].id', 'defaultPlanId', function () {
    let plan = this.storage.selectedPlanId;
    if (plan == null) {
      plan = this.defaultPlanId;
    }

    return this.displayedPlans.findBy('id', plan);
  }),

  isTrial: computed('selectedPlan', function () {
    let plan = this.selectedPlan;
    return plan ? plan.isTrial : true;
  }),

  hasLocalRegistration: false,
  firstName: "",
  lastName: "",
  company: "",
  address: "",
  city: "",
  country: "",
  billingEmail: "",
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
  creditCardOwner: null,

  creditCardInfoEmpty: computed('subscription.creditCardInfo', function () {
    return !this.creditCardInfo.lastDigits;
  }),

  getPriceInfo: computed('selectedPlan', function() {
    let plan = this.selectedPlan;
    console.log(plan);
    return '$' + plan.startingPrice + (plan.isAnnual ? ' annualy' :' monthly');
  }),

  getActivateButtonText: computed('selectedPlan', function() {
    let text = "Verify Your Account";
    let plan = this.selectedPlan;
    if (plan && !plan.isTrial) {
      text = "Activate " + plan.name;
    }
    return text;
  }),

  canActivate: computed('country','zipCode','address','creditCardOwner','city', 'stripeElement', 'billingEmail', function() {
    return this.billingEmail && this.country && this.zipCode && this.address && this.creditCardOwner && this.stripeElement && this.city;
  }),

 

  createSubscription: task(function* () {
    this.metrics.trackEvent({
      action: 'Pay Button Clicked',
      category: 'Subscription',
    });
    const { stripeElement, account, selectedPlan } = this;
    try {
      this.set('subscription',this.newV2Subscription());
      
      const { token } = yield this.stripe.createStripeToken.perform(stripeElement);
      
      if (token) {
        const organizationId = null;// account.type === 'organization' ? +(account.id) : null;
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
        this.router.transitionTo('/account/repositories');

      }
      this.flashes.success("Your account has been successfully activated");
    } catch (error) {
      this.handleError();
    }
  }).drop(),

  newV2Subscription() {
    const plan = this.store.createRecord('v2-plan-config');
    const billingInfo = this.store.createRecord('v2-billing-info');
    const creditCardInfo = this.store.createRecord('v2-credit-card-info');
    billingInfo.setProperties({
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      city: this.city,
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

  actions: {
    complete(stripeElement) {
      this.set('stripeElement', stripeElement);
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
      this.createSubscription.perform();
    },
    changeCountry(country) {
      this.set('country', country);
      this.hasLocalRegistration = false;
    },
    togglePlanDetails() {
     this.set('planDetailsVisible', !this.planDetailsVisible);
    }

  }
});
