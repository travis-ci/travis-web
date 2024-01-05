import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, action } from '@ember/object';
import { reads, empty, bool, not, and, or } from '@ember/object/computed';
import {tracked} from "@glimmer/tracking";

export default class BillingAccount extends Component {
  @service store;
  @service accounts;

  @tracked account = null;

  @reads('account.subscription') subscription;
  @reads('account.v2subscription') v2subscription;
  @empty('v2subscription') isV2SubscriptionEmpty;
  @empty('subscription') isSubscriptionEmpty;
  @and('isSubscriptionEmpty', 'isV2SubscriptionEmpty') isSubscriptionsEmpty;
  @not('isV2SubscriptionEmpty') hasV2Subscription;
  @reads('account.trial') trial;
  @bool('account.education') isEducationalAccount;
  @not('isEducationalAccount') isNotEducationalAccount;

  @and('isSubscriptionsEmpty', 'isNotEducationalAccount') isTrial;
  @bool('subscription.isManual') isManual;
  @bool('subscription.managedSubscription') isManaged;
  @and('isSubscriptionsEmpty', 'isEducationalAccount') isEducation;

  @computed('isManaged', 'hasV2Subscription', 'isTrialProcessCompleted', 'isEduProcessCompleted')
  get isSubscription() {
    return (this.isManaged || this.hasV2Subscription) && this.isTrialProcessCompleted && this.isEduProcessCompleted;
  }

  @computed('showPlansSelector', 'showAddonsSelector')
  get showInvoices() {
    return !this.showPlansSelector && !this.showAddonsSelector && this.invoices;
  }

  @or('accounts.fetchSubscriptions.isRunning', 'accounts.fetchV2Subscriptions.isRunning') isLoading;

  showPlansSelector = false;
  showAddonsSelector = false;

  @computed('isTrial')
  get isTrialProcessCompleted() {
    return !this.isTrial;
  }

  @computed('isEducation')
  get isEduProcessCompleted() {
    return !this.isEducation;
  }

  @computed('store')
  get newV2Subscription() {
    const plan = this.store.createRecord('v2-plan-config');
    const billingInfo = this.store.createRecord('v2-billing-info');
    const creditCardInfo = this.store.createRecord('v2-credit-card-info');
    billingInfo.setProperties({
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      zipCode: '',
      country: '',
      billingEmail: ''
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
  }

  @computed('subscription.id', 'v2subscription.id')
  get invoices() {
    const subscriptionId = this.isV2SubscriptionEmpty ? this.get('subscription.id') : this.get('v2subscription.id');
    const type = this.isV2SubscriptionEmpty ? 1 : 2;
    if (subscriptionId) {
      return this.store.query('invoice', { type, subscriptionId });
    } else {
      return [];
    }
  }
}
