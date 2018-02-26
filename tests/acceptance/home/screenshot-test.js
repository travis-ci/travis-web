import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

function durationAgo(duration, finished) {
  const nowTime = new Date().getTime();

  const finishedAt = nowTime - finished * 60 * 1000;
  const startedAt = finishedAt - duration * 60 * 1000;

  return {
    started_at: new Date(startedAt),
    finished_at: new Date(finishedAt)
  };
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
      branch_is_default: true
    });

    let build = server.create('build', {
      repository: ham,
      state: 'passed',
      number: 209,
      commit,
      branch: server.create('branch', {
        name: 'master'
      }),
      ...durationAgo(53 / 60, 2 * 60),
      event_type: 'push'
    });
    this.build = build;

    let job = server.create('job', {
      number: '1234.1',
      repository: ham,
      state: 'passed',
      commit,
      build
    });
    this.job = job;

    commit.job = job;

    job.save();
    commit.save();

    server.create('build', {
      repository: twoFish,
      state: 'passed',
      number: '2686',
      ...durationAgo(33 + 46 / 60, 30)
    });
  }
});

test('the screenshot renders', (assert) => {
  visit('/green-eggs/ham');
  assert.expect(0);
  percySnapshot(assert);
});
