import V3Serializer from 'travis/serializers/v3';

export default V3Serializer.extend({
  isNewSerializerAPI: true,

  pushPayload(store, payload) {
    console.log('payload is serialized???', payload);
    return this._super(...arguments);
  },

  extractRelationships(modelClass, resourceHash) {
    let build = resourceHash;
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
      },
      job: {
        data: build.jobs.map(job => {
          return {
            data: {
              type: 'job',
              id: job.id
            }
          };
        })
      }
    };
  },

  normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
    let { builds } = payload;
    let normalizedResponse =  {
      data: this.serializedRecords(builds),
      included: this.includedRecords(builds),
    };
    console.log('normalizedResponse', normalizedResponse);
    return normalizedResponse;
  },

  serializedRecords(builds) {
    return builds.map(record => this.serializeRecord(record));
  },

  serializeRecord(record) {
    let attributes = {
      duration: record.duration,
      'startedAt': record.started_at,
      number: record.number,
      'eventType': record.event_type,
      'finishedAt': record.finished_at,
      state: record.state
    };

    let serialized = {
      type: 'build',
      id: record.id,
      attributes,
      relationships: this.relationshipsFor(record)
    };

    return serialized;
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

  includedRecord(build) {
    let included = [];
    let { commit, branch, repository } = build;
    included.push(this.generateIncludesForCommit(commit));
    included.push(this.generateIncludesForBranch(branch));
    included.push(this.generateIncludesForRepository(repository));

    return included;
  },

  normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
    console.log('singleResponse payload', payload);
    let normalizedResponse =  {
      data: this.serializeRecord(payload),
      included: this.includedRecord(payload),
    };
    console.log('normalizedResponse', normalizedResponse);
    return normalizedResponse;
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
    console.log('commit attributes', commit);
    let {
      committed_at,
      compare_url,
      message,
      sha,
      author,
      committer
    } = commit;

    return {
      type: 'commit',
      id: commit.id,
      attributes: {
        'committed-at': committed_at,
        'compare-url': compare_url,
        author,
        committer,
        message,
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
