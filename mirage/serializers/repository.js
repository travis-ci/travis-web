import Ember from 'ember';
import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  serialize(repository, request) {
    if (repository.models) {
      return this.turnIntoV3('repo', repository.models, request);
    } else {
      return this.turnIntoV3('repo', repository, request);
    }
  },

  _turnIntoV3Singular(type, mirageRecord, request) {
    let record;
    if (mirageRecord.attrs) {
      record = mirageRecord.attrs;
    }
    record['@type'] = type;
    record['@href'] = `/${type}/${mirageRecord.id}`;

    let build = mirageRecord._schema.builds.first();
    if (build) {
      record['current_build'] = build.attrs;
    }

    let defaultBranch = mirageRecord._schema.branches.models.find(branch => branch.default_branch);
    if (defaultBranch && defaultBranch.builds) {
      // FIXME this is copied from the branch serialiser
      const lastBuild = defaultBranch.builds.models[defaultBranch.builds.models.length - 1];
      record['default_branch'] = {
        last_build: this.serializerFor('build').serialize(lastBuild, request)
      };
    }

    return record;
  },

  turnIntoV3(type, payload, request) {
    let response;
    if (Ember.isArray(payload)) {
      let records = payload.map(record => this._turnIntoV3Singular(type, record, request));
      let pluralized = Ember.String.pluralize(type);
      response = {};
      response['@type'] = pluralized;
      response['@href'] = `/${pluralized}`;
      response[pluralized] = records;
    } else {
      response = this._turnIntoV3Singular(type, payload, request);
    }
    return response;
  }
});
