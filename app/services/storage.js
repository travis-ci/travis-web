import Service from '@ember/service';

export default Service.extend({

  get signupUsers() {
    return JSON.parse(this.getItem('travis.signup.users')) || [];
  },
  set signupUsers(value) {
    this.setItem('travis.signup.users', JSON.stringify(value || []));
  },

  get storage() {
    return window.localStorage;
  },

  get token() {
    return this.getItem('travis.token');
  },

  get user() {
    return this.getItem('travis.user');
  },

  get authUpdatedAt() {
    return +this.getItem('travis.auth.updatedAt');
  },

  get isBecome() {
    return !!this.getItem('travis.auth.become');
  },

  get billingStep() {
    return +this.getItem('travis.billing_step');
  },

  get billingInfo() {
    try {
      return JSON.parse(this.getItem('travis.billing_info')) || {};
    } catch (e) {
      return {};
    }
  },

  get billingPlan() {
    try {
      return JSON.parse(this.getItem('travis.billing_plan')) || {};
    } catch (e) {
      return {};
    }
  },

  set billingInfo(value) {
    this.setItem('travis.billing_info', JSON.stringify(value));
  },

  set billingPlan(plan) {
    this.setItem('travis.billing_plan', JSON.stringify(plan));
  },

  set billingStep(step) {
    this.setItem('travis.billing_step', +step);
  },

  clearAuthData() {
    this.removeItem('travis.token');
    this.removeItem('travis.user');
    this.removeItem('travis.auth.updatedAt');
    this.removeItem('travis.auth.become');
  },

  clearBillingData() {
    this.storage.removeItem('travis.billing_step');
    this.storage.removeItem('travis.billing_plan');
    this.storage.removeItem('travis.billing_info');
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
  }

});
