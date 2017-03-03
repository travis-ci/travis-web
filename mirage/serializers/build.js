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
    delete object.attrs.id;

    let representation = embedded ? 'minimal' : 'standard';

    let response = {
      '@type': 'build',
      '@href': `/build/${id}`,
      '@representation': representation,
      id,
    };

    const { include } = request.queryParams;

    if (include && include.includes('build.commit')) {
      if (object.commit) {
        const serializer = this.serializerFor('commit-v3');
        response.commit = serializer.serializeSingle(object.commit);
      }
    }

    if (!embedded) {
      if (object.repository) {
        const serializer = this.serializerFor('repository');
        response.repository = serializer.serialize(object.repository, request);
      }

      if (object.branch) {
        response.branch = this.serializerFor('branch').serialize(object.branch, request);
      }

      if (object.jobs.models.length) {
        response.jobs = this.serializerFor('job').serializeMinimal(object.jobs, request);
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
});
