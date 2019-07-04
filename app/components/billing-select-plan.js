import Component from '@ember/component';

export default Component.extend({
  didUpdateAttrs() {
    this._super(...arguments);
    this.set('plans', this.plans);
  },
});
