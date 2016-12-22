import Ember from 'ember';
import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  serialize(repository) {
    if (repository.models) {
      return this.turnIntoV3('repo', repository.models);
    } else {
      return this.turnIntoV3('repo', repository);
    }
  },

  _turnIntoV3Singular(type, mirageRecord) {
    let record;
    if (mirageRecord.attrs) {
      record = mirageRecord.attrs;
    }
    record['@type'] = type;
    record['@href'] = `/${type}/${mirageRecord.id}`;
    record['@representation'] = 'standard';

    let build = mirageRecord._schema.builds.first();
    if (build) {
      record['current_build'] = build.attrs;
    }

    let defaultBranch = mirageRecord.branches.models.find(branch => branch.default_branch);

    if (defaultBranch && defaultBranch.builds) {
      const lastBuild = defaultBranch.builds.models[defaultBranch.builds.models.length - 1];

      record['default_branch'] = {
        '@type': 'branch',
        '@href': `/repo/${mirageRecord.id}/branch/${defaultBranch.attrs.name}`,
        '@representation': 'standard',
        repository: {
          '@href': `/repo/${mirageRecord.id}`
        },
        name: defaultBranch.attrs.name,
        default_branch: true,
        exists_on_github: true,
        last_build: {
          '@type': 'build',
          '@href': `/build/${lastBuild.id}`,
          '@representation': 'minimal',
          id: lastBuild.id,
          number: lastBuild.number,
          event_type: lastBuild.event_type,
          state: 'passed',
          duration: '394',
          previous_state: 'canceled',
          started_at: '2016-10-04T19:05:56Z',
          finished_at: '2016-10-04T19:12:30Z',
          branch: {
            '@href': `/repo/${mirageRecord.id}/branch/${defaultBranch.attrs.name}`
          }
        }
      };
    }

    return record;
  },

  turnIntoV3(type, payload) {
    let response;
    if (Ember.isArray(payload)) {
      let records = payload.map(record => this._turnIntoV3Singular(type, record));
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
