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
  ok component.$('.icon-status').hasClass('passed'), 'status icon should have state class (passed)'
  ok component.$('.request-kind').hasClass('push'), 'reuqest icon should have event type class (push)'
  equal component.$('.tile-main h3').text().trim(), 'travis-ci', 'should display correct owner name'
  equal component.$('.tile-main h2 a').text().trim(), 'travis-chat', 'should display correct repo name'
  equal component.$('.build-status a').text().trim(), '25 passed', 'should display correct build number and state'
  equal component.$('.tile-commit a').text().trim(), '16fff34', 'should display correct commit sha'
  equal component.$('.tile-timeago').text().trim(), '2 years ago', 'should display correct build duration'
  equal component.$('.tile-duration').text().trim(), '4 min 12 sec', 'should display correct build finished at time'
