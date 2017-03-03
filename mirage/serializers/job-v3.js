import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  serialize(data, request) {
    if (data.models) {
      const response =  {
        '@type': 'jobs',
        '@representation': 'standard',
        '@pagination': {
          count: data.models.length,
        },
        jobs: data.models.map(model => {
          return this.serializeSingle(model, request);
        })
      };

      return response;
    }
    return this.serializeSingle(data, request);
  },

  serializeMinimal(jobs) {
    return jobs.models.map(job => this.serializeSingle(job));
  },

  serializeSingle(job) {
    return {
      '@type': 'job',
      '@href': `/job/${job.id}`,
      '@representation': 'minimal',
      id: job.id,
    };
  }
});
