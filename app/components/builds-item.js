import Ember from 'ember';
import { computed } from 'ember-decorators/object';

const { service } = Ember.inject;

export default Ember.Component.extend({
  externalLinks: service(),

  tagName: 'li',
  classNameBindings: ['build.state'],
  classNames: ['row-li', 'pr-row'],

  @computed('build.repo.slug', 'build.commit.sha')
  urlGithubCommit(slug, sha) {
    return this.get('externalLinks').githubCommit(slug, sha);
  }
});
