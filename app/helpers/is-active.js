import Ember from 'ember';

const { Helper, inject } = Ember;

export default Helper.extend({
  router: inject.service(),

  compute([value, ...models]) {
    return this.get('router').isActive(value, ...models);
  }
});
