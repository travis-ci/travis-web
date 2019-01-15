import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'li',
  classNameBindings: ['build.state'],
  classNames: ['row-li', 'pr-row'],

  isCronJob: computed('build.eventType', function () {
    let event = this.get('build.eventType');
    return event === 'cron';
  })
});
