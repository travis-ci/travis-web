import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';

export default Component.extend({
  tagName: 'li',
  classNames: ['rows', 'my-build'],
  classNameBindings: ['state'],

  @service externalLinks: null,

  @alias('build.state') state: null,

  @computed('build.repo.slug', 'build.commit.sha')
  urlGithubCommit(slug, sha) {
    return this.get('externalLinks').githubCommit(slug, sha);
  },
});
