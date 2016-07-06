import { ActiveModelSerializer } from 'ember-cli-mirage';

export default ActiveModelSerializer.extend({
  embed: true,

  serialize(object, request) {
    let json = ActiveModelSerializer.prototype.serialize.apply(this, arguments);

    if (this.isModel(object)) {
      json = json[this._keyForModelOrCollection(object)];
    } else {
      json['@pagination'] = {
        count: object.models.length
      };
    }

    json['@type'] = this._keyForModelOrCollection(object);

    return json;
  }
});
