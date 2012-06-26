(function() {

  describe('Foo', function() {
    beforeEach(function() {
      createApp();
      return waitFor(repositoriesRendered);
    });
    it('bar', function() {
      var href;
      href = $('#repositories a.slug').attr('href');
      return expect(href).toEqual('#/travis-ci/travis-core');
    });
    return it('bar', function() {
      var href;
      href = $('#repositories a.slug').attr('href');
      return expect(href).toEqual('#/travis-ci/travis-core');
    });
  });

}).call(this);
(function() {

  minispade.require('app');

  this.after = function(time, func) {
    waits(time);
    return jasmine.getEnv().currentSpec.runs(func);
  };

  this.once = function(condition, func) {
    waitsFor(condition);
    return jasmine.getEnv().currentSpec.runs(func);
  };

  this.reset = function() {
    if (Travis.app) {
      Travis.app.destroy();
    }
    return $('body #content').empty();
  };

  this.createApp = function() {
    Travis.app = Travis.App.create();
    Travis.app.set('rootElement', '#content');
    return Travis.app.initialize();
  };

  this.waitFor = waitsFor;

  this.repositoriesRendered = function() {
    return $('#repositories li').length > 0;
  };

  beforeEach(function() {
    return reset();
  });

}).call(this);
