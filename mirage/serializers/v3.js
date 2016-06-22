import { ActiveModelSerializer } from 'ember-cli-mirage';

export default ActiveModelSerializer.extend({
  serialize(object, request) {
    // TODO is there any way to avoid this nightmare?

    ActiveModelSerializer.prototype.embed = true;

    if (this.isModel(object)) {
      ActiveModelSerializer.prototype.root = false;
    } else {
      ActiveModelSerializer.prototype.root = true;
    }

    const json = ActiveModelSerializer.prototype.serialize.apply(this, arguments);
    json['@type'] = this._keyForModelOrCollection(object);

    ActiveModelSerializer.prototype.embed = false;

    return json;
  }
});
