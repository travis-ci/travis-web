import Serializer from 'ember-cli-mirage/serializer';

import V2Serializer from './v2';
import V3Serializer from './v3';

export default Serializer.extend({
  serialize(response, request) {
    if (this._requestIsForV3(request)) {
      return this.serializerFor('v3').serialize(response, request);
    } else {
      return this.serializerFor('v2').serialize(response, request);
    }
  },

  _requestIsForV3(request) {
    if (!request) {
      return false;
    }

    return this._requestHasV3Header(request) || this._requestHasV3Path(request);
  },

  _requestHasV3Header(request) {
    return request.requestHeaders && request.requestHeaders['Travis-API-Version'] === '3';
  },

  _requestHasV3Path(request) {
    return request.url && request.url.indexOf('/v3') === 0;
  }
});
