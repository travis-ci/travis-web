import ApplicationSerializer from "travis/src/data/models/application/serializer";

export default ApplicationSerializer.extend({
  serialize(/* snapshot, options*/) {
    return { hook: this._super(...arguments) };
  }
});
