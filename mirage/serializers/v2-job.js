import Ember from 'ember';
import V2Serializer from './v2';

export default V2Serializer.extend({
  serialize(job/* , request */) {
    if (job.models) {
      const response = {
        jobs: job.models.map((j) => this.normalizeAttrs(j.attrs)),
        commits: job.models.map((j) => this.normalizeAttrs(j.commit.attrs))
      };

      return response;
    } else {
      const response = {
        job: this.normalizeAttrs(job.attrs)
      };

      if (job.commit) {
        response.commit = this.normalizeAttrs(job.commit.attrs);
      }

      return response;
    }
  },

  normalizeAttrs(attrs) {
    let newAttrs = {};

    Object.keys(attrs).forEach((key) => {
      newAttrs[Ember.String.underscore(key)] = attrs[key];
    });

    return newAttrs;
  }
});
