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

  get authUpdatedAt() {
    return +this.getItem('travis.auth.updatedAt');
  },

  get user() {
    return this.getItem('travis.user');
  },

  clearAuthData() {
    this.removeItem('travis.token');
    this.removeItem('travis.user');
    this.removeItem('travis.auth.updatedAt');
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
