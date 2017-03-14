import Ember from 'ember';

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

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['request-icon', 'icon'],
  classNameBindings: ['event', 'state', 'title'],
  attributeBindings: ['title'],

  icon: Ember.computed('event', function () {
    const event = this.get('event');
    const iconName = eventToIcon[event] || eventToIcon.default;

    return `icon-${iconName}`;
  }),

  title: Ember.computed('event', function () {
    const event = this.get('event');
    return eventToTitle[event] || eventToTitle.default;
  })
});
