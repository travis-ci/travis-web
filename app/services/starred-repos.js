import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

let StarredReposWrapper = Ember.ArrayProxy.extend({
  init() {
    this.set('content', this.get('store').peekAll('repo'));
    return this._super(...arguments);
  },

  @computed('content.@each.starred')
  arrangedContent(repos) {
    return repos.filter(repo => repo.get('starred'));
  }
});

export default Ember.Service.extend({
  @service store: null,

  fetch() {
    let starredRepos = this.get('starredRepos');
    if (starredRepos) {
      return starredRepos;
    } else {
      return this.get('store').query('repo', {
        active: true,
        sort_by: 'current_build:desc',
        starred: true
      }).then(() => {
        starredRepos = StarredReposWrapper.create({ store: this.get('store') });
        this.set('starredRepos', starredRepos);
        return starredRepos;
      });
    }
  }
});
