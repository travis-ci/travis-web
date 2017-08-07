import Ember from 'ember';
import { computed } from 'ember-decorators/object';

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

  @computed('event')
  icon(event) {
    const iconName = eventToIcon[event] || eventToIcon.default;
    return `icon-${iconName}`;
  },

  @computed('event')
  title(event) {
    return eventToTitle[event] || eventToTitle.default;
  },
});
