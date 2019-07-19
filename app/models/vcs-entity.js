import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  vcsId: attr('number'),
  vcsType: attr('string'),
});
