import Ember from 'ember';

export default function generatePusherPayload(model, overrides = {}) {
  let result = {};

  Object.keys(model.attrs).forEach((key) => {
    result[Ember.String.underscore(key)] = model.attrs[key];
  });

  if (model.jobIds) {
    result.job_ids = model.jobIds;
  }

  if (model.modelName === 'repository' && model.defaultBranch) {
    result.default_branch = {
      last_build_id: model.defaultBranch.lastBuildId
    };
  }

  return Object.assign(result, overrides);
}
