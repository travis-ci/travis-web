// TODO: Convert this to full-on integration test
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('user-avatar', 'UserAvatarComponent | Unit', {
  unit: true
});

test('it renders', function (assert) {
  const name = 'Hello Test';
  const url = 'https://someurl.com/someimage.jpg';

  const component = this.subject({ url: url, name: name });
  this.render();

  assert.ok(component.$().hasClass('avatar'), 'component should have right class');
  assert.equal(component.$('.pseudo-avatar').data('initials'), 'HT', 'initials should be correct');
  assert.equal(component.$('.real-avatar').attr('src'), 'https://someurl.com/someimage.jpg', 'avatar should be right');
});
