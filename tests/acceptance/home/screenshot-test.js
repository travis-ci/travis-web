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

const ESCAPE = String.fromCharCode(27);
const log = `I am the first line.
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
`;

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

    let sven = server.create('git-user', {
      name: 'Sven Fuchs',
      avatar_url: 'https://0.gravatar.com/avatar/2f042f300d1249917adf6f13d3f698b2'
    });

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

    server.create('log', { id: job.id, content: log });

    server.create('build', {
      repository: twoFish,
      state: 'passed',
      number: '2686',
      ...durationAgo(33 + 46 / 60, 30)
    });

    const pop = server.create('repository', { slug: 'hop-on/pop'});
    server.create('build', {
      repository: pop,
      state: 'passed',
      number: '7001',
      ...durationAgo(22 + 54 / 60, 61)
    });

    const awho = server.create('repository', { slug: 'horton-hears/awho'});
    server.create('build', {
      repository: awho,
      state: 'passed',
      number: '209',
      ...durationAgo(53 / 60, 2 * 60)
    });

    const placesYoullGo = server.create('repository', { slug: 'ohthe/places-youllgo' });
    server.create('build', {
      repository: placesYoullGo,
      state: 'passed',
      number: '778',
      ...durationAgo(6 + 55 / 60, 4 * 60)
    });

    const whostolechristmas = server.create('repository', { slug: 'thegrinch/whostolechristmas' });
    server.create('build', {
      repository: whostolechristmas,
      state: 'passed',
      number: '35',
      ...durationAgo(15 + 50 / 60, 5 * 60)
    });
  }
});

test('the screenshot renders', (assert) => {
  visit('/green-eggs/ham');
  assert.expect(0);
  percySnapshot(assert);
});
