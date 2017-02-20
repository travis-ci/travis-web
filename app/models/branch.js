import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';
import { computed } from 'ember-decorators/object';

export default Model.extend({
  name: attr('string'),
  defaultBranch: attr('boolean'),
  lastBuild: belongsTo('build'),
  recentBuilds: attr(),
  existsOnGithub: attr('boolean'),

  builds: hasMany('builds', { inverse: 'branch' }),
  repo: belongsTo('repo', { inverse: 'defaultBranch' }),

  @computed('id')
  repoId(id) {
    const match = id.match(/\/repo\/(\d+)\//);
    if (match) {
      return match[1];
    }
  },
});
