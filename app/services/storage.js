import Service, { inject as service } from '@ember/service';

export default Service.extend({
  auth: service('storage/auth'),
  utm: service('storage/utm'),
  store: service(),

  get validToFetchInterval() {
    return this.getItem('travis.valid_to_fetch_interval');
  },

  set validToFetchInterval(value) {
    if (value === null) {
      this.removeItem('travis.valid_to_fetch_interval');
      return;
    }
    this.setItem('travis.valid_to_fetch_interval', +value);
  },

  get billingStep() {
    return +this.getItem('travis.billing_step');
  },
  set billingStep(value) {
    this.setItem('travis.billing_step', +value);
  },

  get wizardStep() {
    return +this.getItem('travis.wizard_step');
  },
  set wizardStep(value) {
    this.setItem('travis.wizard_step', +value);
  },

  get selectedPlanId() {
    return this.getItem('travis.billing_selected_plan_id');
  },
  set selectedPlanId(value) {
    this.setItem('travis.billing_selected_plan_id', value);
  },
  clearSelectedPlanId() {
    this.removeItem('travis.billing_selected_plan_id');
  },


  get billingInfo() {
    return this.parseWithDefault('travis.billing_info', {});
  },
  set billingInfo(value) {
    if (!value) {
      this.setItem('travis.billing_info', value);
      return;
    }

    const data
        = (({
          address,
          address2,
          billingEmail,
          billingEmailRO,
          city,
          company,
          country,
          firstName,
          lastName,
          hasLocalRegistration,
          id,
          isReloading,
          state,
          subscription,
          vatId,
          zipCode,
          notifications}) =>
          ({
            address,
            address2,
            billingEmail,
            billingEmailRO,
            city,
            company,
            country,
            firstName,
            lastName,
            hasLocalRegistration,
            id,
            isReloading,
            state,
            subscription,
            vatId,
            zipCode,
            notifications
          }))(value);

    this.dataSubscription(data).then((datum) => this.setItem('travis.billing_info', JSON.stringify(datum)));
  },

  async dataSubscription(data) {
    data.subscription = await data.subscription;
    const model = data.subscription;
    const snapshot = model._createSnapshot();
    const serializer = this.store.serializerFor('subscription');
    const serializedData = serializer.serialize(snapshot);
    data.subscription = serializedData;

    return data;
  },

  get billingPlan() {
    return this.parseWithDefault('travis.billing_plan', {});
  },
  set billingPlan(value) {
    this.setItem('travis.billing_plan', JSON.stringify(value));
  },

  clearPreferencesData() {
    this.removeItem('travis.features');
  },

  clearBillingData() {
    this.removeItem('travis.billing_step');
    this.removeItem('travis.billing_plan');
    this.removeItem('travis.billing_info');
  },

  parseWithDefault(key, defaultValue) {
    return parseWithDefault(this.getItem(key), defaultValue);
  },

  // method proxies

  getItem(key) {
    return this.storage.getItem(key);
  },

  setItem(key, value) {
    return this.storage.setItem(key, value);
  },

  removeItem(key) {
    return this.storage.removeItem(key);
  },

  clear() {
    return this.storage.clear();
  },

  get storage() {
    return window.localStorage;
  },

});

export function parseWithDefault(json, defaultValue) {
  try {
    return JSON.parse(json) || defaultValue;
  } catch (e) {
    return defaultValue;
  }
}
