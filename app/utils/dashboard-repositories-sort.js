import Ember from 'ember';

export default (a, b) => {
  if (Ember.isBlank(a.get('currentBuild.state'))) {
    return 1;
  }
  if (Ember.isBlank(b.get('currentBuild.state'))) {
    return -1;
  }
  if (Ember.isBlank(a.get('currentBuild.finishedAt'))) {
    return -1;
  }
  if (Ember.isBlank(b.get('currentBuild.finishedAt'))) {
    return 1;
  }
  if (a.get('currentBuild.finishedAt') < b.get('currentBuild.finishedAt')) {
    return 1;
  }
  if (a.get('currentBuild.finishedAt') > b.get('currentBuild.finishedAt')) {
    return -1;
  }
  if (a.get('currentBuild.finishedAt') === b.get('currentBuild.finishedAt')) {
    return 0;
  }
  if (Ember.isBlank(a.get('defaultBranch.lastBuild.state'))) {
    return 1;
  }
  if (Ember.isBlank(b.get('defaultBranch.lastBuild.state'))) {
    return -1;
  }
};
