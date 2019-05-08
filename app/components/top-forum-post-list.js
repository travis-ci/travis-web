import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import config from 'travis/config/environment';

const { community } = config.urls;
export const NUM_TOPICS = 5;

export default Component.extend({
  tagName: 'ul',

  raven: service(),
  externalLinks: service(),

  numberOfTopics: NUM_TOPICS,

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

  isLoading: reads('fetchTopics.isRunning'),
  topics: reads('fetchTopics.lastSuccessful.value.topic_list.topics'),

  topicsToShow: computed('topics.[]', 'numberOfTopics', function () {
    const { topics = [], numberOfTopics } = this;
    return topics
      .filter((item, index, self) => index < numberOfTopics)
      .map(topic => {
        topic.url = this.externalLinks.communityTopicLink(topic.slug, topic.id);
        return topic;
      });
  }),

  // Request topic data
  didReceiveAttrs() {
    this.fetchTopics.perform();
  }
});
