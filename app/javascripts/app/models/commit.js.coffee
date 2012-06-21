@Travis.Commit = Travis.Model.extend
  sha:             DS.attr('string')
  branch:          DS.attr('string')
  message:         DS.attr('string')
  compare_url:     DS.attr('string')
  author_name:     DS.attr('string')
  author_email:    DS.attr('string')
  committer_name:  DS.attr('string')
  committer_email: DS.attr('string')

  build: DS.belongsTo('Travis.Build')

@Travis.Commit.FIXTURES = [
  { id: 1, sha: '123456', branch: 'master',  message: 'the commit message', compare_url: 'http://github.com/compare', author_name: 'Author', author_email: 'author@email.org', committer_name: 'Committer', committer_email: 'committer@email.org' }
  { id: 2, sha: '234567', branch: 'feature', message: 'the commit message', compare_url: 'http://github.com/compare', author_name: 'Author', author_email: 'author@email.org', committer_name: 'Committer', committer_email: 'committer@email.org' }
  { id: 3, sha: '345678', branch: 'master',  message: 'the commit message', compare_url: 'http://github.com/compare', author_name: 'Author', author_email: 'author@email.org', committer_name: 'Committer', committer_email: 'committer@email.org' }
  { id: 4, sha: '456789', branch: 'master',  message: 'the commit message', compare_url: 'http://github.com/compare', author_name: 'Author', author_email: 'author@email.org', committer_name: 'Committer', committer_email: 'committer@email.org' }
]

