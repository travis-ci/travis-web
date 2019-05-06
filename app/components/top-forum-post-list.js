import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import config from 'travis/config/environment';

const { community } = config.urls;

export default Component.extend({
  // tagName: 'ul',

  ajax: service(),
  raven: service(),

  fetchTopics: task(function* () {
    const url = `${community}/top.json`;

    return yield fetch(url).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        let exception = new Error('Error retrieving top community topics');
        this.get('raven').logException(exception, true);
      }
    });
  }).drop(),

  // Request topic data
  didReceiveAttrs() {
    this.fetchTopics.perform();
  }
});
