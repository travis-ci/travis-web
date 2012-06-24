(function() {
  var artifact, artifacts, build, builds, commits, id, job, jobs, repositories, repository, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m;

  repositories = [
    {
      id: 1,
      owner: 'travis-ci',
      name: 'travis-core',
      slug: 'travis-ci/travis-core',
      build_ids: [1, 2],
      last_build_id: 1,
      last_build_number: 1,
      last_build_result: 0
    }, {
      id: 2,
      owner: 'travis-ci',
      name: 'travis-assets',
      slug: 'travis-ci/travis-assets',
      build_ids: [3],
      last_build_id: 3,
      last_build_number: 3
    }, {
      id: 3,
      owner: 'travis-ci',
      name: 'travis-hub',
      slug: 'travis-ci/travis-hub',
      build_ids: [4],
      last_build_id: 4,
      last_build_number: 4
    }
  ];

  builds = [
    {
      id: 1,
      repository_id: 'travis-ci/travis-core',
      commit_id: 1,
      job_ids: [1, 2],
      number: 1,
      event_type: 'push',
      config: {
        rvm: ['rbx', '1.9.3']
      },
      finished_at: '2012-06-20T00:21:20Z',
      duration: 35,
      result: 0
    }, {
      id: 2,
      repository_id: 'travis-ci/travis-core',
      commit_id: 2,
      job_ids: [3],
      number: 2,
      event_type: 'push',
      config: {
        rvm: ['rbx']
      }
    }, {
      id: 3,
      repository_id: 'travis-ci/travis-assets',
      commit_id: 3,
      job_ids: [4],
      number: 3,
      event_type: 'push',
      config: {
        rvm: ['rbx']
      }
    }, {
      id: 4,
      repository_id: 'travis-ci/travis-hub',
      commit_id: 4,
      job_ids: [5],
      number: 4,
      event_type: 'push',
      config: {
        rvm: ['rbx']
      }
    }
  ];

  commits = [
    {
      id: 1,
      sha: '1234567',
      branch: 'master',
      message: 'commit message 1',
      author_name: 'author name',
      author_email: 'author@email.com',
      compare_url: 'http://github.com/compare/012345..123456'
    }, {
      id: 2,
      sha: '2345678',
      branch: 'feature',
      message: 'commit message 2',
      author_name: 'author name',
      author_email: 'author@email.com',
      compare_url: 'http://github.com/compare/012345..123456'
    }, {
      id: 3,
      sha: '3456789',
      branch: 'master',
      message: 'commit message 3',
      author_name: 'author name',
      author_email: 'author@email.com',
      compare_url: 'http://github.com/compare/012345..123456'
    }, {
      id: 4,
      sha: '4567890',
      branch: 'master',
      message: 'commit message 4',
      author_name: 'author name',
      author_email: 'author@email.com',
      compare_url: 'http://github.com/compare/012345..123456'
    }
  ];

  jobs = [
    {
      id: 1,
      repository_id: 1,
      build_id: 1,
      commit_id: 1,
      log_id: 1,
      number: '1.1',
      config: {
        rvm: 'rbx'
      },
      finished_at: '2012-06-20T00:21:20Z',
      duration: 35,
      result: 0
    }, {
      id: 2,
      repository_id: 1,
      build_id: 1,
      commit_id: 1,
      log_id: 2,
      number: '1.2',
      config: {
        rvm: '1.9.3'
      }
    }, {
      id: 3,
      repository_id: 1,
      build_id: 2,
      commit_id: 2,
      log_id: 3,
      number: '2.1'
    }, {
      id: 4,
      repository_id: 2,
      build_id: 3,
      commit_id: 3,
      log_id: 4,
      number: '3.1'
    }, {
      id: 5,
      repository_id: 3,
      build_id: 4,
      commit_id: 4,
      log_id: 5,
      number: '4.1'
    }
  ];

  artifacts = [
    {
      id: 1,
      body: 'log 1'
    }, {
      id: 2,
      body: 'log 2'
    }, {
      id: 3,
      body: 'log 3'
    }, {
      id: 4,
      body: 'log 4'
    }, {
      id: 5,
      body: 'log 4'
    }
  ];

  $.mockjax({
    url: '/repositories',
    responseTime: 0,
    responseText: {
      repositories: repositories
    }
  });

  for (_i = 0, _len = repositories.length; _i < _len; _i++) {
    repository = repositories[_i];
    $.mockjax({
      url: '/' + repository.slug,
      responseTime: 0,
      responseText: {
        repository: repository
      }
    });
  }

  for (_j = 0, _len1 = builds.length; _j < _len1; _j++) {
    build = builds[_j];
    $.mockjax({
      url: '/builds/' + build.id,
      responseTime: 0,
      responseText: {
        build: build,
        commit: commits[build.commit_id - 1],
        jobs: (function() {
          var _k, _len2, _ref, _results;
          _ref = build.job_ids;
          _results = [];
          for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
            id = _ref[_k];
            _results.push(jobs[id - 1]);
          }
          return _results;
        })()
      }
    });
  }

  for (_k = 0, _len2 = repositories.length; _k < _len2; _k++) {
    repository = repositories[_k];
    $.mockjax({
      url: '/builds',
      data: {
        repository_id: 1,
        event_type: 'push',
        orderBy: 'number DESC'
      },
      responseTime: 0,
      responseText: {
        builds: (function() {
          var _l, _len3, _ref, _results;
          _ref = repository.build_ids;
          _results = [];
          for (_l = 0, _len3 = _ref.length; _l < _len3; _l++) {
            id = _ref[_l];
            _results.push(builds[id - 1]);
          }
          return _results;
        })(),
        commits: (function() {
          var _l, _len3, _ref, _results;
          _ref = repository.build_ids;
          _results = [];
          for (_l = 0, _len3 = _ref.length; _l < _len3; _l++) {
            id = _ref[_l];
            _results.push(commits[builds[id - 1].commit_id - 1]);
          }
          return _results;
        })()
      }
    });
  }

  for (_l = 0, _len3 = jobs.length; _l < _len3; _l++) {
    job = jobs[_l];
    $.mockjax({
      url: '/jobs/' + job.id,
      responseTime: 0,
      responseText: {
        job: job,
        commit: commits[job.commit_id - 1]
      }
    });
  }

  for (_m = 0, _len4 = artifacts.length; _m < _len4; _m++) {
    artifact = artifacts[_m];
    $.mockjax({
      url: '/artifacts/' + artifact.id,
      responseTime: 0,
      responseText: {
        artifact: artifact
      }
    });
  }

}).call(this);
