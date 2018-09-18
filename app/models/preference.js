import Model from 'ember-data/model';
import { attr } from 'ember-decorators/data';

export default Model.extend({
  @attr('string') name: '',
  @attr() value: ''
});
