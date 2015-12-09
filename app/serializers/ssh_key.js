import ApplicationSerializer from 'travis/serializers/application';

export default ApplicationSerializer.extend({
  serialize(snapshot, options) {
    return { ssh_key: this._super(...arguments) };
  }
});
