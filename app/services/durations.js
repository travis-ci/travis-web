import Service from '@ember/service';
import { computed } from '@ember/object';
import config from 'travis/config/environment';

const { environment } = config;
const isTest = environment === 'test';

export const DURATION_NAMES = {
  QUICK: 'quick',
};

export const DURATIONS = {
  [DURATION_NAMES.QUICK]: 200,
};

export const getDuration = (duration) => (isTest ? 0 : DURATIONS[duration]);


export default Service.extend({
  off: isTest,

  getDuration(name) {
    return this.off ? 0 : DURATIONS[name];
  },

  quick: computed('off', function () {
    return this.getDuration(DURATION_NAMES.QUICK);
  }),
});
