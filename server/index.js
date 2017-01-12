/*jshint node:true*/

// To use it create some files under `mocks/`
// e.g. `server/mocks/ember-hamsters.js`
//
// module.exports = function(app) {
//   app.get('/ember-hamsters', function(req, res) {
//     res.send('hello');
//   });
// };

var bodyParser = require('body-parser');

module.exports = function(app) {
  var globSync   = require('glob').sync;
  var mocks      = globSync('./mocks/**/*.js', { cwd: __dirname }).map(require);
  var proxies    = globSync('./proxies/**/*.js', { cwd: __dirname }).map(require);

  // Log proxy requests
  var morgan  = require('morgan');
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));

  mocks.forEach(function(route) { route(app); });
  proxies.forEach(function(route) { route(app); });

  // this is reimplementation of waiter/lib/travis/web/set_token.rb
  app.use(function(req, res, next) {
    var token = req.body['token'];
    if(req.method == 'POST' && token && token.match(/^[a-zA-Z\-_\d]+$/)) {
      var storage = req.body['storage'];
      if(storage !== 'localStorage') {
        storage = 'sessionStorage';
      }
      var user = JSON.stringify(req.body['user']);

      var responseText = `
        <script>
          var storage = ${storage};
          storage.setItem('travis.token', '${token}');
          storage.setItem('travis.user', ${user});
          storage.setItem('travis.become', true);
          window.location = '${req.path}';
        </script>
      `;

      res.send(responseText);
    } else {
      next();
    }
  });

};
