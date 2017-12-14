import { isBlank } from '@ember/utils';

export default (a, b) => {
  if (isBlank(a.get('currentBuild.state'))) {
    return 1;
  }
  if (isBlank(b.get('currentBuild.state'))) {
    return -1;
  }
  if (isBlank(a.get('currentBuild.finishedAt'))) {
    return -1;
  }
  if (isBlank(b.get('currentBuild.finishedAt'))) {
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
  if (isBlank(a.get('defaultBranch.lastBuild.state'))) {
    return 1;
  }
  if (isBlank(b.get('defaultBranch.lastBuild.state'))) {
    return -1;
  }
};
