import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';

const Branch = Model.extend({
  name: attr('string'),
  defaultBranch: attr('boolean'),
  lastBuild: belongsTo('build'),
  exists_on_github: attr('boolean'),

  builds: hasMany('builds', { inverse: 'branch' }),
  repo: belongsTo('repo', { inverse: '_branches' }),

  repoId: computed('id', function () {
    let id = this.get('id');
    const match = id.match(/\/repo\/(\d+)\//);
    if (match) {
      return match[1];
    }
  })
});

Branch.reopenClass({
  search(store, name, repositoryId) {
    return store.query('branch', {
      repository_id: repositoryId,
      data: {
        name: name,
        sort_by: 'repository.name',
        limit: 10
      }
    });
  },
});

export default Branch;
