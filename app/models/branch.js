import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  defaultBranch: attr('boolean'),
  lastBuild: belongsTo('build'),
  existsOnGithub: attr('boolean'),

  builds: hasMany('builds', { inverse: 'branch' }),
  repo: belongsTo('repo', { inverse: 'defaultBranch' }),

  repoId: Ember.computed('id', function () {
    const match = this.get('id').match(/\/repo\/(\d+)\//);
    if (match) {
      return match[1];
    }
  })
});
