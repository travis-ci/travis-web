// TODO: Convert this to full-on integration test
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('user-avatar', 'UserAvatarComponent | Unit', {
  unit: true
});

test('it renders', function (assert) {
  const name = 'Hello Test';
  const url = 'https://someurl.com/someimage.jpg';

  const component = this.subject({ url: url, name: name, size: 38 });
  this.render();

  assert.ok(component.$().hasClass('avatar'), 'component should have right class');
  assert.equal(component.$('.pseudo-avatar').data('initials'), 'HT', 'initials should be correct');
  assert.equal(component.$('.real-avatar').attr('src'), 'https://someurl.com/someimage.jpg?v=3&s=38', 'avatar should display fallback image');
  assert.equal(component.$('.real-avatar').attr('srcset'), 'https://someurl.com/someimage.jpg?v=3&s=38 1x, https://someurl.com/someimage.jpg?v=3&s=76 2x', 'should provide a low and high res avatar');
});
