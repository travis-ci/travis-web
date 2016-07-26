import V3Serializer from 'travis/serializers/v3';

export default V3Serializer.extend({
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
      let attributes = {
        duration: record.duration,
        'started-at': record.started_at,
        number: record.number,
        'event-type': record.event_type,
        'finished-at': record.finished_at,
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
      let { commit, branch, repository } = record;
      included.push(this.generateIncludesForCommit(commit));
      included.push(this.generateIncludesForBranch(branch));
      included.push(this.generateIncludesForRepository(repository));
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
      },
      repo: {
        data: {
          type: 'repo',
          id: build.repository.id
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

  generateIncludesForRepository(repository) {
    let { name, slug } = repository;

    return {
      type: 'repo',
      id: repository.id,
      attributes: {
        name,
        slug
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
  },
});
