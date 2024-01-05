import Pretender from 'pretender';
import config from 'travis/config/environment';

const { validAuthToken } = config;

const pretender = {
  name: 'pretender',

  initialize: function () {
    const originalHandlerFor = Pretender.prototype._handlerFor;

    Pretender.prototype._handlerFor = function (verb, path, request) {
      const authHeader = request.requestHeaders.Authorization;
      if (authHeader && authHeader !== `token ${validAuthToken}`) {
        // Handle unauthorized case
        return originalHandlerFor.call(this, 'GET', '/unauthorized', request);
      }

      // Proceed with original behavior
      return originalHandlerFor.apply(this, arguments);
    };
  }
}

export default pretender;
