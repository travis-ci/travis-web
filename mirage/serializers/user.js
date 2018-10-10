import V2Serializer from './v2';

export default V2Serializer.extend({
  serialize(record) {
    const json = V2Serializer.prototype.serialize.apply(this, arguments);
    if (record.installation) {
      const { github_id, ownerId: owner_id, id } = record.installation; // eslint-disable-line
      json.user.installation = { id, github_id, owner_id };
    }
    return json;
  }
});
