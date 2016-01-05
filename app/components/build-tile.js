import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['build.state'],
  attributeBindings: ['title'],

  title: function() {
    var num;
    num = this.get('build.number');
    return "#" + num;
  }.property('build')
});
