import Ember from 'ember';
import { or } from 'ember-decorators/object/computed';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['travis-switch', 'switch'],
  classNameBindings: ['_active:active'],

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
    return Ember.run.next(this, function () {
      return this.sendAction('action', target);
    });
  }
});
