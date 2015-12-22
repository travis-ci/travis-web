import Ember from 'ember';
import ApplicationSerializer from 'travis/serializers/application';

export default ApplicationSerializer.extend({
  primaryKey: 'login'
});
