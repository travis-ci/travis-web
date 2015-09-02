`import { test, moduleForComponent } from 'ember-qunit'`

moduleForComponent 'owner-repo-tile', 'OwnerRepoTileComponent', {
  # specify the other units that are required for this test
  needs: ['helper:format-time', 'helper:format-duration', 'helper:format-sha']
}

test 'it renders', ->

  attributes = {
    slug: "travis-ci/travis-chat",
    active: false,
    private: false,
    default_branch: {
      name: "master",
      last_build: {
        number: "25",
        state: "passed",
        duration: 252,
        event_type: "push",
        previous_state: "passed",
        started_at: "2013-07-08T11:03:19Z",
        finished_at: "2013-07-08T11:06:50Z",
        commit: {
          sha: "16fff347ff55403caf44c53357855ebc32adf95d",
          compare_url: "https://github.com/travis-ci/travis-chat/compare/3c4e9ea50141...16fff347ff55",
        }
      }
    }
  }


  component = @subject(repo: attributes)

  @append()

  ok component.$().hasClass('passed'), 'component should have state class (passed)'
  equal component.$('.repo-title a').text().trim(), 'travis-chat', 'should display correct repo name'
  equal component.$('.build a').text().trim(), '25', 'should display correct build numbee'
  equal component.$('.build-status').text().trim(), 'passed', 'should display a last build state'
  equal component.$('.commit a').text().trim(), '16fff34', 'should display correct commit sha'
  equal component.$('.finished-at').text().trim(), '2 years ago', 'should display correct build duration'
