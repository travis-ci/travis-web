import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  externalLinks: service(),

  tagName: 'li',
  classNameBindings: ['build.state'],
  classNames: ['row-li', 'pr-row'],

  urlGithubCommit: Ember.computed('build.repo.slug', 'build.commit.sha', function () {
    const slug = this.get('build.repo.slug');
    const sha = this.get('build.commit.sha');
    return this.get('externalLinks').githubCommit(slug, sha);
  })
});
