import Service, { inject as service } from '@ember/service';

export default Service.extend({
  auth: service('storage/auth'),
  utm: service('storage/utm'),

  get billingStep() {
    return +this.getItem('travis.billing_step');
  },
  set billingStep(value) {
    this.setItem('travis.billing_step', +value);
  },

  get billingInfo() {
    return this.parseWithDefault('travis.billing_info', {});
  },
  set billingInfo(value) {
    this.setItem('travis.billing_info', JSON.stringify(value));
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
