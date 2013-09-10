module "Travis.Helpers.githubify"

test 'replaces #Num with github issues link', ->
  message = 'Solved #11hey'
  result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web')
  expected = 'Solved <a href="http://github.com/travis-ci/travis-web/issues/11">#11</a>hey'

  equal(result, expected, "#num should be converted to a link")

test 'replaces User#Num with github issues link to forked repo', ->
  message = 'Solved test#11hey'
  result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web')
  expected = 'Solved <a href="http://github.com/test/travis-web/issues/11">test#11</a>hey'

  equal(result, expected, "user#num should be converted to a link")

test 'replaces User/Project#Num with github issues link to another repo', ->
  message = 'Solved test_1-a2/test-a_11#11hey'
  result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web')
  expected = 'Solved <a href="http://github.com/test_1-a2/test-a_11/issues/11">test_1-a2/test-a_11#11</a>hey'

  equal(result, expected, "owner/repo#num should be converted to a link")

test 'replaces gh-Num with github issues link', ->
  message = 'Solved gh-22hey'
  result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web')
  expected = 'Solved <a href="http://github.com/travis-ci/travis-web/issues/22">gh-22</a>hey'

  equal(result, expected, "gh-Num should be converted to a link")

test 'replaces multiple references with github issues links', ->
  message = 'Try #1 and test#2 and test/testing#3'
  result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web')
  expected = 'Try <a href="http://github.com/travis-ci/travis-web/issues/1">#1</a> and '
  expected += '<a href="http://github.com/test/travis-web/issues/2">test#2</a> and '
  expected += '<a href="http://github.com/test/testing/issues/3">test/testing#3</a>'

  equal(result, expected, "references should be converted to links")

test 'replaces multiple references with github issues links', ->
  message = 'Try #1 and test#2 and test/testing#3'
  result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web')
  expected = 'Try <a href="http://github.com/travis-ci/travis-web/issues/1">#1</a> and '
  expected += '<a href="http://github.com/test/travis-web/issues/2">test#2</a> and '
  expected += '<a href="http://github.com/test/testing/issues/3">test/testing#3</a>'

  equal(result, expected, "references should be converted to links")

test 'replaces @user with github user link', ->
  message = 'It is for you @tender_love1'
  result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web')
  expected = 'It is for you <a href="http://github.com/tender_love1">@tender_love1</a>'

  equal(result, expected, "@user should be converted to a link")
