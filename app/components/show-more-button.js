import Ember from 'ember';

const { alias } = Ember.computed;

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['showmore-button'],
  classNameBindings: ['isLoading', 'showMore'],
  showMore: true,
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
