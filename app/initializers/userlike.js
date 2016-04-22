import config from 'travis/config/environment';
var UserlikeInitializer, initialize;

initialize = function(application) {
  var userlikeData;
  return userlikeData = {};
};

UserlikeInitializer = {
  name: 'userlike',
  initialize: initialize
};

export {initialize};

export default UserlikeInitializer;
