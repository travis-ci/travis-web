import { next } from '@ember/runloop';
import Component from '@ember/component';
import { or } from 'ember-decorators/object/computed';

export default Component.extend({
  tagName: 'button',
  classNames: ['travis-switch', 'switch'],
  classNameBindings: ['_active:active'],

  attributeBindings: ['type'],
  type: 'button',

  @or('target.active', 'active') _active: null,

  click() {
    let target = this.get('target');
    if (this.get('toggleAutomatically') !== 'false') {
      if (target) {
        this.set('target.active', !this.get('target.active'));
      } else {
        this.set('active', !this.get('active'));
      }
    }
    return next(this, function () {
      return this.sendAction('action', target);
    });
  }
});
