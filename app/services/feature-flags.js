import Service, { inject as service } from '@ember/service';
import parseWithDefault from 'travis/utils/json-parser';
import { task } from 'ember-concurrency';
import { isEmpty } from '@ember/utils';

export default Service.extend({
  store: service(),
  features: service(),
  raven: service(),
  auth: service(),
  storage: service(),

  serverFlags: [],

  init() {
    this._super();
    this._setEnableAssemblaLogin();
    this._setEnableGitlabLogin();
  },

  _setEnableAssemblaLogin() {
    const { enableAssemblaLogin } = window.localStorage;
    if (enableAssemblaLogin == 'true')
      this.features.enable('enable-assembla-login');
    else if (enableAssemblaLogin == 'false')
      this.features.disable('enable-assembla-login');
  },

  _setEnableGitlabLogin() {
    const { enableGitlabLogin } = window.localStorage;
    if (enableGitlabLogin == 'true')
      this.features.enable('gitlab-login');
    else if (enableGitlabLogin == 'false')
      this.features.disable('gitlab-login');
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

    const oldFeatureState = parseWithDefault(this.storage.getItem('travis.features'), {});
    this.storage.setItem('travis.features', JSON.stringify({
      ...oldFeatureState,
      [this.auth.userName]: state
    }));

    return state;
  },

  fetchTask: task(function* ({forceServerRequest} = false) {
    try {
      // try to read from local storage first, fall back to API
      const localFlags = yield parseWithDefault(this.storage.getItem('travis.features'), {});

      if (!forceServerRequest && !isEmpty(localFlags) && !isEmpty(localFlags[this.auth.userName])) {
        this._setFlagStateFromStorage(localFlags[this.auth.userName]);
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

  _persistToLocalStorage(feature, status) {
    const featureState = parseWithDefault(this.storage.getItem('travis.features'), {});
    const currentUserFeatureState = featureState[this.auth.userName];
    const idx = currentUserFeatureState.findIndex(f => Object.keys(f)[0] === feature);
    if (idx !== -1) {
      currentUserFeatureState.splice(idx, 1);
    }
    currentUserFeatureState.pushObject({ [feature]: status });
    this.storage.setItem('travis.features', JSON.stringify({
      ...featureState,
      [this.auth.userName]: currentUserFeatureState
    }));
  },

  applyFeatureState(feature) {
    const features = this.features;
    let { name, enabled } = feature;

    enabled ? features.enable(name) : features.disable(name);
    this._persistToLocalStorage(name, enabled);
  },

  reset() {
    this.serverFlags.map(flag => {
      this.features.disable(flag.get('name').dasherize());
    });
  },
});
