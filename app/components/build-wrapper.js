import Component from '@ember/component';
import { computed } from '@ember/object';
import colorForState from 'travis/utils/color-for-state';

export default Component.extend({
  classNameBindings: ['color'],
  pollModels: 'build',

  color: computed('build.state', function () {
    let buildState = this.get('build.state');
    return colorForState(buildState);
  })
});
