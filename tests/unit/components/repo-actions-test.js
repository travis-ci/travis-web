import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('repo-actions', 'RepoActionsComponent', {
  needs: ['component:build-repo-actions', 'component:job-repo-actions']
});

test('it displays code climate if the repo language is ruby', function() {
  var component, repo;
  repo = Ember.Object.create({
    githubLanguage: 'Ruby'
  });
  component = this.subject({
    repo: repo
  });
  this.append();
  ok(component.get('displayCodeClimate'), 'component should try to display code climate');
  return ok(component.$('a[name=code-climate]').length, 'component should render a code climate button');
});

test('it doesn\'t display code climate for other languages', function() {
  var component, repo;
  repo = Ember.Object.create({
    githubLanguage: 'Go'
  });
  component = this.subject({
    repo: repo
  });
  this.append();
  ok(!component.get('displayCodeClimate'), 'component should not try to display code climate');
  return ok(!component.$('a[name=code-climate]').length, 'component should not render a code climate button');
});
