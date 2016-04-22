import TravisLocation from 'travis/utils/location';
var Initializer, initialize;

initialize = function(application) {
  return application.register('location:travis', TravisLocation);
};

Initializer = {
  name: 'location',
  initialize: initialize
};

export { initialize };

export default Initializer;
