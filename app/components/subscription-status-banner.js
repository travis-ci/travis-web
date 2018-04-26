import Component from '@ember/component';

export default Component.extend({
  tagName: 'p',
  classNames: ['subscription-status'],
  classNameBindings: ['bannerColor'],
  bannerColor: function () {
    return `notice-banner--${this.color}`;
  }.property('bannerColor')
});
