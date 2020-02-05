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
    return this.getItem('travis.token') || '';
  },
  deleteToken() {
    this.removeItem('travis.token');
  },

  get user() {
    const data = this.parseWithDefault('travis.user', null);
    return data && data.user || data;
  },
  deleteUser() {
    this.removeItem('travis.user');
  },

  get accounts() {
    return this.parseWithDefault('travis.auth.accounts', []);
  },
  set accounts(value) {
    this.setItem('travis.auth.accounts', JSON.stringify(value));
  },

  get activeAccount() {
    const { accounts } = this;
    const activeAccountId = +this.getItem('travis.auth.activeAccountId');
    const activeAccount = accounts.find(account => +account.id === activeAccountId);
    return activeAccount || accounts.firstObject || null;
  },
  set activeAccount(account) {
    if (account && account.id) {
      this.setItem('travis.auth.activeAccountId', account.id);
    } else {
      this.removeItem('travis.auth.activeAccountId');
    }
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

  clearAuthData() {
    this.removeItem('travis.token');
    this.removeItem('travis.user');
    this.removeItem('travis.auth.updatedAt');
    this.removeItem('travis.auth.become');
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
    try {
      return JSON.parse(this.getItem(key)) || defaultValue;
    } catch (e) {
      return defaultValue;
    }
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
