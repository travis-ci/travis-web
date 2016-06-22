import { ActiveModelSerializer } from 'ember-cli-mirage';

export default ActiveModelSerializer.extend({
  serialize(object, request) {
    const json = ActiveModelSerializer.prototype.serialize.apply(this, arguments);
    json['@type'] = this._keyForModelOrCollection(object);

    return json;
  }
});
