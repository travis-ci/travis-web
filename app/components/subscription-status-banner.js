import Component from '@ember/component';

export default Component.extend({
  tagName: 'p',
  classNameBindings: ['bannerColor'],
  bannerColor: function () {
    return `notice-banner--${this.color}`;
  }.property('bannerColor')
});
