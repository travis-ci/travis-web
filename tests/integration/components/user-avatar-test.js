import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-avatar', 'Integration | Component | user avatar', {
  integration: true
});

test('it renders correctly', function(assert) {
  this.set('name', 'Hello Test');
  this.set('url', 'https://someurl.com/someimage.jpg');
  this.set('size', 38);

  this.render(hbs`{{user-avatar name=name url=url size=size}}`);

  assert.ok(this.$('span').hasClass('avatar'), 'component should have right class');
  assert.equal(this.$('.pseudo-avatar').data('initials'), 'HT', 'initials should be correct');
  assert.equal(this.$('.real-avatar').attr('src'), 'https://someurl.com/someimage.jpg?v=3&s=38', 'avatar should display fallback image');
  assert.equal(this.$('.real-avatar').attr('srcset'), 'https://someurl.com/someimage.jpg?v=3&s=38 1x, https://someurl.com/someimage.jpg?v=3&s=76 2x', 'should provide a low and high res avatar');
});
