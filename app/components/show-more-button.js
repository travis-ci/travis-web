import Ember from 'ember';

const { alias } = Ember.computed;

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['showmore-button', 'button'],
  classNameBindings: ['isLoading'],
  attributeBindings: ['disabled'],
  disabled: alias('isLoading'),

  buttonLabel: Ember.computed('isLoading', function () {
    if (this.get('isLoading')) {
      return 'Loading';
    } else {
      return 'Show more';
    }
  }),

  click() {
    return this.attrs.showMore();
  }
});
