import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Component.extend({
  tagName: 'button',
  classNames: ['showmore-button', 'button'],
  classNameBindings: ['isLoading'],
  attributeBindings: ['disabled'],

  @alias('isLoading') disabled: null,

  @computed('isLoading')
  buttonLabel(loading) {
    if (loading) {
      return 'Loading';
    }
    return 'Show more';
  },

  click() {
    return this.attrs.showMore();
  },
});
