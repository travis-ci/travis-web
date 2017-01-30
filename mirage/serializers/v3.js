import { ActiveModelSerializer } from 'ember-cli-mirage';

export default ActiveModelSerializer.extend({
  embed: true,

  serialize(object) {
    let json = ActiveModelSerializer.prototype.serialize.apply(this, arguments);

    let type = Object.keys(json)[0];

    if (this.isModel(object)) {
      json[type]['@type'] = type;
      json = json[type];
    } else {
      json['@type'] = type;
      json['@pagination'] = {
        count: object.models.length
      };
    }

    return json;
  },
});
