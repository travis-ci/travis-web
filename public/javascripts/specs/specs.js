(function() {

  describe('on the "build" state', function() {
    beforeEach(function() {
      app('!/travis-ci/travis-core/builds/1');
      return waitFor(buildRendered);
    });
    return it('displays the expected stuff', function() {
      displaysReposList([
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
      displaysSummary({
        type: 'build',
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
        current: {
          href: '#!/travis-ci/travis-core'
        },
        builds: {
          href: '#!/travis-ci/travis-core/builds'
        },
        build: {
          href: '#!/travis-ci/travis-core/builds/1',
          active: true
        },
        job: {
          hidden: true
        }
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
          }, {
            id: 2,
            number: '1.2',
            repo: 'travis-ci/travis-core',
            finishedAt: '2 minutes ago',
            duration: '40 sec',
            rvm: '1.9.3'
          }
        ]
      });
      return displaysJobMatrix({
        element: '#allowed_failure_jobs',
        headers: ['Job', 'Duration', 'Finished', 'Rvm'],
        jobs: [
          {
            id: 3,
            number: '1.3',
            repo: 'travis-ci/travis-core',
            finishedAt: '-',
            duration: '-',
            rvm: 'jruby'
          }
        ]
      });
    });
  });

}).call(this);
(function() {



}).call(this);
(function() {

  describe('on the "current" state', function() {
    beforeEach(function() {
      app('!/travis-ci/travis-core');
      return waitFor(buildRendered);
    });
    return it('displays the expected stuff', function() {
      displaysReposList([
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
      displaysSummary({
        type: 'build',
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
        current: {
          href: '#!/travis-ci/travis-core',
          active: true
        },
        builds: {
          href: '#!/travis-ci/travis-core/builds'
        },
        build: {
          hidden: true
        },
        job: {
          hidden: true
        }
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
          }, {
            id: 2,
            number: '1.2',
            repo: 'travis-ci/travis-core',
            finishedAt: '2 minutes ago',
            duration: '40 sec',
            rvm: '1.9.3'
          }
        ]
      });
      return displaysJobMatrix({
        element: '#allowed_failure_jobs',
        headers: ['Job', 'Duration', 'Finished', 'Rvm'],
        jobs: [
          {
            id: 3,
            number: '1.3',
            repo: 'travis-ci/travis-core',
            finishedAt: '-',
            duration: '-',
            rvm: 'jruby'
          }
        ]
      });
    });
  });

}).call(this);
(function() {



}).call(this);
(function() {

  describe('on the "index" state', function() {
    beforeEach(function() {
      app('');
      return waitFor(buildRendered);
    });
    return it('displays the expected stuff', function() {
      displaysReposList([
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
      displaysSummary({
        type: 'build',
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
        current: {
          href: '#!/travis-ci/travis-core',
          active: true
        },
        builds: {
          href: '#!/travis-ci/travis-core/builds'
        },
        build: {
          hidden: true
        },
        job: {
          hidden: true
        }
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
          }, {
            id: 2,
            number: '1.2',
            repo: 'travis-ci/travis-core',
            finishedAt: '2 minutes ago',
            duration: '40 sec',
            rvm: '1.9.3'
          }
        ]
      });
      return displaysJobMatrix({
        element: '#allowed_failure_jobs',
        headers: ['Job', 'Duration', 'Finished', 'Rvm'],
        jobs: [
          {
            id: 3,
            number: '1.3',
            repo: 'travis-ci/travis-core',
            finishedAt: '-',
            duration: '-',
            rvm: 'jruby'
          }
        ]
      });
    });
  });

}).call(this);
(function() {

  describe('on the "job" state', function() {
    beforeEach(function() {
      app('!/travis-ci/travis-core/jobs/1');
      waitFor(jobRendered);
      return waitFor(hasText('#tab_build', 'Build #1'));
    });
    return it('displays the expected stuff', function() {
      displaysReposList([
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
      displaysSummary({
        id: 1,
        type: 'job',
        repo: 'travis-ci/travis-core',
        commit: '1234567',
        branch: 'master',
        compare: '0123456..1234567',
        finishedAt: '3 minutes ago',
        duration: '30 sec',
        message: 'commit message 1'
      });
      displaysTabs({
        current: {
          href: '#!/travis-ci/travis-core'
        },
        builds: {
          href: '#!/travis-ci/travis-core/builds'
        },
        build: {
          href: '#!/travis-ci/travis-core/builds/1'
        },
        job: {
          href: '#!/travis-ci/travis-core/jobs/1',
          active: true
        }
      });
      return displaysLog(['log 1']);
    });
  });

}).call(this);
(function() {
  var _Date;

  minispade.require('app');

  this.reset = function() {
    Em.run(function() {
      if (Travis.app) {
        return Travis.app.destroy();
      }
    });
    waits(500);
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

  this.notEmpty = function(selector) {
    return function() {
      return $(selector).text().trim() !== '';
    };
  };

  this.hasText = function(selector, text) {
    return function() {
      return $(selector).text().trim() === text;
    };
  };

  this.reposRendered = notEmpty('#repositories li a.current');

  this.buildRendered = notEmpty('#summary .number');

  this.buildsRendered = notEmpty('#builds .number');

  this.matrixRendered = notEmpty('#jobs');

  this.jobRendered = notEmpty('#summary .number');

}).call(this);
(function() {

  this.displaysReposList = function(repos) {
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
    var name, tab, _results;
    _results = [];
    for (name in tabs) {
      tab = tabs[name];
      if (!tab.hidden) {
        expect($("#tab_" + name + " a").attr('href')).toEqual(tab.href);
      }
      expect($("#tab_" + name).hasClass('active')).toEqual(!!tab.active);
      if (name === 'build' || name === 'job') {
        _results.push(expect($("#tab_" + name).hasClass('display')).toEqual(!tab.hidden));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  this.displaysSummary = function(data) {
    var element;
    element = $('#summary .left:first-child dt:first-child');
    expect(element.text()).toEqual($.camelize(data.type));
    element = $('#summary .number a');
    expect(element.attr('href')).toEqual("#!/" + data.repo + "/" + data.type + "s/" + data.id);
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

  this.displaysBuildsList = function(builds) {
    var build, ix, row, rows, _i, _len, _results;
    rows = $('#builds tbody tr').toArray();
    ix = 0;
    _results = [];
    for (_i = 0, _len = builds.length; _i < _len; _i++) {
      build = builds[_i];
      row = rows[ix];
      expect($('.number a', row).attr('href')).toEqual("#!/" + build.slug + "/builds/" + build.id);
      expect($('.number a', row).text()).toEqual(build.number);
      expect($('.message', row).text()).toEqual(build.message);
      expect($('.duration', row).text()).toEqual(build.duration);
      expect($('.finished_at', row).text()).toEqual(build.finishedAt);
      _results.push(ix += 1);
    }
    return _results;
  };

  this.displaysLog = function(lines) {
    var ix, log;
    ix = 0;
    log = $.map(lines, function(line) {
      ix += 1;
      return "" + ix + line;
    }).join("\n");
    return expect($('#log').text().trim()).toEqual(log);
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
