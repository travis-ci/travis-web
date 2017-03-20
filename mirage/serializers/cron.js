import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  serialize(data, request) {
    if (data.models) {
      const response =  {
        '@type': 'crons',
        '@representation': 'standard',
        '@href': `/repo/${request.params.repositoryId}/crons`,
        crons: data.models.map(model => {
          return this.serializeSingle(model, request);
        })
      };
      return response;
    }
    return this.serializeSingle(data, request);
  },

  serializeSingle(object, request) {
    let response = {
      '@type': 'cron',
      '@href': `/cron/${object.id}`,
      '@representation': 'standard',
      id: object.id,
      interval: object.interval,
      next_run: object.next_run,
      last_run: object.last_run,
      dont_run_if_recent_build_exists: object.dont_run_if_recent_build_exists,
    };

    if (object.repository) {
      const serializer = this.serializerFor('repository');
      response.repository = serializer.serialize(object.repository, request);
    }

    if (object.branch) {
      response.branch = this.serializerFor('branch').serialize(object.branch, request);
    }

    return response;
  },
});
