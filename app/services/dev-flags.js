import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { dasherize } from '@ember/string';

export default Service.extend({
  features: service(),
  storage: service(),

  load: task(function* () {
    try {
      // try to read from local storage
      const item = yield this.storage.getItem('travis.dev');
      const localFlags = yield JSON.parse(item);

      Object.entries(localFlags).forEach(([flagKey, flagVal]) => {
        const fullKey = `dev-${dasherize(flagKey)}`;

        if (flagVal === true) {
          this.features.enable(fullKey);
        } else if (flagVal === false) {
          this.features.disable(fullKey);
        }
      });
    } catch (e) {
    }
  }).drop(),
});
