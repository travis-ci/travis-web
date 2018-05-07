import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  tagName: 'p',
  classNames: ['subscription-status'],
  classNameBindings: ['bannerColor'],

  @computed('color')
  bannerColor: function (color) {
    return `notice-banner--${color}`;
  }
});
