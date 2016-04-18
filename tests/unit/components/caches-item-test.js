import { test, moduleForComponent } from 'ember-qunit';
moduleForComponent('caches-item', 'CachesItemComponent', {
  needs: ['helper:format-time', 'helper:travis-mb', 'component:request-icon']
});

test('it renders', function() {
  var attributes, component;
  attributes = {
    repository_id: 10,
    size: 1024 * 1024,
    branch: "master",
    last_modified: "2015-04-16T11:25:00Z",
    type: "push"
  };
  component = this.subject({
    cache: attributes
  });
  this.render();
  ok(component.$().hasClass('push'), 'component should have a type class (push)');
  equal(component.$('.row-item:first-child .label-align').text().trim(), 'master', 'branch name should be displayed');
  return equal(component.$('.row-item:nth-child(3) .label-align').text().trim(), '1.00MB', 'size should be displayed');
});
