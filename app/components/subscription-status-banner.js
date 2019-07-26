import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'p',
  classNames: ['subscription-status'],
  classNameBindings: ['bannerColor'],

  bannerColor: computed('color', function () {
    return `notice-banner--${this.color}`;
  })
});
