import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('repo-actions', 'RepoActionsComponent', {
  needs: ['component:build-repo-actions', 'component:job-repo-actions']
});

test('it renders', function() {

  var component;
  component = this.subject({});
  this.render();
  return ok(component.$().hasClass('repo-main-tools'), 'component has class');

});
