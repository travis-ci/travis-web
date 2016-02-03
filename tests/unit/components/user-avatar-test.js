import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-avatar', 'UserAvatarComponent | Unit', {
  unit: true
});

test('it renders', function() {

  var name = "Hello Test";
  var url = "https://someurl.com/someimage.jpg";

  var component = this.subject({url: url, name: name});
  this.render();

  ok(component.$().hasClass('avatar'), 'component should have right class');
  equal(component.$('.pseudo-avatar').data('initials'), 'HT', 'initials should be correct');
  equal(component.$('.real-avatar').attr('src'), 'https://someurl.com/someimage.jpg', 'avatar should be right');
});
