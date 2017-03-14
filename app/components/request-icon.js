import Ember from 'ember';

const eventToIcon = {
  push: 'push',
  pull_request: 'pullrequest',
  cron: 'cronjobs',
  api: 'api'
};

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['request-icon', 'icon'],
  classNameBindings: ['event', 'state'],

  icon: Ember.computed('event', function () {
    const event = this.get('event');
    const defaultIcon = 'nobuilds';
    const iconName = eventToIcon[event] || defaultIcon;

    return `icon-${iconName}`;
  })
});
