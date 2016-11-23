export default function () {
  return {
    '@type': 'builds',
    '@href': '/repo/1398458/builds?event_type=push&include=build.commit',
    '@representation': 'standard',
    '@pagination': {
      'limit': 25,
      'offset': 0,
      'count': 20825,
      'is_first': true,
      'is_last': false,
      'next': {
        '@href': '/repo/1398458/builds?event_type=push&include=build.commit&limit=25&offset=25',
        'offset': 25,
        'limit': 25
      },
      'prev': null,
      'first': {
        '@href': '/repo/1398458/builds?event_type=push&include=build.commit',
        'offset': 0,
        'limit': 25
      },
      'last': {
        '@href': '/repo/1398458/builds?event_type=push&include=build.commit&limit=25&offset=20800',
        'offset': 20800,
        'limit': 25
      }
    },
    'builds': [
      {
        '@type': 'build',
        '@href': '/build/176288867',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176288867,
        'number': '16744',
        'state': 'created',
        'duration': null,
        'event_type': 'push',
        'previous_state': 'passed',
        'started_at': null,
        'finished_at': null,
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50284741,
          'sha': 'f4e8c7dea4783622108e3ebb2557591498555bd7',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head-clang (2b80941)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/2f91edd420de...f4e8c7dea478',
          'committed_at': '2016-11-16T07:05:58Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176288868',
            '@representation': 'minimal',
            'id': 176288868
          },
          {
            '@type': 'job',
            '@href': '/job/176288869',
            '@representation': 'minimal',
            'id': 176288869
          },
          {
            '@type': 'job',
            '@href': '/job/176288872',
            '@representation': 'minimal',
            'id': 176288872
          },
          {
            '@type': 'job',
            '@href': '/job/176288873',
            '@representation': 'minimal',
            'id': 176288873
          },
          {
            '@type': 'job',
            '@href': '/job/176288874',
            '@representation': 'minimal',
            'id': 176288874
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176288849',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176288849,
        'number': '16743',
        'state': 'created',
        'duration': null,
        'event_type': 'push',
        'previous_state': 'passed',
        'started_at': null,
        'finished_at': null,
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50284737,
          'sha': '2f91edd420de9ffb5787c553957c353bf9a43374',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head (2b80941)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/d74abb6f150d...2f91edd420de',
          'committed_at': '2016-11-16T07:05:56Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176288850',
            '@representation': 'minimal',
            'id': 176288850
          },
          {
            '@type': 'job',
            '@href': '/job/176288851',
            '@representation': 'minimal',
            'id': 176288851
          },
          {
            '@type': 'job',
            '@href': '/job/176288852',
            '@representation': 'minimal',
            'id': 176288852
          },
          {
            '@type': 'job',
            '@href': '/job/176288853',
            '@representation': 'minimal',
            'id': 176288853
          },
          {
            '@type': 'job',
            '@href': '/job/176288854',
            '@representation': 'minimal',
            'id': 176288854
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176288808',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176288808,
        'number': '16742',
        'state': 'created',
        'duration': null,
        'event_type': 'push',
        'previous_state': 'passed',
        'started_at': null,
        'finished_at': null,
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50284728,
          'sha': 'd74abb6f150d22d304fa8e4f943ac0a327319dd5',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head-clang (f6e77b9)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/dc02bab4adea...d74abb6f150d',
          'committed_at': '2016-11-16T07:05:38Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176288809',
            '@representation': 'minimal',
            'id': 176288809
          },
          {
            '@type': 'job',
            '@href': '/job/176288810',
            '@representation': 'minimal',
            'id': 176288810
          },
          {
            '@type': 'job',
            '@href': '/job/176288811',
            '@representation': 'minimal',
            'id': 176288811
          },
          {
            '@type': 'job',
            '@href': '/job/176288812',
            '@representation': 'minimal',
            'id': 176288812
          },
          {
            '@type': 'job',
            '@href': '/job/176288813',
            '@representation': 'minimal',
            'id': 176288813
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176288802',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176288802,
        'number': '16741',
        'state': 'created',
        'duration': null,
        'event_type': 'push',
        'previous_state': 'passed',
        'started_at': null,
        'finished_at': null,
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50284726,
          'sha': 'dc02bab4adeadd694a40097661acb826a9bf6ddb',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head (f6e77b9)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/d54717b34692...dc02bab4adea',
          'committed_at': '2016-11-16T07:05:36Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176288803',
            '@representation': 'minimal',
            'id': 176288803
          },
          {
            '@type': 'job',
            '@href': '/job/176288804',
            '@representation': 'minimal',
            'id': 176288804
          },
          {
            '@type': 'job',
            '@href': '/job/176288805',
            '@representation': 'minimal',
            'id': 176288805
          },
          {
            '@type': 'job',
            '@href': '/job/176288806',
            '@representation': 'minimal',
            'id': 176288806
          },
          {
            '@type': 'job',
            '@href': '/job/176288807',
            '@representation': 'minimal',
            'id': 176288807
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176281729',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176281729,
        'number': '16740',
        'state': 'created',
        'duration': null,
        'event_type': 'push',
        'previous_state': 'canceled',
        'started_at': null,
        'finished_at': null,
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50282797,
          'sha': 'd54717b346923076860bb697d4290df6e79e3c13',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head-clang (708f1e7)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/9ed27bbb5548...d54717b34692',
          'committed_at': '2016-11-16T06:14:06Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176281730',
            '@representation': 'minimal',
            'id': 176281730
          },
          {
            '@type': 'job',
            '@href': '/job/176281731',
            '@representation': 'minimal',
            'id': 176281731
          },
          {
            '@type': 'job',
            '@href': '/job/176281732',
            '@representation': 'minimal',
            'id': 176281732
          },
          {
            '@type': 'job',
            '@href': '/job/176281733',
            '@representation': 'minimal',
            'id': 176281733
          },
          {
            '@type': 'job',
            '@href': '/job/176281734',
            '@representation': 'minimal',
            'id': 176281734
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176281721',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176281721,
        'number': '16739',
        'state': 'created',
        'duration': null,
        'event_type': 'push',
        'previous_state': 'canceled',
        'started_at': null,
        'finished_at': null,
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50282795,
          'sha': '9ed27bbb554848a4e2cd86d1adbbfc50f3ec4e9b',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head (708f1e7)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/4d1a05e42a89...9ed27bbb5548',
          'committed_at': '2016-11-16T06:14:03Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176281722',
            '@representation': 'minimal',
            'id': 176281722
          },
          {
            '@type': 'job',
            '@href': '/job/176281723',
            '@representation': 'minimal',
            'id': 176281723
          },
          {
            '@type': 'job',
            '@href': '/job/176281724',
            '@representation': 'minimal',
            'id': 176281724
          },
          {
            '@type': 'job',
            '@href': '/job/176281725',
            '@representation': 'minimal',
            'id': 176281725
          },
          {
            '@type': 'job',
            '@href': '/job/176281726',
            '@representation': 'minimal',
            'id': 176281726
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176276985',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176276985,
        'number': '16738',
        'state': 'started',
        'duration': null,
        'event_type': 'push',
        'previous_state': 'canceled',
        'started_at': '2016-11-16T09:14:29Z',
        'finished_at': null,
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50281345,
          'sha': '4d1a05e42a89c07890a4057eb8ec3ef95b9f49d7',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head-clang (13969a2)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/34b42811541c...4d1a05e42a89',
          'committed_at': '2016-11-16T05:32:21Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176276986',
            '@representation': 'minimal',
            'id': 176276986
          },
          {
            '@type': 'job',
            '@href': '/job/176276987',
            '@representation': 'minimal',
            'id': 176276987
          },
          {
            '@type': 'job',
            '@href': '/job/176276988',
            '@representation': 'minimal',
            'id': 176276988
          },
          {
            '@type': 'job',
            '@href': '/job/176276989',
            '@representation': 'minimal',
            'id': 176276989
          },
          {
            '@type': 'job',
            '@href': '/job/176276990',
            '@representation': 'minimal',
            'id': 176276990
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176276979',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176276979,
        'number': '16737',
        'state': 'passed',
        'duration': 1314,
        'event_type': 'push',
        'previous_state': 'canceled',
        'started_at': '2016-11-16T08:58:21Z',
        'finished_at': '2016-11-16T09:03:39Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50281344,
          'sha': '34b42811541c9355b4ee438d505d54624d259687',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head (13969a2)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/33709d4f90d3...34b42811541c',
          'committed_at': '2016-11-16T05:32:19Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176276980',
            '@representation': 'minimal',
            'id': 176276980
          },
          {
            '@type': 'job',
            '@href': '/job/176276981',
            '@representation': 'minimal',
            'id': 176276981
          },
          {
            '@type': 'job',
            '@href': '/job/176276982',
            '@representation': 'minimal',
            'id': 176276982
          },
          {
            '@type': 'job',
            '@href': '/job/176276983',
            '@representation': 'minimal',
            'id': 176276983
          },
          {
            '@type': 'job',
            '@href': '/job/176276984',
            '@representation': 'minimal',
            'id': 176276984
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176269358',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176269358,
        'number': '16736',
        'state': 'passed',
        'duration': 2744,
        'event_type': 'push',
        'previous_state': 'canceled',
        'started_at': '2016-11-16T08:40:58Z',
        'finished_at': '2016-11-16T08:46:16Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50279047,
          'sha': '33709d4f90d3c764e1fea626c6a3e485d5d076c9',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head-clang (affa0f8)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/f95fe6552584...33709d4f90d3',
          'committed_at': '2016-11-16T04:32:21Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176269359',
            '@representation': 'minimal',
            'id': 176269359
          },
          {
            '@type': 'job',
            '@href': '/job/176269360',
            '@representation': 'minimal',
            'id': 176269360
          },
          {
            '@type': 'job',
            '@href': '/job/176269361',
            '@representation': 'minimal',
            'id': 176269361
          },
          {
            '@type': 'job',
            '@href': '/job/176269362',
            '@representation': 'minimal',
            'id': 176269362
          },
          {
            '@type': 'job',
            '@href': '/job/176269364',
            '@representation': 'minimal',
            'id': 176269364
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176269348',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176269348,
        'number': '16735',
        'state': 'passed',
        'duration': 2768,
        'event_type': 'push',
        'previous_state': 'canceled',
        'started_at': '2016-11-16T08:22:03Z',
        'finished_at': '2016-11-16T08:27:41Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50279043,
          'sha': 'f95fe6552584e05545e1074289616426170666e2',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head (affa0f8)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/9d625325ff74...f95fe6552584',
          'committed_at': '2016-11-16T04:32:18Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176269349',
            '@representation': 'minimal',
            'id': 176269349
          },
          {
            '@type': 'job',
            '@href': '/job/176269350',
            '@representation': 'minimal',
            'id': 176269350
          },
          {
            '@type': 'job',
            '@href': '/job/176269351',
            '@representation': 'minimal',
            'id': 176269351
          },
          {
            '@type': 'job',
            '@href': '/job/176269352',
            '@representation': 'minimal',
            'id': 176269352
          },
          {
            '@type': 'job',
            '@href': '/job/176269353',
            '@representation': 'minimal',
            'id': 176269353
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176269296',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176269296,
        'number': '16734',
        'state': 'passed',
        'duration': 2654,
        'event_type': 'push',
        'previous_state': 'canceled',
        'started_at': '2016-11-16T08:04:29Z',
        'finished_at': '2016-11-16T08:09:17Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50279025,
          'sha': '9d625325ff7416e05b34bb5fb92fc95c9a3018de',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head-clang (ab9b789)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/092310140668...9d625325ff74',
          'committed_at': '2016-11-16T04:31:56Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176269297',
            '@representation': 'minimal',
            'id': 176269297
          },
          {
            '@type': 'job',
            '@href': '/job/176269298',
            '@representation': 'minimal',
            'id': 176269298
          },
          {
            '@type': 'job',
            '@href': '/job/176269299',
            '@representation': 'minimal',
            'id': 176269299
          },
          {
            '@type': 'job',
            '@href': '/job/176269300',
            '@representation': 'minimal',
            'id': 176269300
          },
          {
            '@type': 'job',
            '@href': '/job/176269301',
            '@representation': 'minimal',
            'id': 176269301
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176269272',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176269272,
        'number': '16733',
        'state': 'passed',
        'duration': 2964,
        'event_type': 'push',
        'previous_state': 'canceled',
        'started_at': '2016-11-16T07:41:43Z',
        'finished_at': '2016-11-16T07:47:15Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50279023,
          'sha': '0923101406684fbdebf8e693dc09f5736193f119',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head (ab9b789)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/a4e370333964...092310140668',
          'committed_at': '2016-11-16T04:31:54Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176269273',
            '@representation': 'minimal',
            'id': 176269273
          },
          {
            '@type': 'job',
            '@href': '/job/176269274',
            '@representation': 'minimal',
            'id': 176269274
          },
          {
            '@type': 'job',
            '@href': '/job/176269275',
            '@representation': 'minimal',
            'id': 176269275
          },
          {
            '@type': 'job',
            '@href': '/job/176269276',
            '@representation': 'minimal',
            'id': 176269276
          },
          {
            '@type': 'job',
            '@href': '/job/176269277',
            '@representation': 'minimal',
            'id': 176269277
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176264835',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176264835,
        'number': '16732',
        'state': 'passed',
        'duration': 2886,
        'event_type': 'push',
        'previous_state': 'canceled',
        'started_at': '2016-11-16T07:28:09Z',
        'finished_at': '2016-11-16T07:32:54Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50277692,
          'sha': 'a4e370333964efe55715bc7a4b05b5efb31b6190',
          'ref': 'refs/heads/build',
          'message': 'Merge pull request #25 from travis-ci/sol-xcode81-release-update\n\nUpdate Xcode8.1 image name',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/a53396f0bbfc...a4e370333964',
          'committed_at': '2016-11-16T03:56:07Z',
          'committer': {
            'name': 'GitHub',
            'avatar_url': 'https://0.gravatar.com/avatar/9181eb84f9c35729a3bad740fb7f9d93'
          },
          'author': {
            'name': 'Hiro Asari',
            'avatar_url': 'https://0.gravatar.com/avatar/40e5e9fe36a1f85166493faac2c17499'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176264836',
            '@representation': 'minimal',
            'id': 176264836
          },
          {
            '@type': 'job',
            '@href': '/job/176264837',
            '@representation': 'minimal',
            'id': 176264837
          },
          {
            '@type': 'job',
            '@href': '/job/176264838',
            '@representation': 'minimal',
            'id': 176264838
          },
          {
            '@type': 'job',
            '@href': '/job/176264839',
            '@representation': 'minimal',
            'id': 176264839
          },
          {
            '@type': 'job',
            '@href': '/job/176264840',
            '@representation': 'minimal',
            'id': 176264840
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176263631',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176263631,
        'number': '16730',
        'state': 'errored',
        'duration': 89,
        'event_type': 'push',
        'previous_state': null,
        'started_at': '2016-11-16T07:17:18Z',
        'finished_at': '2016-11-16T07:17:32Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/sol-xcode81-release-update',
          '@representation': 'minimal',
          'name': 'sol-xcode81-release-update'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50277367,
          'sha': 'd158b5ec30cd89fb8d2ab5e777881032c6f70bd3',
          'ref': 'refs/heads/sol-xcode81-release-update',
          'message': 'Update Xcode8.1 image name\n\n`osx_image: xcode8.1` is now supported, https://blog.travis-ci.com/2016-11-15-xcode-81-is-here',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/commit/d158b5ec30cd',
          'committed_at': '2016-11-16T03:46:30Z',
          'committer': {
            'name': 'GitHub',
            'avatar_url': 'https://0.gravatar.com/avatar/9181eb84f9c35729a3bad740fb7f9d93'
          },
          'author': {
            'name': 'Brandon Burton',
            'avatar_url': 'https://0.gravatar.com/avatar/b045192408d417141a55e4953972cb2f'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176263632',
            '@representation': 'minimal',
            'id': 176263632
          },
          {
            '@type': 'job',
            '@href': '/job/176263633',
            '@representation': 'minimal',
            'id': 176263633
          },
          {
            '@type': 'job',
            '@href': '/job/176263634',
            '@representation': 'minimal',
            'id': 176263634
          },
          {
            '@type': 'job',
            '@href': '/job/176263635',
            '@representation': 'minimal',
            'id': 176263635
          },
          {
            '@type': 'job',
            '@href': '/job/176263636',
            '@representation': 'minimal',
            'id': 176263636
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176260234',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176260234,
        'number': '16729',
        'state': 'passed',
        'duration': 2704,
        'event_type': 'push',
        'previous_state': 'canceled',
        'started_at': '2016-11-16T07:00:39Z',
        'finished_at': '2016-11-16T07:05:28Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50276336,
          'sha': 'a53396f0bbfc378ff7441f7ffb18c0b929577c6d',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head-clang (2acc570)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/e292b5c39d54...a53396f0bbfc',
          'committed_at': '2016-11-16T03:20:16Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176260235',
            '@representation': 'minimal',
            'id': 176260235
          },
          {
            '@type': 'job',
            '@href': '/job/176260236',
            '@representation': 'minimal',
            'id': 176260236
          },
          {
            '@type': 'job',
            '@href': '/job/176260237',
            '@representation': 'minimal',
            'id': 176260237
          },
          {
            '@type': 'job',
            '@href': '/job/176260238',
            '@representation': 'minimal',
            'id': 176260238
          },
          {
            '@type': 'job',
            '@href': '/job/176260239',
            '@representation': 'minimal',
            'id': 176260239
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176260228',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176260228,
        'number': '16728',
        'state': 'passed',
        'duration': 3022,
        'event_type': 'push',
        'previous_state': 'canceled',
        'started_at': '2016-11-16T06:42:03Z',
        'finished_at': '2016-11-16T06:47:16Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50276335,
          'sha': 'e292b5c39d548208fb3da971b0b75f09330b29c5',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head (2acc570)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/c6c842a13ba5...e292b5c39d54',
          'committed_at': '2016-11-16T03:20:14Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176260229',
            '@representation': 'minimal',
            'id': 176260229
          },
          {
            '@type': 'job',
            '@href': '/job/176260230',
            '@representation': 'minimal',
            'id': 176260230
          },
          {
            '@type': 'job',
            '@href': '/job/176260231',
            '@representation': 'minimal',
            'id': 176260231
          },
          {
            '@type': 'job',
            '@href': '/job/176260232',
            '@representation': 'minimal',
            'id': 176260232
          },
          {
            '@type': 'job',
            '@href': '/job/176260233',
            '@representation': 'minimal',
            'id': 176260233
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176252764',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176252764,
        'number': '16724',
        'state': 'passed',
        'duration': 908,
        'event_type': 'push',
        'previous_state': 'passed',
        'started_at': '2016-11-16T06:02:21Z',
        'finished_at': '2016-11-16T06:03:57Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50273998,
          'sha': 'c6c842a13ba589f5eccb6879def83db187a0beea',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for mruby-head (1685eff)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/a71381343b2b...c6c842a13ba5',
          'committed_at': '2016-11-16T02:20:29Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176252765',
            '@representation': 'minimal',
            'id': 176252765
          },
          {
            '@type': 'job',
            '@href': '/job/176252766',
            '@representation': 'minimal',
            'id': 176252766
          },
          {
            '@type': 'job',
            '@href': '/job/176252767',
            '@representation': 'minimal',
            'id': 176252767
          },
          {
            '@type': 'job',
            '@href': '/job/176252768',
            '@representation': 'minimal',
            'id': 176252768
          },
          {
            '@type': 'job',
            '@href': '/job/176252769',
            '@representation': 'minimal',
            'id': 176252769
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176224811',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176224811,
        'number': '16723',
        'state': 'passed',
        'duration': 930,
        'event_type': 'push',
        'previous_state': 'passed',
        'started_at': '2016-11-16T05:46:26Z',
        'finished_at': '2016-11-16T05:47:59Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50265601,
          'sha': 'a71381343b2b7c9628e08d64af8bbe7a94070c01',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for mruby-head (1f554ff)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/a17d4be6dcc5...a71381343b2b',
          'committed_at': '2016-11-15T23:47:31Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176224812',
            '@representation': 'minimal',
            'id': 176224812
          },
          {
            '@type': 'job',
            '@href': '/job/176224813',
            '@representation': 'minimal',
            'id': 176224813
          },
          {
            '@type': 'job',
            '@href': '/job/176224814',
            '@representation': 'minimal',
            'id': 176224814
          },
          {
            '@type': 'job',
            '@href': '/job/176224815',
            '@representation': 'minimal',
            'id': 176224815
          },
          {
            '@type': 'job',
            '@href': '/job/176224816',
            '@representation': 'minimal',
            'id': 176224816
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176134099',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176134099,
        'number': '16722',
        'state': 'passed',
        'duration': 3095,
        'event_type': 'push',
        'previous_state': 'passed',
        'started_at': '2016-11-16T05:21:47Z',
        'finished_at': '2016-11-16T05:27:24Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50240338,
          'sha': '567c5e031818963c8644ad87732de85ccfea39a3',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head (84cd4f8)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/b0e86eba32f3...567c5e031818',
          'committed_at': '2016-11-15T18:32:42Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176134101',
            '@representation': 'minimal',
            'id': 176134101
          },
          {
            '@type': 'job',
            '@href': '/job/176134109',
            '@representation': 'minimal',
            'id': 176134109
          },
          {
            '@type': 'job',
            '@href': '/job/176134111',
            '@representation': 'minimal',
            'id': 176134111
          },
          {
            '@type': 'job',
            '@href': '/job/176134112',
            '@representation': 'minimal',
            'id': 176134112
          },
          {
            '@type': 'job',
            '@href': '/job/176134113',
            '@representation': 'minimal',
            'id': 176134113
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176134090',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176134090,
        'number': '16721',
        'state': 'passed',
        'duration': 2677,
        'event_type': 'push',
        'previous_state': 'passed',
        'started_at': '2016-11-16T04:58:28Z',
        'finished_at': '2016-11-16T05:03:24Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50240339,
          'sha': 'a17d4be6dcc555b3dedf12041d9ff96eff5d6776',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head-clang (84cd4f8)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/567c5e031818...a17d4be6dcc5',
          'committed_at': '2016-11-15T18:32:45Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176134091',
            '@representation': 'minimal',
            'id': 176134091
          },
          {
            '@type': 'job',
            '@href': '/job/176134092',
            '@representation': 'minimal',
            'id': 176134092
          },
          {
            '@type': 'job',
            '@href': '/job/176134093',
            '@representation': 'minimal',
            'id': 176134093
          },
          {
            '@type': 'job',
            '@href': '/job/176134094',
            '@representation': 'minimal',
            'id': 176134094
          },
          {
            '@type': 'job',
            '@href': '/job/176134096',
            '@representation': 'minimal',
            'id': 176134096
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176131802',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176131802,
        'number': '16720',
        'state': 'passed',
        'duration': 925,
        'event_type': 'push',
        'previous_state': 'passed',
        'started_at': '2016-11-16T04:33:15Z',
        'finished_at': '2016-11-16T04:34:52Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50239636,
          'sha': 'b0e86eba32f3710d47592f0d9f1ad56bc74f6f02',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for mruby-head (1f554ff)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/b3ab41c066bf...b0e86eba32f3',
          'committed_at': '2016-11-15T18:23:40Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176131803',
            '@representation': 'minimal',
            'id': 176131803
          },
          {
            '@type': 'job',
            '@href': '/job/176131804',
            '@representation': 'minimal',
            'id': 176131804
          },
          {
            '@type': 'job',
            '@href': '/job/176131805',
            '@representation': 'minimal',
            'id': 176131805
          },
          {
            '@type': 'job',
            '@href': '/job/176131806',
            '@representation': 'minimal',
            'id': 176131806
          },
          {
            '@type': 'job',
            '@href': '/job/176131807',
            '@representation': 'minimal',
            'id': 176131807
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176119832',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176119832,
        'number': '16719',
        'state': 'passed',
        'duration': 966,
        'event_type': 'push',
        'previous_state': 'passed',
        'started_at': '2016-11-16T04:04:20Z',
        'finished_at': '2016-11-16T04:06:05Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50236091,
          'sha': 'b3ab41c066bfae9327a3cd6a333514901da9fc37',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for mruby-head (739dad6)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/458adc1b9215...b3ab41c066bf',
          'committed_at': '2016-11-15T17:40:26Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176119833',
            '@representation': 'minimal',
            'id': 176119833
          },
          {
            '@type': 'job',
            '@href': '/job/176119834',
            '@representation': 'minimal',
            'id': 176119834
          },
          {
            '@type': 'job',
            '@href': '/job/176119835',
            '@representation': 'minimal',
            'id': 176119835
          },
          {
            '@type': 'job',
            '@href': '/job/176119836',
            '@representation': 'minimal',
            'id': 176119836
          },
          {
            '@type': 'job',
            '@href': '/job/176119837',
            '@representation': 'minimal',
            'id': 176119837
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176098874',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176098874,
        'number': '16718',
        'state': 'passed',
        'duration': 3662,
        'event_type': 'push',
        'previous_state': 'passed',
        'started_at': '2016-11-16T03:20:15Z',
        'finished_at': '2016-11-16T03:28:00Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50229821,
          'sha': '458adc1b921596f4b0be1b4b72d729f823e6d0cf',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for jruby-head (a4911d0)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/095f4277a840...458adc1b9215',
          'committed_at': '2016-11-15T16:29:01Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176098875',
            '@representation': 'minimal',
            'id': 176098875
          },
          {
            '@type': 'job',
            '@href': '/job/176098876',
            '@representation': 'minimal',
            'id': 176098876
          },
          {
            '@type': 'job',
            '@href': '/job/176098877',
            '@representation': 'minimal',
            'id': 176098877
          },
          {
            '@type': 'job',
            '@href': '/job/176098878',
            '@representation': 'minimal',
            'id': 176098878
          },
          {
            '@type': 'job',
            '@href': '/job/176098879',
            '@representation': 'minimal',
            'id': 176098879
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176083971',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176083971,
        'number': '16717',
        'state': 'passed',
        'duration': 3739,
        'event_type': 'push',
        'previous_state': 'passed',
        'started_at': '2016-11-16T02:18:27Z',
        'finished_at': '2016-11-16T02:26:01Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50225336,
          'sha': '095f4277a840b5c6f97b3bb967d7f2ac1faf7029',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for jruby-head (4b9509d)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/492bf8da15dc...095f4277a840',
          'committed_at': '2016-11-15T15:39:19Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176083972',
            '@representation': 'minimal',
            'id': 176083972
          },
          {
            '@type': 'job',
            '@href': '/job/176083973',
            '@representation': 'minimal',
            'id': 176083973
          },
          {
            '@type': 'job',
            '@href': '/job/176083974',
            '@representation': 'minimal',
            'id': 176083974
          },
          {
            '@type': 'job',
            '@href': '/job/176083975',
            '@representation': 'minimal',
            'id': 176083975
          },
          {
            '@type': 'job',
            '@href': '/job/176083976',
            '@representation': 'minimal',
            'id': 176083976
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/176075620',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 176075620,
        'number': '16716',
        'state': 'passed',
        'duration': 2609,
        'event_type': 'push',
        'previous_state': 'passed',
        'started_at': '2016-11-16T00:49:18Z',
        'finished_at': '2016-11-16T00:54:08Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          'id': 50222678,
          'sha': '492bf8da15dcd1ff33e2a3aeb96cdebe4b909f3c',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head-clang (0fe793c)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/a872f6369dee...492bf8da15dc',
          'committed_at': '2016-11-15T15:11:38Z',
          'committer': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          },
          'author': {
            'name': 'Konstantin Haase',
            'avatar_url': 'https://0.gravatar.com/avatar/5c2b452f6eea4a6d84c105ebd971d2a4'
          }
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/176075621',
            '@representation': 'minimal',
            'id': 176075621
          },
          {
            '@type': 'job',
            '@href': '/job/176075622',
            '@representation': 'minimal',
            'id': 176075622
          },
          {
            '@type': 'job',
            '@href': '/job/176075626',
            '@representation': 'minimal',
            'id': 176075626
          },
          {
            '@type': 'job',
            '@href': '/job/176075628',
            '@representation': 'minimal',
            'id': 176075628
          },
          {
            '@type': 'job',
            '@href': '/job/176075629',
            '@representation': 'minimal',
            'id': 176075629
          }
        ]
      }
    ]
  };
}
