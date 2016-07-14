import V2Serializer from './v2';

export default V2Serializer.extend({
  serialize(job/* , request */) {
    const response = {
      job: job.attrs
    };

    if (job.commit) {
      response.commit = job.commit.attrs;
    }

    return response;
  }
});
