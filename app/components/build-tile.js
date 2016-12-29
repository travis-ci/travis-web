import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['build.state'],
  attributeBindings: ['title'],

  title: Ember.computed('build', function () {
    let num, state;
    num = this.get('build.number');
    state = this.get('build.state');
    if (num) {
      return `Build #${num} ${state}`;
    } else {
      return '';
    }
  })
});
