`import { test, moduleForComponent } from 'ember-qunit'`

moduleForComponent 'requests-item', {
  needs: ['helper:format-message', 'helper:format-time', 'helper:github-commit-link', 'component:status-icon', 'component:request-icon']
}

test 'it renders request data', (assert) ->
  yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  request = {
    id: 1,
    branchName: 'dev',
    commit: {
      sha: 'abcdef123',
      message: 'Bam! :bomb:'
    },
    repo: {
      slug: 'travis-ci/travis-ci'
    },
    build: {
      number: 10
    }
    created_at: yesterday,
    isAccepted: true
  }

  component = @subject(request: request)
  @render()

  assert.equal component.$('.row-item:nth-child(2) strong').text().trim(), 'dev'
  assert.equal component.$('.row-item:nth-child(3) .label-align').text().trim(), 'a day ago'
  assert.ok component.$('.status-icon').hasClass('accepted'), 'icon should have accepted class'
  assert.equal component.$('.row-item:nth-child(4)').text().trim(), 'Bam!'
  assert.equal component.$('.row-item:nth-child(4) .emoji').length, 1, 'there should be an emoji icon in commit message'
  assert.equal component.$('.row-item:nth-child(5)').text().trim(), '10', 'build number should be displayed'

test 'it renders PR number if a request is a PR', (assert) ->
  # creates the component instance
  request = {
    id: 1,
    isPullRequest: true,
    pullRequestNumber: 20,
  }

  component = @subject(request: request)
  @render()

  assert.equal component.$('.row-item:nth-child(2) strong').text().trim(), '#20'
