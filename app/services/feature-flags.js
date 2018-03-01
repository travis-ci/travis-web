import Service from '@ember/service';
import { task } from 'ember-concurrency';
import { service } from 'ember-decorators/service';
import { isEmpty } from '@ember/utils';

export default Service.extend({
  @service store: null,
  @service features: null,
  @service raven: null,
  @service storage: null,

  serverFlags: [],

  _setFlagState(flag) {
    const features = this.get('features');

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

    this.get('storage').setItem('travis.features', JSON.stringify(state));

    return state;
  },

  fetchTask: task(function* ({forceServerRequest} = false) {
    try {
      // try to read from local storage first, fall back to API
      const localFlags = yield JSON.parse(this.get('storage').getItem('travis.features'));

      if (!forceServerRequest && !isEmpty(localFlags)) {
        this._setFlagStateFromStorage(localFlags);
      } else {
        const featureSet = yield this.get('store').findAll('beta-feature');
        this.set('serverFlags', featureSet);
        const persisted = this._storeRemoteFlagState(featureSet);
        this._setFlagStateFromStorage(persisted);
        return featureSet;
      }
    } catch (e) {
      // TODO:
      // We are still thinking about how to handle a failure from a UX perspective.
      // For instance, we might want to show the user a flash message etc.
      this.get('raven').logException(e);
    }
  }).drop(),

  reset() {
    this.get('serverFlags').map(flag => {
      this.get('features').disable(flag.get('name').dasherize());
    });
  },
});
