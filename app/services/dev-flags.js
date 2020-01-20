import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { dasherize } from '@ember/string';
import { warn } from '@ember/debug';

export default Service.extend({
  features: service(),
  storage: service(),

  getFullKey(flag) {
    const dashKey = dasherize(flag);
    return dashKey.startsWith('dev-') ? dashKey : `dev-${dashKey}`;
  },
  enable(flag) {
    const fullKey = this.getFullKey(flag);
    this.features.enable(fullKey);
  },
  disable(flag) {
    const fullKey = this.getFullKey(flag);
    this.features.disable(fullKey);
  },
  isEnabled(flag) {
    const fullKey = this.getFullKey(flag);
    return this.features.isEnabled(fullKey);
  },

  load: task(function* () {
    try {
      // try to read from local storage
      const item = yield this.storage.getItem('travis.dev');
      const localFlags = yield JSON.parse(item);

      if (localFlags) {
        Object.entries(localFlags).forEach(([flagKey, flagVal]) => {
          if (flagVal === true) {
            this.enable(flagKey);
          } else if (flagVal === false) {
            this.disable(flagKey);
          }
        });
      }
    } catch (e) {
      warn(`Dev flags load error: ${e}`, {id: 'travis.dev-flags.load'});
    }
  }).drop(),
});
