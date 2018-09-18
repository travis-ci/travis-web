import Component from '@ember/component';
import colorForState from 'travis/utils/color-for-state';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  pollModels: 'job.build',

  @computed('job.state')
  color(jobState) {
    return colorForState(jobState);
  },
});
