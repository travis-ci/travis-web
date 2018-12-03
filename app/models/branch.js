import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';

export default Model.extend({
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
