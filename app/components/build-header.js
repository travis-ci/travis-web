import Ember from 'ember';
import { gravatarImage } from 'travis/utils/urls';
import GithubUrlProperties from 'travis/mixins/github-url-properties';
import { durationFrom, safe } from 'travis/utils/helpers';
import { githubCommit } from 'travis/utils/urls';

export default Ember.Component.extend({
  tagName: 'section',
  classNames: ['build-header'],
  classNameBindings: ['item.state'],

  isJob: function() {
    if (this.get('item.build')) {
      return true;
    } else {
      return false;
    }
  }.property('item'),

  urlGithubCommit: function() {
    return githubCommit(this.get('repo.slug'), this.get('commit.sha'));
  }.property('item'),

  elapsedTime: function() {
    return durationFrom(this.get('item.startedAt'), this.get('item.finishedAt'));
  }.property('item.startedAt', 'item.finishedAt', 'item.duration')
});
