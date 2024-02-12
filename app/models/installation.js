import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  githubId: attr(),

  owner: belongsTo('owner', {polymorphic: true, async: false, inverse: 'installation', as: 'installation' })
});
