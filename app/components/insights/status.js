import Component from '@ember/component';
import config from 'travis/config/environment';

export default Component.extend({
  urls: config.insightsStatusUrls
});
