import Ember from 'ember';
import V2Serializer from './v2';

export default V2Serializer.extend({
  serialize(job/* , request */) {
    const response = {
      job: this.normalizeAttrs(job.attrs)
    };

    if (job.commit) {
      response.commit = this.normalizeAttrs(job.commit.attrs);
    }

    return response;
  },

  normalizeAttrs(attrs) {
    let newAttrs = {};

    Object.keys(attrs).forEach((key) => {
      newAttrs[Ember.String.underscore(key)] = attrs[key];
    });

    return newAttrs;
  }
});
