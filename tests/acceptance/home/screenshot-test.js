import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

function startedAt(duration, finished) {
  const nowTime = new Date().getTime();

  const finishedAt = nowTime - finished * 60 * 1000;
  const startedAt = finishedAt - duration * 60 * 1000;

  return new Date(startedAt);
}

function finishedAt(finished) {
  const nowTime = new Date().getTime();

  return new Date(nowTime - finished * 60 * 1000);
}

moduleForAcceptance('Acceptance | home/sidebar tabs', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sam Iamm',
      login: 'samiamm'
    });

    signInUser(currentUser);

    const ham = server.create('repository', {
      slug: 'green-eggs/ham',
      name: 'ham',
      owner: {
        login: 'green-eggs'
      }
    });

    const twoFish = server.create('repository', {
      slug: 'one-fish/two-fish'
    });

    let sven = server.create('git-user', { name: 'Sven Fuchs' });
    let commit = server.create('commit', {
      author: sven,
      committer: sven,
      branch: 'master',
      message: 'adding in Oh the places you’ll go!\nYou’ll be on your way up!\nYou’ll be seeing great sights!',
      branch_is_default: true,
      sha: 'd019f29'
    });

    let build = server.create('build', {
      repository: ham,
      state: 'passed',
      number: 209,
      commit,
      branch: server.create('branch', {
        name: 'master'
      }),
      finished_at: finishedAt(2 * 60),
      started_at: startedAt(53 / 60, 2 * 60)
    });
    this.build = build;

    let job = server.create('job', {
      number: '1234.1',
      repository: ham,
      state: 'passed',
      commit,
      build,
      finished_at: finishedAt(2 * 60),
      started_at: startedAt(53 / 60, 2 * 60)
    });
    this.job = job;

    commit.job = job;

    job.save();
    commit.save();
  }
});

test('the screenshot renders', (assert) => {
  visit('/green-eggs/ham');

  andThen(() => {
    pauseTest();
  });
  percySnapshot(assert);
});
