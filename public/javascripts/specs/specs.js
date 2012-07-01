(function() {

  xdescribe('The current build tab', function() {
    describe('on the "index" state', function() {
      beforeEach(function() {
        app('');
        return waitFor(buildRendered);
      });
      it('displays the build summary', function() {
        return displaysBuildSummary({
          id: 1,
          repo: 'travis-ci/travis-core',
          commit: '1234567',
          branch: 'master',
          compare: '0123456..1234567',
          duration: '35 sec',
          message: 'commit message 1'
        });
      });
      return describe('given the current build has a job matrix', function() {
        return it('displays the build matrix table', function() {
          return displaysBuildMatrix({
            headers: ['Job', 'Duration', 'Finished', 'Rvm'],
            jobs: [
              {
                id: 1,
                number: '#1.1',
                repo: 'travis-ci/travis-core',
                finishedAt: /\d+ (\w+) ago/,
                duration: '35 sec',
                rvm: 'rbx'
              }, {
                id: 2,
                number: '#1.2',
                repo: 'travis-ci/travis-core',
                finishedAt: '-',
                duration: '-',
                rvm: '1.9.3'
              }
            ]
          });
        });
      });
    });
    return describe('on the "current" state', function() {
      beforeEach(function() {
        app('!/travis-ci/travis-core');
        waitFor(repositoriesRendered);
        return waitFor(buildRendered);
      });
      it('displays the build summary', function() {
        return displaysBuildSummary({
          id: 1,
          repo: 'travis-ci/travis-core',
          commit: '1234567',
          branch: 'master',
          compare: '0123456..1234567',
          duration: '35 sec',
          message: 'commit message 1'
        });
      });
      return describe('given the current build has a job matrix', function() {
        return it('displays the build matrix table', function() {
          return displaysBuildMatrix({
            headers: ['Job', 'Duration', 'Finished', 'Rvm'],
            jobs: [
              {
                id: 1,
                number: '#1.1',
                repo: 'travis-ci/travis-core',
                finishedAt: /\d+ (\w+) ago/,
                duration: '35 sec',
                rvm: 'rbx'
              }, {
                id: 2,
                number: '#1.2',
                repo: 'travis-ci/travis-core',
                finishedAt: '-',
                duration: '-',
                rvm: '1.9.3'
              }
            ]
          });
        });
      });
    });
  });

}).call(this);
(function() {

  xdescribe('The repositories list', function() {
    beforeEach(function() {
      app('');
      return waitFor(repositoriesRendered);
    });
    it('lists repositories', function() {
      var href;
      href = $('#repositories a.current').attr('href');
      return expect(href).toEqual('#!/travis-ci/travis-core');
    });
    return xit("links to the repository's last build action", function() {
      var href;
      href = $('#repositories a.last_build').attr('href');
      return expect(href).toEqual('#!/travis-ci/travis-core/builds/1');
    });
  });

}).call(this);
(function() {

  xdescribe('The repository view', function() {
    beforeEach(function() {
      app('');
      return waitFor(repositoriesRendered);
    });
    return it('displays the repository header', function() {
      var href;
      href = $('#repository h3 a').attr('href');
      return expect(href).toEqual('http://github.com/travis-ci/travis-core');
    });
  });

}).call(this);
(function() {

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

  this.displaysBuildSummary = function(data) {
    var element;
    element = $('#build .summary .number a');
    expect(element.attr('href')).toEqual("#!/" + data.repo + "/builds/" + data.id);
    element = $('#build .summary .finished_at');
    expect(element.text()).toMatch(/\d+ (\w+) ago/);
    element = $('#build .summary .duration');
    expect(element.text()).toEqual(data.duration);
    element = $('#build .summary .commit a');
    expect(element.attr('href')).toEqual("http://github.com/" + data.repo + "/commit/" + data.commit);
    element = $('#build .summary .commit a');
    expect(element.text()).toEqual("" + data.commit + " (" + data.branch + ")");
    element = $('#build .summary .compare a');
    expect(element.attr('href')).toEqual("http://github.com/compare/" + data.compare);
    element = $('#build .summary .compare a');
    expect(element.text()).toEqual(data.compare);
    element = $('#build .summary .message');
    return expect(element.text()).toEqual(data.message);
  };

  this.displaysBuildMatrix = function(data) {
    var element, headers;
    headers = (function() {
      var _i, _len, _ref, _results;
      _ref = $('#jobs thead th');
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
      element = $("#jobs tr:nth-child(" + ix + ") td.number");
      expect(element.text()).toEqual(job.number);
      element = $("#jobs tr:nth-child(" + ix + ") td.number a");
      expect(element.attr('href')).toEqual("#!/" + job.repo + "/jobs/" + job.id);
      element = $("#jobs tr:nth-child(" + ix + ") td.duration");
      expect(element.text()).toEqual(job.duration);
      element = $("#jobs tr:nth-child(" + ix + ") td.finished_at");
      if (job.finishedAt === '-') {
        expect(element.text()).toEqual('-');
      } else {
        expect(element.text()).toMatch(job.finishedAt);
      }
      element = $("#jobs tr:nth-child(" + ix + ") td:nth-child(6)");
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
(function() {

  xdescribe('The tabs view', function() {
    describe('on the "index" state', function() {
      beforeEach(function() {
        app('');
        return waitFor(repositoriesRendered);
      });
      it('has a "current" tab linking to the current build', function() {
        var href;
        href = $('#tab_current a').attr('href');
        return expect(href).toEqual('#!/travis-ci/travis-core');
      });
      return it('has a "history" tab linking to the builds list', function() {
        var href;
        href = $('#tab_builds a').attr('href');
        return expect(href).toEqual('#!/travis-ci/travis-core/builds');
      });
    });
    return describe('on the "current" state', function() {
      beforeEach(function() {
        app('!/travis-ci/travis-core');
        waitFor(repositoriesRendered);
        return waitFor(buildRendered);
      });
      return it('has a "current" tab linking to the current build', function() {
        var href;
        href = $('#tab_current a').attr('href');
        return expect(href).toEqual('#!/travis-ci/travis-core');
      });
    });
  });

}).call(this);
