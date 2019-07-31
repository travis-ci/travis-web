import Model, { attr } from '@ember-data/model';

export default Model.extend({
  vcsId: attr('number'),
  vcsType: attr('string'),
});
