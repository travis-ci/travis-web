(function() {

  describe('Foo', function() {
    it('bar', function() {
      var link;
      link = $($('#repositories a.slug')[0]);
      return console.log($('body').html());
    });
    return it('bar', function() {
      var link;
      return link = $($('#repositories a.slug')[0]);
    });
  });

}).call(this);
(function() {

  minispade.require('app');

  beforeEach(function() {
    $('body #content').empty();
    return Em.run(function() {
      Travis.app = Travis.App.create();
      Travis.app.set('rootElement', '#content');
      return Travis.app.initialize();
    });
  });

  afterEach(function() {
    return Travis.app.destroy();
  });

}).call(this);
