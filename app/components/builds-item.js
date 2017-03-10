import Ember from 'ember';
import computed from 'ember-computed-decorators';

const { service } = Ember.inject;

export default Ember.Component.extend({
  externalLinks: service(),

  tagName: 'li',
  classNameBindings: ['build.state'],
  classNames: ['row-li', 'pr-row'],

  @computed('build.eventType')
  isCron(eventType) {
    return eventType == 'cron';
  },

  @computed('build.repo.slug', 'build.commit.sha')
  urlGithubCommit(slug, sha) {
    return this.get('externalLinks').githubCommit(slug, sha);
  }
});
