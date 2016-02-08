import Ember from 'ember';
import config from 'travis/config/environment';
import Ajax from 'travis/services/ajax';

jQuery.support.cors = true;

export default Ajax.extend({
  default_options: {
    accepts: {
      json: 'application/json'
    }
  },

  getEndpoint() {
    return config.apiEndpoint + '/v3';
  }
});
