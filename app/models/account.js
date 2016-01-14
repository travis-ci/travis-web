import Ember from 'ember';
import attr from 'ember-data/attr';
import Model from 'travis/models/model';

export default Model.extend({
  name: attr(),
  type: attr(),
  avatarUrl: attr(),
  reposCount: attr('number'),
  subscribed: attr('boolean'),
  education: attr('boolean'),
  loginBinding: 'id'
});
