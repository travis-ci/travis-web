import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['travis-switch', 'switch'],
  classNameBindings: ['_active:active'],

  _active: Ember.computed('target.active', 'active', function () {
    return this.get('target.active') || this.get('active');
  }),

  click() {
    let target;
    target = this.get('target');
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
