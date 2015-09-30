`import { test, moduleForComponent } from 'ember-qunit'`

moduleForComponent 'owner-repo-tile', 'OwnerRepoTileComponent', {
  # specify the other units that are required for this test
  needs: ['helper:format-time', 'helper:format-duration', 'helper:format-sha', 'component:status-icon', 'component:request-icon']
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
  equal component.$('.row-item:nth-of-type(1)').text().trim(), 'travis-chat', 'should display correct repo name'
  equal component.$('.row-item:nth-of-type(3)').text().trim(), 'master', 'should display branch name'
  equal component.$('.row-item:nth-of-type(4)').text().trim(), '16fff34', 'should display correct commit sha'
