(function() {

  describe('on the "build" state', function() {
    beforeEach(function() {
      app('travis-ci/travis-core/builds/1');
      waitFor(reposRendered);
      return runs(function() {
        return waitFor(buildRendered);
      });
    });
    afterEach(function() {
      return window.history.pushState({}, null, '/spec.html');
    });
    return it('displays the expected stuff', function() {
      listsRepos([
        {
          slug: 'travis-ci/travis-hub',
          build: {
            number: 4,
            url: '/travis-ci/travis-hub/builds/4',
            duration: '1 min',
            finishedAt: '-'
          }
        }, {
          slug: 'travis-ci/travis-core',
          build: {
            number: 1,
            url: '/travis-ci/travis-core/builds/1',
            duration: '30 sec',
            finishedAt: '3 minutes ago'
          }
        }, {
          slug: 'travis-ci/travis-assets',
          build: {
            number: 3,
            url: '/travis-ci/travis-assets/builds/3',
            duration: '30 sec',
            finishedAt: 'a day ago'
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
          href: '/travis-ci/travis-core'
        },
        builds: {
          href: '/travis-ci/travis-core/builds'
        },
        build: {
          href: '/travis-ci/travis-core/builds/1',
          active: true
        },
        job: {
          hidden: true
        }
      });
      listsJobs({
        table: '#jobs',
        headers: ['Job', 'Duration', 'Finished', 'Rvm'],
        jobs: [
          {
            color: 'green',
            id: 1,
            number: '1.1',
            repo: 'travis-ci/travis-core',
            finishedAt: '3 minutes ago',
            duration: '30 sec',
            rvm: 'rbx'
          }, {
            color: 'red',
            id: 2,
            number: '1.2',
            repo: 'travis-ci/travis-core',
            finishedAt: '2 minutes ago',
            duration: '40 sec',
            rvm: '1.9.3'
          }
        ]
      });
      return listsJobs({
        table: '#allowed_failure_jobs',
        headers: ['Job', 'Duration', 'Finished', 'Rvm'],
        jobs: [
          {
            color: '',
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

  describe('on the "builds" state', function() {
    beforeEach(function() {
      app('travis-ci/travis-core/builds');
      return waitFor(buildsRendered);
    });
    afterEach(function() {
      return window.history.pushState({}, null, '/spec.html');
    });
    return it('displays the expected stuff', function() {
      listsRepos([
        {
          slug: 'travis-ci/travis-hub',
          build: {
            number: 4,
            url: '/travis-ci/travis-hub/builds/4',
            duration: '1 min',
            finishedAt: '-'
          }
        }, {
          slug: 'travis-ci/travis-core',
          build: {
            number: 1,
            url: '/travis-ci/travis-core/builds/1',
            duration: '30 sec',
            finishedAt: '3 minutes ago'
          }
        }, {
          slug: 'travis-ci/travis-assets',
          build: {
            number: 3,
            url: '/travis-ci/travis-assets/builds/3',
            duration: '30 sec',
            finishedAt: 'a day ago'
          }
        }
      ]);
      displaysRepository({
        href: 'http://github.com/travis-ci/travis-core'
      });
      displaysTabs({
        current: {
          href: '/travis-ci/travis-core'
        },
        builds: {
          href: '/travis-ci/travis-core/builds',
          active: true
        },
        build: {
          hidden: true
        },
        job: {
          hidden: true
        }
      });
      return listsBuilds([
        {
          id: 1,
          slug: 'travis-ci/travis-core',
          number: '1',
          sha: '1234567',
          branch: 'master',
          message: 'commit message 1',
          duration: '30 sec',
          finishedAt: '3 minutes ago',
          color: 'green'
        }, {
          id: 2,
          slug: 'travis-ci/travis-core',
          number: '2',
          sha: '2345678',
          branch: 'feature',
          message: 'commit message 2',
          duration: '-',
          finishedAt: '-',
          color: ''
        }
      ]);
    });
  });

}).call(this);
(function() {

  describe('on the "current" state', function() {
    beforeEach(function() {
      app('travis-ci/travis-core');
      return waitFor(buildRendered);
    });
    afterEach(function() {
      return window.history.pushState({}, null, '/spec.html');
    });
    return it('displays the expected stuff', function() {
      listsRepos([
        {
          slug: 'travis-ci/travis-hub',
          build: {
            number: 4,
            url: '/travis-ci/travis-hub/builds/4',
            duration: '1 min',
            finishedAt: '-'
          }
        }, {
          slug: 'travis-ci/travis-core',
          build: {
            number: 1,
            url: '/travis-ci/travis-core/builds/1',
            duration: '30 sec',
            finishedAt: '3 minutes ago'
          }
        }, {
          slug: 'travis-ci/travis-assets',
          build: {
            number: 3,
            url: '/travis-ci/travis-assets/builds/3',
            duration: '30 sec',
            finishedAt: 'a day ago'
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
          href: '/travis-ci/travis-core',
          active: true
        },
        builds: {
          href: '/travis-ci/travis-core/builds'
        },
        build: {
          hidden: true
        },
        job: {
          hidden: true
        }
      });
      listsJobs({
        table: '#jobs',
        headers: ['Job', 'Duration', 'Finished', 'Rvm'],
        jobs: [
          {
            id: 1,
            color: 'green',
            number: '1.1',
            repo: 'travis-ci/travis-core',
            finishedAt: '3 minutes ago',
            duration: '30 sec',
            rvm: 'rbx'
          }, {
            id: 2,
            color: 'red',
            number: '1.2',
            repo: 'travis-ci/travis-core',
            finishedAt: '2 minutes ago',
            duration: '40 sec',
            rvm: '1.9.3'
          }
        ]
      });
      return listsJobs({
        table: '#allowed_failure_jobs',
        headers: ['Job', 'Duration', 'Finished', 'Rvm'],
        jobs: [
          {
            id: 3,
            color: '',
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

  describe('events', function() {
    afterEach(function() {
      return window.history.pushState({}, null, '/spec.html');
    });
    describe('an event adding a repository', function() {
      beforeEach(function() {
        app('travis-ci/travis-core');
        return waitFor(jobsRendered);
      });
      return it('adds a repository to the list', function() {
        waitFor(reposRendered);
        return runs(function() {
          Em.run(function() {
            return Travis.app.receive('build', {
              repository: {
                id: 10,
                slug: 'travis-ci/travis-support',
                last_build_id: 10,
                last_build_number: 10,
                last_build_started_at: '2012-07-02T00:01:00Z',
                last_build_finished_at: '2012-07-02T00:02:30Z'
              },
              build: {
                id: 10,
                repository_id: 10
              }
            });
          });
          return listsRepo({
            row: 2,
            item: {
              slug: 'travis-ci/travis-support',
              build: {
                number: 4,
                url: '/travis-ci/travis-support/builds/10',
                duration: '1 min 30 sec',
                finishedAt: 'less than a minute ago'
              }
            }
          });
        });
      });
    });
    describe('an event adding a build', function() {
      beforeEach(function() {
        app('travis-ci/travis-core/builds');
        return waitFor(buildsRendered);
      });
      return it('adds a build to the builds list', function() {
        Em.run(function() {
          return Travis.app.receive('build', {
            build: {
              id: 10,
              repository_id: 1,
              commit_id: 10,
              number: '3',
              duration: 55,
              started_at: '2012-07-02T00:02:00Z',
              finished_at: '2012-07-02T00:02:55Z',
              event_type: 'push',
              result: 1
            },
            commit: {
              id: 10,
              sha: '1234567',
              branch: 'master',
              message: 'commit message 3'
            }
          });
        });
        return listsBuild({
          row: 3,
          item: {
            id: 10,
            slug: 'travis-ci/travis-core',
            number: '3',
            sha: '1234567',
            branch: 'master',
            message: 'commit message 3',
            finishedAt: 'less than a minute ago',
            duration: '55 sec',
            color: 'red'
          }
        });
      });
    });
    describe('an event adding a job', function() {
      beforeEach(function() {
        app('travis-ci/travis-core');
        waitFor(jobsRendered);
        return runs(function() {
          return waitFor(queuesRendered);
        });
      });
      it('adds a job to the jobs matrix', function() {
        Em.run(function() {
          return Travis.app.receive('job', {
            job: {
              id: 10,
              repository_id: 1,
              build_id: 1,
              commit_id: 1,
              log_id: 1,
              number: '1.4',
              duration: 55,
              started_at: '2012-07-02T00:02:00Z',
              finished_at: '2012-07-02T00:02:55Z',
              config: {
                rvm: 'jruby'
              }
            }
          });
        });
        return listsJob({
          table: $('#jobs'),
          row: 3,
          item: {
            id: 10,
            number: '1.4',
            repo: 'travis-ci/travis-core',
            finishedAt: 'less than a minute ago',
            duration: '55 sec',
            rvm: 'jruby'
          }
        });
      });
      it('adds a job to the jobs queue', function() {
        Em.run(function() {
          return Travis.app.receive('job', {
            job: {
              id: 10,
              repository_id: 1,
              number: '1.4',
              queue: 'common'
            }
          });
        });
        return listsQueuedJob({
          name: 'common',
          row: 3,
          item: {
            number: '1.4',
            repo: 'travis-ci/travis-core'
          }
        });
      });
      return it('updates only keys that are available', function() {
        Em.run(function() {
          return Travis.app.receive('job', {
            job: {
              id: 1,
              build_id: 1
            }
          });
        });
        return listsJob({
          table: $('#jobs'),
          row: 1,
          item: {
            id: 1,
            number: '1.1',
            repo: 'travis-ci/travis-core',
            finishedAt: '3 minutes ago',
            duration: '30 sec',
            rvm: 'rbx'
          }
        });
      });
    });
    return describe('an event adding a worker', function() {
      beforeEach(function() {
        app('');
        return waitFor(workersRendered);
      });
      return it('adds a worker to the workers list', function() {
        Em.run(function() {
          return Travis.app.receive('worker', {
            worker: {
              host: 'worker.travis-ci.org',
              name: 'ruby-3',
              state: 'ready',
              id: 10
            }
          });
        });
        return listsWorker({
          group: 'worker.travis-ci.org',
          row: 3,
          item: {
            name: 'ruby-3',
            state: 'ready'
          }
        });
      });
    });
  });

}).call(this);
(function() {

  describe('on the "index" state', function() {
    beforeEach(function() {
      app('travis-ci/travis-core');
      return waitFor(buildRendered);
    });
    afterEach(function() {
      return window.history.pushState({}, null, '/spec.html');
    });
    return it('displays the expected stuff', function() {
      listsRepos([
        {
          slug: 'travis-ci/travis-hub',
          build: {
            number: 4,
            url: '/travis-ci/travis-hub/builds/4',
            duration: '1 min',
            finishedAt: '-'
          }
        }, {
          slug: 'travis-ci/travis-core',
          build: {
            number: 1,
            url: '/travis-ci/travis-core/builds/1',
            duration: '30 sec',
            finishedAt: '3 minutes ago'
          }
        }, {
          slug: 'travis-ci/travis-assets',
          build: {
            number: 3,
            url: '/travis-ci/travis-assets/builds/3',
            duration: '30 sec',
            finishedAt: 'a day ago'
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
          href: '/travis-ci/travis-core',
          active: true
        },
        builds: {
          href: '/travis-ci/travis-core/builds'
        },
        build: {
          hidden: true
        },
        job: {
          hidden: true
        }
      });
      listsJobs({
        table: '#jobs',
        headers: ['Job', 'Duration', 'Finished', 'Rvm'],
        jobs: [
          {
            color: 'green',
            id: 1,
            number: '1.1',
            repo: 'travis-ci/travis-core',
            finishedAt: '3 minutes ago',
            duration: '30 sec',
            rvm: 'rbx'
          }, {
            color: 'red',
            id: 2,
            number: '1.2',
            repo: 'travis-ci/travis-core',
            finishedAt: '2 minutes ago',
            duration: '40 sec',
            rvm: '1.9.3'
          }
        ]
      });
      return listsJobs({
        table: '#allowed_failure_jobs',
        headers: ['Job', 'Duration', 'Finished', 'Rvm'],
        jobs: [
          {
            color: '',
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
      app('travis-ci/travis-core/jobs/1');
      waitFor(jobRendered);
      return runs(function() {
        return waitFor(hasText('#tab_build', 'Build #1'));
      });
    });
    afterEach(function() {
      return window.history.pushState({}, null, '/spec.html');
    });
    return it('displays the expected stuff', function() {
      listsRepos([
        {
          slug: 'travis-ci/travis-hub',
          build: {
            number: 4,
            url: '/travis-ci/travis-hub/builds/4',
            duration: '1 min',
            finishedAt: '-'
          }
        }, {
          slug: 'travis-ci/travis-core',
          build: {
            number: 1,
            url: '/travis-ci/travis-core/builds/1',
            duration: '30 sec',
            finishedAt: '3 minutes ago'
          }
        }, {
          slug: 'travis-ci/travis-assets',
          build: {
            number: 3,
            url: '/travis-ci/travis-assets/builds/3',
            duration: '30 sec',
            finishedAt: 'a day ago'
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
          href: '/travis-ci/travis-core'
        },
        builds: {
          href: '/travis-ci/travis-core/builds'
        },
        build: {
          href: '/travis-ci/travis-core/builds/1'
        },
        job: {
          href: '/travis-ci/travis-core/jobs/1',
          active: true
        }
      });
      return displaysLog(['log 1']);
    });
  });

}).call(this);
(function() {

  describe('the sidebar', function() {
    beforeEach(function() {
      app('travis-ci/travis-core/jobs/1');
      waitFor(jobRendered);
      return runs(function() {
        return waitFor(hasText('#tab_build', 'Build #1'));
      });
    });
    afterEach(function() {
      return window.history.pushState({}, null, '/spec.html');
    });
    return it('displays the expected stuff', function() {
      return listsQueues([
        {
          name: 'common',
          item: {
            number: '5.1',
            repo: 'travis-ci/travis-core'
          }
        }, {
          name: 'common',
          item: {
            number: '5.2',
            repo: 'travis-ci/travis-core'
          }
        }
      ]);
    });
  });

}).call(this);
(function() {
  var _Date;

  minispade.require('app');

  this.reset = function() {
    Em.run(function() {
      var views;
      if (Travis.app) {
        if (Travis.app.store) {
          Travis.app.store.destroy();
        }
        if (views = Travis.app.get('_connectedOutletViews')) {
          views.forEach(function(v) {
            return v.destroy();
          });
        }
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

  this.jobRendered = notEmpty('#summary .number');

  this.jobsRendered = notEmpty('#jobs .number');

  this.queuesRendered = notEmpty('#queue_common li');

  this.workersRendered = notEmpty('.worker');

}).call(this);
(function() {

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
    expect(element.attr('href')).toEqual("/" + data.repo + "/" + data.type + "s/" + data.id);
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

  this.displaysLog = function(lines) {
    var ix, log;
    ix = 0;
    log = $.map(lines, function(line) {
      ix += 1;
      return "" + ix + line;
    }).join("\n");
    return expect($('#log').text().trim()).toEqual(log);
  };

  this.listsRepos = function(items) {
    return listsItems('repo', items);
  };

  this.listsRepo = function(data) {
    var repo, row;
    row = $('#repositories li')[data.row - 1];
    repo = data.item;
    expect($('a.current', row).attr('href')).toEqual("/" + repo.slug);
    expect($('a.last_build', row).attr('href')).toEqual(repo.build.url);
    expect($('.duration', row).text()).toEqual(repo.build.duration);
    return expect($('.finished_at', row).text()).toEqual(repo.build.finishedAt);
  };

  this.listsBuilds = function(builds) {
    return listsItems('build', builds);
  };

  this.listsBuild = function(data) {
    var build, row;
    row = $('#builds tbody tr')[data.row - 1];
    build = data.item;
    expect($('.number a', row).attr('href')).toEqual("/" + build.slug + "/builds/" + build.id);
    expect($('.number a', row).text().trim()).toEqual(build.number);
    expect($('.message', row).text().trim()).toEqual(build.message);
    expect($('.duration', row).text().trim()).toEqual(build.duration);
    expect($('.finished_at', row).text().trim()).toEqual(build.finishedAt);
    return expect($(row).attr('class')).toMatch(build.color);
  };

  this.listsJobs = function(data) {
    var element, headers, table;
    table = $(data.table);
    headers = (function() {
      var _i, _len, _ref, _results;
      _ref = $("thead th", table);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        _results.push($(element).text());
      }
      return _results;
    })();
    expect(headers).toEqual(data.headers);
    return $.each(data.jobs, function(row, job) {
      return listsJob({
        table: data.table,
        row: row + 1,
        item: job
      });
    });
  };

  this.listsJob = function(data) {
    var element, job, row;
    row = $('tbody tr', data.table)[data.row - 1];
    job = data.item;
    element = $(row);
    expect(element.attr('class')).toMatch(job.color);
    element = $("td.number", row);
    expect(element.text()).toEqual(job.number);
    element = $("td.number a", row);
    expect(element.attr('href')).toEqual("/" + job.repo + "/jobs/" + job.id);
    element = $("td.duration", row);
    expect(element.text()).toEqual(job.duration);
    element = $("td.finished_at", row);
    expect(element.text()).toEqual(job.finishedAt);
    element = $("td:nth-child(6)", row);
    return expect(element.text()).toEqual(job.rvm);
  };

  this.listsQueuedJobs = function(jobs) {
    return listsItems('queuedJob', jobs);
  };

  this.listsQueuedJob = function(data) {
    var job, text;
    job = data.item;
    text = $($("#queue_" + data.name + " li")[data.row - 1]).text();
    expect(text).toContain(job.repo);
    return expect(text).toContain("#" + job.number);
  };

  this.listsQueue = function(data) {
    var job, name, text;
    name = data.item.name;
    job = data.item.item;
    text = $($("#queue_" + name + " li")[data.row - 1]).text();
    expect(text).toContain(job.repo);
    return expect(text).toContain("#" + job.number);
  };

  this.listsItems = function(type, items) {
    var _this = this;
    return $.each(items, function(row, item) {
      return _this["lists" + ($.camelize(type))]({
        item: item,
        row: row + 1
      });
    });
  };

  this.listsQueues = function(queues) {
    return listsItems('queue', queues);
  };

  this.listsWorker = function(data) {
    var element, group, worker;
    group = $("#workers li:contains('" + data.group + "')");
    element = $($('ul li', group)[data.row - 1]);
    worker = data.item;
    expect(element.text()).toContain(worker.name);
    return expect(element.text()).toContain(worker.state);
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
