// TODO: Convert this to full-on integration test
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('user-avatar', 'UserAvatarComponent | Unit', {
  unit: true
});

test('it renders', function () {
  const name = 'Hello Test';
  const url = 'https://someurl.com/someimage.jpg';

  const component = this.subject({ url, name });
  this.render();

  ok(component.$().hasClass('avatar'), 'component should have right class');
  equal(component.$('.pseudo-avatar').data('initials'), 'HT', 'initials should be correct');
  equal(component.$('.real-avatar').attr('src'), 'https://someurl.com/someimage.jpg', 'avatar should be right');
});
