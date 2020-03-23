import Service, { inject as service } from '@ember/service';
import parseWithDefault from 'travis/utils/json-parser';

export default Service.extend({
  auth: service('storage/auth'),

  get signupUsers() {
    return JSON.parse(this.getItem('travis.signup.users')) || [];
  },
  set signupUsers(value) {
    this.setItem('travis.signup.users', JSON.stringify(value || []));
  },

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
    this.storage.removeItem('travis.billing_step');
    this.storage.removeItem('travis.billing_plan');
    this.storage.removeItem('travis.billing_info');
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
