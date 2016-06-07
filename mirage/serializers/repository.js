import Ember from 'ember';
import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  serialize(repository, request) {
    return this.turnIntoV3('repository', repository.models);
  },

  _turnIntoV3Singular(type, record) {
    if(record.attrs) {
      record = record.attrs;
    }
    record['@type'] = type;
    record['@href'] = `/${type}/${record.id}`;

    if (record && record._schema && record._schema.builds) {
      let build = record._schema.builds.first();
      if (build) {
        record['currentBuild'] = build;
      }
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
