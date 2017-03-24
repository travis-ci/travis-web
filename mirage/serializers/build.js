import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  serialize(data, request) {
    if (data.models) {
      const response =  {
        '@type': 'builds',
        '@representation': 'standard',
        '@pagination': {
          count: data.models.length,
        },
        builds: data.models.map(model => {
          return this.serializeSingle(model, request);
        })
      };

      return response;
    }
    return this.serializeSingle(data, request);
  },

  serializeSingle(object, request, { embedded = false } = {}) {
    let { id } = object.attrs;

    let representation = embedded ? 'minimal' : 'standard';

    let response = {
      '@type': 'build',
      '@href': `/build/${id}`,
      '@representation': representation,
      id,
    };

    if (this.shouldIncludeRelationship(object, request, 'commit')) {
      const serializer = this.serializerFor('commit-v3');
      response.commit = serializer.serializeSingle(object.commit);
    }

    if (this.shouldIncludeRelationship(object, request, 'branch')) {
      response.branch = this.serializerFor('branch').serialize(object.branch, request);
    }

    // FIXME this should be serialised in the standard fashion
    if (object.stages) {
      response.stages = object.stages.models.map(stage => {
        return {
          '@type': 'stage',
          '@representation': 'minimal',
          id: stage.id,
          number: stage.number,
          name: stage.name
        };
      });
    }

    if (!embedded) {
      if (object.repository) {
        const serializer = this.serializerFor('repository');
        response.repository = serializer.serialize(object.repository, request);
      }

      if (object.jobs.models.length) {
        response.jobs = this.serializerFor('job-v3').serializeMinimal(object.jobs, request);
      }
    }

    let nonMirageAttributes = this.stripForeignKeys(object.attrs);
    response = Object.assign(response, nonMirageAttributes);

    return response;
  },

  serializeEmbedded(object, request) {
    return this.serializeSingle(object, request, { embedded: true });
  },

  stripForeignKeys(obj) {
    Object.keys(obj).forEach(key => {
      if (key.endsWith('Id')) {
        delete obj[key];
      }
    });
    return obj;
  },

  shouldIncludeRelationship(object, request, type) {
    const { include } = request.queryParams;
    return (this.requestingBuildDirectly(request) ||
      type === 'stage' ||
      (include && include.includes(`build.${type}`)))
      && object[type];
  },

  requestingBuildDirectly(request) {
    return request.url.includes('/build');
  },
});
