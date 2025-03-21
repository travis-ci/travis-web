/* eslint max-len: 0 */
import {
  getContext,
  settled,
  visit,
  waitFor,
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import generatePusherPayload from 'travis/tests/helpers/generate-pusher-payload';

import jobPage from 'travis/tests/pages/job';
import getFaviconUri from 'travis/utils/favicon-data-uris';

import config from 'travis/config/environment';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | job/basic layout', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const { owner } = getContext();
    this.pusher = owner.lookup('service:pusher');
  });

  test('visiting job-view', async function (assert) {
    this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});

    let repo = this.server.create('repository', { slug: 'travis-ci/travis-web', owner: { login: 'travis-ci', id: 1 } }),
      branch = this.server.create('branch', { name: 'acceptance-tests' });

    let  gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });

    let request = this.server.create('request');
    this.server.create('message', {
      request,
      level: 'info',
      key: 'group',
      code: 'flagged',
      args: {
        given: 'group'
      }
    });

    let user = this.server.create('user', {
      name: 'Mr T',
      avatar_url: '/images/favicon-gray.png'
    });

    let build = this.server.create('build', { repository: repo, state: 'passed', createdBy: user, commit, branch, request });
    let job = this.server.create('job', { number: '1234.1', repository: repo, state: 'passed', build, commit });
    commit.job = job;

    job.save();
    commit.save();

    this.server.create('log', { id: job.id });

    await visit(`/travis-ci/travis-web/jobs/${job.id}`);

    await waitFor('#log > .log-line');

    //   assert.equal(document.title, 'Job #1234.1 - travis-ci/travis-web - Travis CI');

    // Ember-test-helpers find does not work here
    const iconHref = window.document.querySelector('head link[rel=icon]').getAttribute('href');
    assert.equal(iconHref, getFaviconUri('green'), 'expected the favicon data URI to match the one for passing');

    assert.equal(jobPage.branch, 'acceptance-tests', 'displays the branch');
    assert.equal(jobPage.message, 'acceptance-tests This is a message', 'displays message');
    assert.equal(jobPage.state, '#1234.1 passed', 'displays build number');

    assert.equal(jobPage.createdBy.href, '/github/testuser');
    assert.equal(jobPage.createdBy.text, 'Mr T');
    assert.ok(jobPage.createdBy.avatarSrc.startsWith('/images/favicon-gray.png'));

    const logNumbers = jobPage.log.match(/\d+/g);
    const logContent = jobPage.log.split(/\d+/g).filter(Boolean);

    assert.equal(logNumbers[0], '1');
    assert.equal(logNumbers[1], '2');
    assert.equal(logContent[0], 'Hello log');
    assert.equal(logContent[1], 'Second line');
    assert.notOk(jobPage.hasTruncatedLog);
    assert.equal(jobPage.rawLogUrl, `${config.apiEndpoint}/v3/job/${job.id}/log.txt`);
  });

  test('visiting pull request job-view', async function (assert) {
    this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});
    let repo = this.server.create('repository', { slug: 'travis-ci/travis-web', owner: { login: 'travis-ci', id: 1 } }),
      branch = this.server.create('branch', { name: 'acceptance-tests' });

    let  gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });

    let request = this.server.create('request', { pull_request_mergeable: 'draft' });
    this.server.create('message', {
      request,
      level: 'info',
      key: 'group',
      code: 'flagged',
      args: {
        given: 'group'
      }
    });

    let user = this.server.create('user', {
      name: 'Mr T',
      avatar_url: '/images/favicon-gray.png'
    });

    let build = this.server.create('build', { repository: repo, state: 'passed', createdBy: user, commit, branch, event_type: 'pull_request', pull_request_number: 1, request });
    let job = this.server.create('job', { number: '1234.1', repository: repo, state: 'passed', build, commit });
    commit.job = job;

    job.save();
    commit.save();

    this.server.create('log', { id: job.id });

    await visit(`/travis-ci/travis-web/jobs/${job.id}`);
    await waitFor('#log > .log-line');

    //   assert.equal(document.title, 'Job #1234.1 - travis-ci/travis-web - Travis CI');

    // Ember-test-helpers find does not work here
    const iconHref = window.document.querySelector('head link[rel=icon]').getAttribute('href');
    assert.equal(iconHref, getFaviconUri('green'), 'expected the favicon data URI to match the one for passing');

    assert.equal(jobPage.message, 'Pull Request #1 draft', 'displays message');
    assert.equal(jobPage.badge, 'draft', 'displays badge');
    assert.equal(jobPage.state, '#1234.1 passed', 'displays build number');

    assert.equal(jobPage.createdBy.href, '/github/testuser');
    assert.equal(jobPage.createdBy.text, 'Mr T');
    assert.ok(jobPage.createdBy.avatarSrc.startsWith('/images/favicon-gray.png'));

    const logNumbers = jobPage.log.match(/\d+/g);
    const logContent = jobPage.log.split(/\d+/g).filter(Boolean);

    assert.equal(logNumbers[0], '1');
    assert.equal(logNumbers[1], '2');
    assert.equal(logContent[0], 'Hello log');
    assert.equal(logContent[1], 'Second line');
    assert.notOk(jobPage.hasTruncatedLog);
    assert.equal(jobPage.rawLogUrl, `${config.apiEndpoint}/v3/job/${job.id}/log.txt`);
  });


  test('visiting a job in created(received) state', async function (assert) {
    let branch = this.server.create('branch', { name: 'acceptance-tests' });
    this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});
    let repo = this.server.create('repository', { slug: 'travis-ci/travis-web', defaultBranch: branch, owner: { login: 'travis-ci', id: 1 } });
    let commit = this.server.create('commit', {
      id: 100,
      sha: 'abcd',
      branch: 'acceptance-tests',
      message: 'This is a message',
    });

    let request = this.server.create('request');
    this.server.create('message', {
      request,
      level: 'info',
      key: 'group',
      code: 'flagged',
      args: {
        given: 'group'
      }
    });

    let user = this.server.create('user', {
      name: 'Mr T',
      avatar_url: '/images/favicon-gray.png'
    });

    let build = this.server.create('build', {
      id: 100,
      number: 15,
      repository: repo,
      commit: commit,
      pull_request: false,
      event_type: 'push',
      state: 'created',
      started_at: new Date(),
      createdBy: user
    });

    let job = this.server.create('job', {
      id: 100,
      number: '1234.1',
      repository: repo,
      state: 'created',
      build,
      commit
    });

    this.server.create('log', { id: job.id });

    await visit(`/travis-ci/travis-web/jobs/${job.id}`);

    const createdState = {
      build: generatePusherPayload(build, { state: 'created' }),
      job: generatePusherPayload(job, { state: 'created' }),
      commit: generatePusherPayload(commit),
      repository: generatePusherPayload(repo, { current_build_id: build.id })
    };

    this.pusher.receive('job:created', createdState);
    await settled();

    assert.equal(jobPage.state, '#1234.1 received', 'displays build number');

    assert.notOk(jobPage.hasTruncatedLog);
    assert.ok(jobPage.waitingStates.isVisible);

    assert.ok(jobPage.waitingStates.one.isLoading);
    assert.ok(jobPage.waitingStates.firstLoadingLine.isInactive);
    assert.ok(jobPage.waitingStates.two.isInactive);
    assert.ok(jobPage.waitingStates.secondLoadingLine.isInactive);
    assert.ok(jobPage.waitingStates.three.isInactive);

    assert.equal(jobPage.waitingStates.firstMessage.text, 'Job received');
    assert.equal(jobPage.waitingStates.secondMessage.text, 'Queued');
    assert.equal(jobPage.waitingStates.thirdMessage.text, 'Booting virtual machine');

    const queuedState = {
      build: generatePusherPayload(build, { state: 'queued' }),
      job: generatePusherPayload(job, { state: 'queued' }),
      commit: generatePusherPayload(commit),
      repository: generatePusherPayload(repo, { current_build_id: build.id })
    };

    this.pusher.receive('job:queued', queuedState);
    await settled();

    assert.equal(jobPage.state, '#1234.1 queued', 'displays build number');

    assert.ok(jobPage.waitingStates.isVisible);

    assert.ok(jobPage.waitingStates.one.isLoaded);
    assert.ok(jobPage.waitingStates.firstLoadingLine.isActive);
    assert.ok(jobPage.waitingStates.two.isLoading);
    assert.ok(jobPage.waitingStates.secondLoadingLine.isInactive);
    assert.ok(jobPage.waitingStates.three.isInactive);

    assert.equal(jobPage.waitingStates.firstMessage.text, 'Job received');
    assert.equal(jobPage.waitingStates.secondMessage.text, 'Queued');
    assert.equal(jobPage.waitingStates.thirdMessage.text, 'Booting virtual machine');

    const receivedState = {
      build: generatePusherPayload(build, { state: 'received' }),
      job: generatePusherPayload(job, { state: 'received' }),
      commit: generatePusherPayload(commit),
      repository: generatePusherPayload(repo, { current_build_id: build.id })
    };

    this.pusher.receive('job:received', receivedState);
    await settled();

    assert.equal(jobPage.state, '#1234.1 booting', 'displays build number');

    assert.ok(jobPage.waitingStates.isVisible);

    assert.ok(jobPage.waitingStates.one.isLoaded);
    assert.ok(jobPage.waitingStates.firstLoadingLine.isActive);
    assert.ok(jobPage.waitingStates.two.isLoaded);
    assert.ok(jobPage.waitingStates.secondLoadingLine.isActive);
    assert.ok(jobPage.waitingStates.three.isLoading);

    assert.equal(jobPage.waitingStates.firstMessage.text, 'Job received');
    assert.equal(jobPage.waitingStates.secondMessage.text, 'Queued');
    assert.equal(jobPage.waitingStates.thirdMessage.text, 'Booting virtual machine');
  });

  test('visiting a job with a truncated log', async function (assert) {
    this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});
    let repo =  this.server.create('repository', { slug: 'travis-ci/travis-web', owner: { login: 'travis-ci', id: 1 } });
    let branch = this.server.create('branch', { name: 'acceptance-tests' });

    let gitAuthor = this.server.create('git-user', { name: 'Mr T' });
    let gitCommitter = this.server.create('git-user', { name: 'Sylvia Rivera' });
    let commit = this.server.create('commit', { author: gitAuthor, committer: gitCommitter, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { repository: repo, state: 'passed', commit, branch });
    let job = this.server.create('job', { number: '1234.1', repository: repo, state: 'passed', commit, build });
    commit.job = job;

    job.save();
    commit.save();

    const longLog = new Array(config.logLimit + 1).join('🤔\n');
    this.server.create('log', { id: job.id, content: longLog });

    await jobPage.visit();

    // An unfortunate workaround for log displaying being outside Ember facilities.
    // eslint-disable-next-line
    await waitFor('.notification-warning');

    assert.ok(jobPage.hasTruncatedLog);

    assert.equal(jobPage.createdBy.text[0], 'Mr T authored');
    assert.equal(jobPage.createdBy.text[1], 'Sylvia Rivera committed');
  });

  test('visiting a job with a complex log', async function (assert) {
    this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});
    let repo =  this.server.create('repository', { slug: 'travis-ci/travis-web', owner: { login: 'travis-ci', id: 1 } }),
      branch = this.server.create('branch', { name: 'acceptance-tests' });

    let  gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { repository: repo, state: 'passed', commit, branch });
    let job = this.server.create('job', { number: '1234.1', repository: repo, state: 'passed', commit, build });
    commit.job = job;

    await job.save();
    await commit.save();

    const ESCAPE = String.fromCharCode(27);
    const complexLog = `I am the first line.
  travis_fold:start:afold
  I am the first line of a fold.
  I am the second line of a fold.
  travis_fold:end:afold
  I am a line between folds.
  travis_fold:start:afold
  I am the first line of a second fold.
  travis_fold:end:afold
  [0K[30;47;1mI am a bold black line with white background.     I have some whitespace within my line. I am very long to provoke wrapping. So I keep going on and on. And on!
  [0K[31;46;3mI am an italic red line with cyan background. The next line has a long unbroken string to test wrapping of unbroken text.
  [0K[32;45;4mI am an underlined green line with magenta background. ...........................................................................**....................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
  [0K[33;44mI am a yellow line with blue background.
  [0K[34;43mI am a blue line yellow background.
  [0K[35;42mI am a magenta line with green background.
  [0K[36;41mI am a cyan line with red background.
  [0K[37;40mI am a white line with black background.
  [0K[90mI am a grey line.
  I used to be the final line.
  I am another line finished by a CR.\rI replace that line?\r${ESCAPE}[0mI am the final replacer.\nI do not replace because the previous line ended with a line feed.
  This should also be gone.\r This should have replaced it.
  A particular log formation is addressed here, this should remain.\r${ESCAPE}[0m\nThis should be on a separate line.
  But it must be addressed repeatedly!\r${ESCAPE}[0m\nAgain.
  I should not be blank.\r${ESCAPE}[0m
  ${ESCAPE}[31m-}
  ${ESCAPE}(B[m[32m+},
  { "curl": "sample response" }travis_time:end:454546
  `;
    this.server.create('log', { id: job.id, content: complexLog });

    await jobPage.visit();

    // An unfortunate workaround for log displaying being outside Ember facilities.
    // eslint-disable-next-line
    await waitFor('.log-container .yellow');

    await jobPage.toggleLog();

    assert.notOk(jobPage.hasWaitingStates);

    assert.equal(jobPage.logLines[0].entireLineText, 'I am the first line.');

    assert.equal(jobPage.logFolds[0].name, 'afold');
    assert.notOk(jobPage.logFolds[0].isOpen);

    assert.equal(jobPage.logLines[1].entireLineText, 'I am the first line of a fold.');

    assert.equal(jobPage.logLines[2].entireLineText, 'I am the second line of a fold.');

    assert.equal(jobPage.logLines[3].entireLineText, 'I am a line between folds.');

    assert.equal(jobPage.logFolds[0].name, 'afold');
    assert.equal(jobPage.logLines[4].entireLineText, 'I am the first line of a second fold.');

    assert.ok(jobPage.logLines[5].isBlack);
    assert.ok(jobPage.logLines[5].hasWhiteBackground);
    assert.ok(jobPage.logLines[5].isBolded);

    assert.ok(jobPage.logLines[6].isRed);
    assert.ok(jobPage.logLines[6].hasCyanBackground);
    assert.ok(jobPage.logLines[6].isItalicised);

    assert.ok(jobPage.logLines[7].isGreen);
    assert.ok(jobPage.logLines[7].hasMagentaBackground);
    assert.ok(jobPage.logLines[7].isUnderlined);

    assert.ok(jobPage.logLines[8].isYellow);
    assert.ok(jobPage.logLines[8].hasBlueBackground);

    assert.ok(jobPage.logLines[9].isBlue);
    assert.ok(jobPage.logLines[9].hasYellowBackground);

    assert.ok(jobPage.logLines[10].isMagenta);
    assert.ok(jobPage.logLines[10].hasGreenBackground);

    assert.ok(jobPage.logLines[11].isCyan);
    assert.ok(jobPage.logLines[11].hasRedBackground);

    assert.ok(jobPage.logLines[12].isWhite);
    assert.ok(jobPage.logLines[12].hasBlackBackground);

    assert.ok(jobPage.logLines[13].isGrey);

    assert.equal(jobPage.logLines[14].entireLineText, 'I used to be the final line.');

    assert.equal(jobPage.logLines[15].entireLineText, 'I am the final replacer.', 'expected `I replace that line?` to be itself replaced');
    assert.equal(jobPage.logLines[16].entireLineText, 'I do not replace because the previous line ended with a line feed.');

    assert.equal(jobPage.logLines[17].entireLineText, 'This should have replaced it.');

    assert.equal(jobPage.logLines[18].entireLineText, 'A particular log formation is addressed here, this should remain.');
    assert.equal(jobPage.logLines[19].entireLineText, 'This should be on a separate line.');
    assert.equal(jobPage.logLines[20].entireLineText, 'But it must be addressed repeatedly!');
    assert.equal(jobPage.logLines[21].entireLineText, 'Again.');

    assert.equal(jobPage.logLines[22].entireLineText, 'I should not be blank.');

    assert.equal(jobPage.logLines[24].entireLineText, '+},');
    assert.equal(jobPage.logLines[25].entireLineText, '{ "curl": "sample response" }');

    await jobPage.logFolds[0].toggle();

    assert.ok(jobPage.logFolds[0].isOpen);
  });

  test('visiting a job with fold duration', async function (assert) {
    this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});
    let repo =  this.server.create('repository', { slug: 'travis-ci/travis-web', owner: { login: 'travis-ci', id: 1 } }),
      branch = this.server.create('branch', { name: 'acceptance-tests' });

    let  gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { repository: repo, state: 'passed', commit, branch });
    let job = this.server.create('job', { number: '1234.1', repository: repo, state: 'passed', commit, build });
    commit.job = job;

    job.save();
    commit.save();

    const complexLog = `I am the first line.
  travis_fold:start:afold
  travis_time:start:2fde4b10
  I am the first line of a fold.
  I am the second line of a fold.
  travis_time:end:2fde4b10:start=1515663514660495538,finish=1515663517010906954,duration=2350411416
  travis_fold:end:afold
  `;
    this.server.create('log', { id: job.id, content: complexLog });

    await jobPage.visit();

    // An unfortunate workaround for log displaying being outside Ember facilities.
    // eslint-disable-next-line
    await waitFor('.log-container .duration');

    jobPage.toggleLog();

    assert.equal(jobPage.logFolds[0].duration, '2.35s');
  });

  test('visiting a job when log-rendering is off', async function (assert) {
    localStorage.setItem('travis.logRendering', false);

    this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});
    let repo =  this.server.create('repository', { slug: 'travis-ci/travis-web', owner: { login: 'travis-ci', id: 1 } }),
      branch = this.server.create('branch', { name: 'acceptance-tests' });

    let commit = this.server.create('commit', { branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { repository: repo, state: 'passed', commit, branch });
    let job = this.server.create('job', { number: '1234.1', repository: repo, state: 'passed', commit, build });
    commit.job = job;

    await job.save();
    await commit.save();

    const log = 'I am a log that won’t render.';
    this.server.create('log', { id: job.id, content: log });

    await jobPage.visit();

    // Log displaying happens outside of Ember.
    // eslint-disable-next-line
    await waitFor('.log-container .log-line');

    const logContent = jobPage.logLines[0].text.split(/\d+/g).filter(Boolean);

    assert.equal(logContent, "Log rendering is off because localStorage['travis.logRendering'] is `false`.");

    this.pusher.receive('job:log', {
      id: job.id,
      number: 1,
      final: false,
      _log: 'another log line'
    });
    await settled();

    assert.equal(jobPage.logLines.length, 1);
  });
});
