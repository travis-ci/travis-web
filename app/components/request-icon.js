import Component from '@ember/component';
import { computed } from '@ember/object';

const eventToIcon = {
  push: 'push',
  pull_request: 'pullrequest',
  cron: 'cronjobs',
  api: 'api',
  default: 'nobuilds'
};

const eventToTitle = {
  push: 'Triggered by a push',
  pull_request: 'Triggered from a pull request',
  cron: 'Triggered by a cron job',
  api: 'Triggered via the API',
  default: 'Triggered via unknown means'
};

export default Component.extend({
  tagName: 'span',
  classNameBindings: ['event', 'state'],
  attributeBindings: ['title'],

  icon: computed('event', function () {
    let event = this.event;
    const iconName = eventToIcon[event] || eventToIcon.default;
    return `icon-${iconName}`;
  }),

  title: computed('event', function () {
    let event = this.event;
    return eventToTitle[event] || eventToTitle.default;
  })
});
