(function() {

  describe('Foo', function() {
    it('bar', function() {
      var link;
      console.log('before spec');
      link = $($('#repositories a.slug')[0]);
      console.log($('body').html().toString());
      return console.log('after spec');
    });
    return it('bar', function() {
      var link;
      console.log('before spec');
      link = $($('#repositories a.slug')[0]);
      return console.log('after spec');
    });
  });

}).call(this);
(function() {

  minispade.require('app');

  $('body').append($('<div id="spec_content"></div>'));

  Travis.rootElement = '#spec_content';

}).call(this);
