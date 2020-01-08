import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { isEmpty } from '@ember/utils';

export default Service.extend({
  store: service(),
  features: service(),
  raven: service(),
  storage: service(),

  serverFlags: [],

  init() {
    this._super();
    this._setEnableAssemblaLogin();
    this._setEnableBitbucketLogin();
  },

  _setEnableAssemblaLogin() {
    const { enableAssemblaLogin } = this.storage;
    enableAssemblaLogin ? this.features.enable('enable-assembla-login') : this.features.disable('enable-assembla-login');
  },

  _setEnableBitbucketLogin() {
    const { enableBitbucketLogin } = this.storage;
    enableBitbucketLogin ? this.features.enable('enable-bitbucket-login') : this.features.disable('enable-bitbucket-login');
  },

  _setFlagState(flag) {
    const features = this.features;

    for (let flagName in flag) {
      return flag[flagName] ? features.enable(flagName) : features.disable(flagName);
    }
  },

  _setFlagStateFromStorage(flags) {
    return flags.map(flag => this._setFlagState(flag));
  },

  _storeRemoteFlagState(response) {
    const state = response.map((feature) => {
      let obj = {};
      obj[feature.get('dasherizedName')] = feature.get('enabled');
      return obj;
    });

    this.storage.features = state;

    return state;
  },

  fetchTask: task(function* ({forceServerRequest} = false) {
    try {
      // try to read from local storage first, fall back to API
      const localFlags = yield this.storage.features;

      if (!forceServerRequest && !isEmpty(localFlags)) {
        this._setFlagStateFromStorage(localFlags);
      } else {
        const featureSet = yield this.store.findAll('beta-feature');
        this.set('serverFlags', featureSet);
        const persisted = this._storeRemoteFlagState(featureSet);
        this._setFlagStateFromStorage(persisted);
        return featureSet;
      }
    } catch (e) {
      // TODO:
      // We are still thinking about how to handle a failure from a UX perspective.
      // For instance, we might want to show the user a flash message etc.
      this.raven.logException(e);
    }
  }).drop(),

  reset() {
    this.serverFlags.map(flag => {
      this.features.disable(flag.get('name').dasherize());
    });
  },
});
