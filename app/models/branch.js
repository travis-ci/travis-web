import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  name: attr('string'),
  defaultBranch: attr('boolean'),
  lastBuild: belongsTo('build', { async: true, inverse: null }),
  exists_on_github: attr('boolean'),

  builds: hasMany('builds', { async: true, inverse: 'branch' }),
  repo: belongsTo('repo', { async: true, inverse: '_branches' }),

  repoId: computed('id', function () {
    let id = this.id;
    const match = id.match(/\/repo\/(\d+)\//);
    if (match) {
      return match[1];
    }
  })
});
