import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['showmore-button'],
  classNameBindings: ['isLoading', 'showMore'],
  showMore: true,
  attributeBindings: ['disabled'],
  disabledBinding: 'isLoading',

  buttonLabel: function() {
    if (this.get('isLoading')) {
      return 'Loading';
    } else {
      return 'Show more';
    }
  }.property('isLoading'),

  click() {
    return this.attrs.showMore();
  }
});
