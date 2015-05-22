import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('repos-list', {
  unit: true,

  setup() {
    this.container.register('component:repos-list-item',
      Ember.Component.extend({ classNames: ['repos-list-item'] })
    );
    this.container.register('template:components/repos-list-item',
      hbs`repo.id:{{repo.id}}, selectedRepo.id: {{selectedRepo.id}}`
    );
  }
});

test('it renders a repos list sorted by repo.sortOrder', function(assert) {
  var repos = [{ id: 1, sortOrder: 5 }, { id: 2, sortOrder: 10 }];
  var component = this.subject({repos: repos, selectedRepo: { id: 1 }});
  this.render();

  assert.equal(component.$('.repos-list-item').length, 2, 'repos list should be rendered');
  assert.equal(component.$('.repos-list-item:nth(0)').text(), 'repo.id:2, selectedRepo.id: 1', 'repo 2 and selectedRepo should be passed to list item');
  assert.equal(component.$('.repos-list-item:nth(1)').text(), 'repo.id:1, selectedRepo.id: 1', 'repo 1 and selectedRepo should be passed to list item');
});

test('it renders a message when the list is empty', function(assert) {
  var repos = [];
  var component = this.subject({repos: repos, noReposMessage: "NO REPOS!!!"});
  this.render();

  assert.equal(component.$('.repos-list-item').length, 0, 'repos list should be empty');
  assert.equal(component.$('.empty').text().trim(), 'NO REPOS!!!', 'a message should be displayed');
});
