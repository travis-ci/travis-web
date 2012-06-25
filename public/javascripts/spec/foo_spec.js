(function() {

  console.log('foo');

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
