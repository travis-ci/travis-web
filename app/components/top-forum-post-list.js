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

    try {
      const response = yield fetch(url);
      if (!response.ok)
        throw new Error('Error retrieving top community topics');
      return yield response.json();
    } catch (error) {
      this.raven.logException(error, true);
    }
  }).drop(),

  isLoading: reads('fetchTopics.isRunning'),
  topics: reads('fetchTopics.lastSuccessful.value.topic_list.topics'),

  topicsToShow: computed('topics.[]', 'numberOfTopics', function () {
    const { topics = [], numberOfTopics } = this;
    return topics
      .slice(0, numberOfTopics)
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
