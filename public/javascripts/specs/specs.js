(function() {

  describe('on the "current" state', function() {
    beforeEach(function() {
      app('!/travis-ci/travis-core');
      waitFor(repositoriesRendered);
      return waitFor(buildRendered);
    });
    return it('displays the expected stuff', function() {
      displaysRepoList([
        {
          slug: 'travis-ci/travis-core',
          build: {
            number: 1,
            url: '#!/travis-ci/travis-core/builds/1',
            duration: '30 sec',
            finishedAt: '3 minutes ago'
          }
        }, {
          slug: 'travis-ci/travis-assets',
          build: {
            number: 3,
            url: '#!/travis-ci/travis-assets/builds/3',
            duration: '30 sec',
            finishedAt: 'a day ago'
          }
        }, {
          slug: 'travis-ci/travis-hub',
          build: {
            number: 4,
            url: '#!/travis-ci/travis-hub/builds/4',
            duration: '1 min',
            finishedAt: '-'
          }
        }
      ]);
      displaysBuildSummary({
        id: 1,
        repo: 'travis-ci/travis-core',
        commit: '1234567',
        branch: 'master',
        compare: '0123456..1234567',
        finishedAt: '3 minutes ago',
        duration: '30 sec',
        message: 'commit message 1'
      });
      displaysTabs({
        current: '#!/travis-ci/travis-core',
        builds: '#!/travis-ci/travis-core/builds'
      });
      displaysJobMatrix({
        element: '#jobs',
        headers: ['Job', 'Duration', 'Finished', 'Rvm'],
        jobs: [
          {
            id: 1,
            number: '1.1',
            repo: 'travis-ci/travis-core',
            finishedAt: '3 minutes ago',
            duration: '30 sec',
            rvm: 'rbx'
          }
        ]
      });
      return displaysJobMatrix({
        element: '#allowed_failure_jobs',
        headers: ['Job', 'Duration', 'Finished', 'Rvm'],
        jobs: [
          {
            id: 2,
            number: '1.2',
            repo: 'travis-ci/travis-core',
            finishedAt: '-',
            duration: '-',
            rvm: '1.9.3'
          }
        ]
      });
    });
  });

}).call(this);
(function() {

  describe('events', function() {
    beforeEach(function() {
      app;
      return waitFor(buildRendered);
    });
    return it('foo', function() {
      return Travis.app.receive('build:started', {
        repository: {
          id: 10,
          owner: 'travis-ci',
          name: 'travis-support',
          slug: 'travis-ci/travis-support',
          build_ids: [10],
          last_build_id: 10,
          last_build_number: 10,
          last_build_started_at: '2012-07-02T00:02:00Z',
          description: 'Description of travis-hub'
        },
        build: {
          id: 10,
          repository_id: 1,
          commit_id: 10,
          job_ids: [10],
          number: 10,
          event_type: 'push',
          config: {
            rvm: ['rbx']
          }
        },
        commit: {
          id: 10,
          sha: '1234567',
          branch: 'master',
          message: 'commit message 1',
          author_name: 'author name',
          author_email: 'author@email.com',
          committer_name: 'committer name',
          committer_email: 'committer@email.com',
          compare_url: 'http://github.com/compare/0123456..1234567'
        }
      });
    });
  });

}).call(this);
(function() {

  describe('on the "index" state', function() {
    beforeEach(function() {
      app('');
      return waitFor(buildRendered);
    });
    return it('displays the expected stuff', function() {
      displaysRepoList([
        {
          slug: 'travis-ci/travis-core',
          build: {
            number: 1,
            url: '#!/travis-ci/travis-core/builds/1',
            duration: '30 sec',
            finishedAt: '3 minutes ago'
          }
        }, {
          slug: 'travis-ci/travis-assets',
          build: {
            number: 3,
            url: '#!/travis-ci/travis-assets/builds/3',
            duration: '30 sec',
            finishedAt: 'a day ago'
          }
        }, {
          slug: 'travis-ci/travis-hub',
          build: {
            number: 4,
            url: '#!/travis-ci/travis-hub/builds/4',
            duration: '1 min',
            finishedAt: '-'
          }
        }
      ]);
      displaysRepository({
        href: 'http://github.com/travis-ci/travis-core'
      });
      displaysBuildSummary({
        id: 1,
        repo: 'travis-ci/travis-core',
        commit: '1234567',
        branch: 'master',
        compare: '0123456..1234567',
        finishedAt: '3 minutes ago',
        duration: '30 sec',
        message: 'commit message 1'
      });
      displaysTabs({
        current: '#!/travis-ci/travis-core',
        builds: '#!/travis-ci/travis-core/builds'
      });
      displaysJobMatrix({
        element: '#jobs',
        headers: ['Job', 'Duration', 'Finished', 'Rvm'],
        jobs: [
          {
            id: 1,
            number: '1.1',
            repo: 'travis-ci/travis-core',
            finishedAt: '3 minutes ago',
            duration: '30 sec',
            rvm: 'rbx'
          }
        ]
      });
      return displaysJobMatrix({
        element: '#allowed_failure_jobs',
        headers: ['Job', 'Duration', 'Finished', 'Rvm'],
        jobs: [
          {
            id: 2,
            number: '1.2',
            repo: 'travis-ci/travis-core',
            finishedAt: '-',
            duration: '-',
            rvm: '1.9.3'
          }
        ]
      });
    });
  });

}).call(this);
(function() {
  var _Date;

  minispade.require('app');

  this.reset = function() {
    if (Travis.app) {
      Travis.app.destroy();
    }
    $('#content').remove();
    return $('body').append('<div id="content"></div>');
  };

  this.app = function(url) {
    reset();
    return Em.run(function() {
      Travis.run({
        rootElement: $('#content')
      });
      return Em.routes.set('location', url);
    });
  };

  _Date = Date;

  this.Date = function(date) {
    return new _Date(date || '2012-07-02T00:03:00Z');
  };

  this.Date.UTC = _Date.UTC;

}).call(this);
(function() {

  this.repositoriesRendered = function() {
    return $('#repositories li a.current').text() !== '';
  };

  this.buildRendered = function() {
    return $('#summary .number').text() !== '';
  };

  this.matrixRendered = function() {
    return $('#jobs').text() !== '';
  };

}).call(this);
(function() {

  this.displaysRepoList = function(repos) {
    var element, elements, ix, repo, _i, _len, _results;
    elements = $('#repositories li').toArray();
    ix = 0;
    _results = [];
    for (_i = 0, _len = repos.length; _i < _len; _i++) {
      repo = repos[_i];
      element = elements[ix];
      expect($('a.current', element).attr('href')).toEqual("#!/" + repo.slug);
      expect($('a.last_build', element).attr('href')).toEqual(repo.build.url);
      expect($('.duration', element).text()).toEqual(repo.build.duration);
      expect($('.finished_at', element).text()).toEqual(repo.build.finishedAt);
      _results.push(ix += 1);
    }
    return _results;
  };

  this.displaysRepository = function(repo) {
    return expect($('#repository h3 a').attr('href')).toEqual(repo.href);
  };

  this.displaysTabs = function(tabs) {
    var tab, url, _i, _len, _results;
    _results = [];
    for (url = _i = 0, _len = tabs.length; _i < _len; url = ++_i) {
      tab = tabs[url];
      _results.push(expect($("#tab_" + tab + " a").attr('href')).toEqual(url));
    }
    return _results;
  };

  this.displaysBuildSummary = function(data) {
    var element;
    element = $('#summary .number a');
    expect(element.attr('href')).toEqual("#!/" + data.repo + "/builds/" + data.id);
    element = $('#summary .finished_at');
    expect(element.text()).toEqual(data.finishedAt);
    element = $('#summary .duration');
    expect(element.text()).toEqual(data.duration);
    element = $('#summary .commit a');
    expect(element.attr('href')).toEqual("http://github.com/" + data.repo + "/commit/" + data.commit);
    element = $('#summary .commit a');
    expect(element.text()).toEqual("" + data.commit + " (" + data.branch + ")");
    element = $('#summary .compare a');
    expect(element.attr('href')).toEqual("http://github.com/compare/" + data.compare);
    element = $('#summary .compare a');
    expect(element.text()).toEqual(data.compare);
    element = $('#summary .message');
    return expect(element.text()).toEqual(data.message);
  };

  this.displaysJobMatrix = function(data) {
    var element, headers;
    headers = (function() {
      var _i, _len, _ref, _results;
      _ref = $("" + data.element + " thead th");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        _results.push($(element).text());
      }
      return _results;
    })();
    expect(headers).toEqual(data.headers);
    return $.each(data.jobs, function(ix, job) {
      ix = (ix + 1) * 3;
      element = $("" + data.element + " tr:nth-child(" + ix + ") td.number");
      expect(element.text()).toEqual(job.number);
      element = $("" + data.element + " tr:nth-child(" + ix + ") td.number a");
      expect(element.attr('href')).toEqual("#!/" + job.repo + "/jobs/" + job.id);
      element = $("" + data.element + " tr:nth-child(" + ix + ") td.duration");
      expect(element.text()).toEqual(job.duration);
      element = $("" + data.element + " tr:nth-child(" + ix + ") td.finished_at");
      expect(element.text()).toEqual(job.finishedAt);
      element = $("" + data.element + " tr:nth-child(" + ix + ") td:nth-child(6)");
      return expect(element.text()).toEqual(job.rvm);
    });
  };

}).call(this);
(function() {

  this.after = function(time, func) {
    waits(time);
    return jasmine.getEnv().currentSpec.runs(func);
  };

  this.once = function(condition, func) {
    waitsFor(condition);
    return jasmine.getEnv().currentSpec.runs(func);
  };

  this.waitFor = waitsFor;

}).call(this);
