(function() {

  require('app');

  $('body').append($('<div id="spec_content"></div>'));

  Travis.rootElement = '#spec_content';

  Travis.initialize();

  beforeEach(function() {});

  afterEach(function() {});

}).call(this);
