import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['build.state'],
  attributeBindings: ['title'],

  title: function() {
    var num, state;
    num = this.get('build.number');
    state = this.get('build.state');
    return "Build #" + num + " " + state;
  }.property('build')
});
