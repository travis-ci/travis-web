import Component from '@ember/component';
import colorForState from 'travis/utils/color-for-state';
import { computed } from '@ember/object';

export default Component.extend({
  pollModels: 'job.build',

  color: computed('job.state', function () {
    let jobState = this.get('job.state');
    return colorForState(jobState);
  })
});
