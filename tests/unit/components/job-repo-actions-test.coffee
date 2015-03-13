`import { test, moduleForComponent } from 'ember-qunit'`

moduleForComponent 'job-repo-actions', 'JobRepoActionsComponent', {
}

test 'it shows cancel button if canCancel is true', ->
  component = @subject(canCancel: true)
  @append()

  ok component.$('a[title="Cancel Job"]').length, 'cancel link should be visible'

test 'it shows restart button if canRestart is true', ->
  component = @subject(canRestart: true)
  @append()

  ok component.$('a[title="Restart Job"]').length, 'restart link should be visible'

test 'user can cancel if she has permissions to a repo and job is cancelable', ->
  job = Ember.Object.create(canCancel: false, userHasPermissionForRepo: true)

  component = @subject(job: job, userHasPermissionForRepo: false)
  ok !component.get('canCancel')

  component.set('userHasPermissionForRepo', true)
  ok !component.get('canCancel')

  job.set('canCancel', true)
  ok component.get('canCancel')

test 'user can restart if she has permissions to a repo and job is restartable', ->
  job = Ember.Object.create(canRestart: false, userHasPermissionForRepo: true)

  component = @subject(job: job, userHasPermissionForRepo: false)
  ok !component.get('canRestart')

  component.set('userHasPermissionForRepo', true)
  ok !component.get('canRestart')

  job.set('canRestart', true)
  ok component.get('canRestart')

test 'it properly checks for user permissions for a repo', ->
  expect 3

  repo = Ember.Object.create(id: 44)
  user = Ember.Object.extend(
    hasAccessToRepo: (repo) ->
      ok repo.get('id', 44)
      ok true, 'hasAccessToRepo was called'

      false
  ).create()

  component = @subject(user: user, repo: repo)

  ok !component.get('userHasPermissionForRepo'), 'user should not have access to a repo'
