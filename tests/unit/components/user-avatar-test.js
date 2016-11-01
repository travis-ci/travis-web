// TODO: Convert this to full-on integration test
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('user-avatar', 'UserAvatarComponent | Unit', {
  unit: true
});

test('it renders', function () {
  var name = 'Hello Test';
  var url = '/images/travis-crying.png';

  var component = this.subject({ url: url, name: name });
  this.render();

  ok(component.$().hasClass('avatar'), 'component should have right class');
  equal(component.$('.pseudo-avatar').data('initials'), 'HT', 'initials should be correct');
  equal(component.$('.real-avatar').attr('src'), '/images/travis-crying.png', 'avatar should be right');
});
