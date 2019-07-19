import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  name: attr('string'),
  defaultBranch: attr('boolean'),
  lastBuild: belongsTo('build'),
  exists_on_github: attr('boolean'),

  builds: hasMany('builds', { inverse: 'branch' }),
  repo: belongsTo('repo', { inverse: '_branches' }),

  repoId: computed('id', function () {
    let id = this.id;
    const match = id.match(/\/repo\/(\d+)\//);
    if (match) {
      return match[1];
    }
  })
});
