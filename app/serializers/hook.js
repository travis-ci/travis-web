import ApplicationSerializer from 'travis/serializers/application';

export default ApplicationSerializer.extend({
  serialize(snapshot, options) {
    return { hook: this._super(...arguments) };
  }
});
