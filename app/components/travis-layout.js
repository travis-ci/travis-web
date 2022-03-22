import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: ['layoutClass'],

  layoutName: '',

  activeModel: null,
  model: reads('activeModel'),

  layoutClass: computed('layoutName', function () {
    return this.layoutName.replace('layouts/', 'layout--');
  })
});
