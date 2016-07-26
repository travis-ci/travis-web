import V2FallbackSerializer from 'travis/serializers/v2_fallback';

var Serializer = V2FallbackSerializer.extend({
  isNewSerializerAPI: true,

  normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
    let { builds } = payload;
    let normalizedResponse =  {
      data: this.serializedRecords(builds),
      included: this.includedRecords(builds),
    };
    console.log('final version', normalizedResponse);
    return normalizedResponse;
  },

  serializedRecords(builds) {
    return builds.map(record => {
      console.log('finished at in serializer', record.finished_at);
      let attributes = {
        duration: record.duration,
        started_at: record.started_at,
        number: record.number,
        branch: record.branch,
        event_type: record.event_type,
        finished_at: record.finished_at,
        state: record.state
      };

      let serialized = {
        type: 'build',
        id: record.id,
        attributes,
        relationships: this.relationshipsFor(record)
      };

      return serialized;
    });
  },

  includedRecords(builds) {
    let included = [];
    builds.map(record => {
      let { commit, branch } = record;
      included.push(this.generateIncludesForCommit(commit));
      included.push(this.generateIncludesForBranch(branch));
    });

    return included;
  },

  relationshipsFor(build) {
    return {
      commit: {
        data: {
          type: 'commit',
          id: build.commit.id
        }
      },
      branch: {
        data: {
          type: 'branch',
          id: build.branch['@href']
        }
      }
    };
  },

  generateIncludesForCommit(commit) {
    let {
      committed_at,
      compare_url,
      id,
      message,
      ref,
      sha
    } = commit;

    return {
      type: 'commit',
      id: commit.id,
      attributes: {
        committed_at,
        compare_url,
        id,
        message,
        ref,
        sha
      }
    };
  },

  generateIncludesForBranch(branch) {
    let { name } = branch;
    let id = branch['@href'];

    return {
      type: 'branch',
      id,
      attributes: {
        name
      }
    };
  }
});

export default Serializer;
