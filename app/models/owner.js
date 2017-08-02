import DS from 'ember-data';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default DS.Model.extend({
  login: attr('string'),
  name: attr('string'),
  githubId: attr(),
  avatarUrl: attr('string'),
  repositories: hasMany('repo')
});
