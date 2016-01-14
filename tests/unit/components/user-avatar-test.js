import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-avatar', 'UserAvatarComponent | Unit', {

});

test('it renders', function() {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  var attributes = {
      type: 'organization',
      login: 'testuser',
      name: 'Test User',
      avatarUrl: 'https://0.gravatar.com/avatar/595cf623f3cde2fa64fc784884c4bfec'
  };

  var org = Ember.Object.create(attributes);
  var component = this.subject({user: org});
  this.append();

  ok(component.$().hasClass('avatar'), 'component should have right class');
  equal(component.$('.pseudo-avatar').data('initials'), 'TU', 'initials should be correct');
  equal(component.$('.real-avatar').attr('src'), 'https://0.gravatar.com/avatar/595cf623f3cde2fa64fc784884c4bfec', 'avatar shoudl be right');

});

test('it handles a missing user name', function() {

    var attr = {
        type: 'organization',
        login: 'testorg'
    };

    var org = Ember.Object.create(attr);
    var component = this.subject({user: org});
    this.append();

    equal(component.$('.pseudo-avatar').data('initials'), 'T', 'only one letter if there is no name');

});


test('can get avatars from commits', function() {


    var attr = {
        authorName: 'This is Author'
    };

    var user = Ember.Object.create(attr);
    var component = this.subject({user: user});
    this.append();

    equal(component.$('.real-avatar').attr('src'), 'https://www.gravatar.com/avatar/5e543256c480ac577d30f76f9120eb74?s=36&d=blank', 'get the right avatar url');

    equal(component.$('.pseudo-avatar').data('initials'), 'TI', 'gets right initials');

});
