import Ember from 'ember';
import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  serialize(repository/*, request */) {
    if (repository.models) {
      return this.turnIntoV3('repo', repository.models);
    } else {
      return this.turnIntoV3('repo', repository);
    }
  },

  _turnIntoV3Singular(type, mirageRecord) {
    let record;
    if(mirageRecord.attrs) {
      record = mirageRecord.attrs;
    }
    record['@type'] = type;
    record['@href'] = `/${type}/${mirageRecord.id}`;

    let build = mirageRecord._schema.builds.first();
    if (build) {
      record['current_build'] = build.attrs;
    }

    return record;
  },

  turnIntoV3(type, payload) {
    let response;
    if(Ember.isArray(payload)) {
      let records = payload.map( (record) => { return this._turnIntoV3Singular(type, record); } );
      let pluralized = Ember.String.pluralize(type);
      response = {};
      response['@type'] = pluralized;
      response['@href'] = `/${pluralized}`;
      response[pluralized] = records;
    } else {
      response = this._turnIntoV3Singular(type, payload);
    }
    return response;
  }
});
