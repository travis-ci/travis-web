`import { test, moduleForComponent } from 'ember-qunit'`

moduleForComponent 'branch-row', 'BranchRowComponent', {
  # specify the other units that are required for this test
  needs: ['helper:format-time', 'helper:format-duration', 'helper:format-sha', 'component:status-icon', 'component:request-icon']
}

test 'it renders', ->

  attributes = {
    name: "local-test",
    repository: {
      id: 13661,
      slug: "meatballhat/yolo-octo-adventure",
      default_branch: {
        name: "master",
        last_build: {
          id: 434835,
          number: "1086",
          state: "passed",
          duration: 11,
          event_type: "push",
          previous_state: "passed",
          started_at: "2015-08-24T21:34:22Z",
          finished_at: "2015-08-24T21:35:14Z",
          commit: {
            sha: "0e9d8ebc78d2192cc599580751763a5dd6be0ccd",
            committer: {
              name: "Dan Buch",
              avatar_url: "https://0.gravatar.com/avatar/563fd372b4d51781853bc85147f06a36"
            },
            author: {
              name: "Dan Buch",
              avatar_url: "https://0.gravatar.com/avatar/563fd372b4d51781853bc85147f06a36"
            }
          }
        }
      }
    }
  }


  component = @subject(repo: attributes)

  @append()

  ok component.$().hasClass('passed'), 'component should have state class (passed)'
  equal component.$('.row-name').text().trim(), 'master', 'should display correct branch name'
  equal component.$('.row-request').text().trim(), '#1086 passed', 'should display build number and state'
  equal component.$('.row-commiter').text().trim(), 'Dan Buch', 'should display correct commiter name'
  equal component.$('.row-commit').text().trim(), '0e9d8eb', 'should display correct commit sha'
