(function() {



}).call(this);
(function() {



}).call(this);
(function() {



}).call(this);
(function() {

  describe('events', function() {
    return describe('an event adding a worker', function() {
      beforeEach(function() {
        app('');
        return waitFor(workersRendered);
      });
      return it('adds a worker to the workers list', function() {
        Em.run(function() {
          return Travis.app.receive('worker:added', {
            worker: {
              id: 10
            }
          });
        });
        return listsWorker({
          group: 'workers.travis-ci.org',
          row: 3,
          item: {
            'ruby-3': 'ruby-3'
          }
        });
      });
    });
  });

}).call(this);
(function() {



}).call(this);
(function() {



}).call(this);
(function() {



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
    expect($('a.current', row).attr('href')).toEqual("#!/" + repo.slug);
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
    expect($('.number a', row).attr('href')).toEqual("#!/" + build.slug + "/builds/" + build.id);
    expect($('.number a', row).text()).toEqual(build.number);
    expect($('.message', row).text()).toEqual(build.message);
    expect($('.duration', row).text()).toEqual(build.duration);
    expect($('.finished_at', row).text()).toEqual(build.finishedAt);
    return expect($(row).attr('class')).toEqual(build.color);
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
    expect(element.attr('class')).toEqual(job.color);
    element = $("td.number", row);
    expect(element.text()).toEqual(job.number);
    element = $("td.number a", row);
    expect(element.attr('href')).toEqual("#!/" + job.repo + "/jobs/" + job.id);
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
    console.log(data);
    job = data.item;
    text = $($("#queue_" + data.name + " li")[data.row - 1]).text();
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
