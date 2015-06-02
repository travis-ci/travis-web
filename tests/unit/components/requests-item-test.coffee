`import { test, moduleForComponent } from 'ember-qunit'`

moduleForComponent 'requests-item', {
  needs: ['helper:format-message', 'helper:format-time', 'helper:github-commit-link']
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

  assert.equal component.$('.requests-branch').text().trim().replace(/[\s]+/, ' '),
               'dev abcdef1'
  assert.equal component.$('.requests-time').text().trim(), 'a day ago'
  assert.ok component.$('.tile-status > .icon').hasClass('accepted'), 'icon should have accepted class'
  assert.equal component.$('.requests-commit').text().trim(), 'Bam!'
  assert.equal component.$('.requests-commit .emoji').length, 1, 'there should be an emoji icon in commit message'
  assert.equal component.$('.requests-commit .emoji').attr('title'), ':bomb:'
  assert.equal component.$('.requests-build a').text().trim(), '10', 'build number should be displayed'

test 'it renders PR number if a request is a PR', (assert) ->
  # creates the component instance
  request = {
    id: 1,
    isPullRequest: true,
    pullRequestNumber: 20,
    build: null
  }

  component = @subject(request: request)
  @render()

  assert.equal component.$('.requests-branch').text().trim(), '#20'
  assert.equal component.$('.requests-build').text().trim(), '-'
