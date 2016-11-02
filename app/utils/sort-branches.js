import Ember from 'ember';

// Branches with no finished_at are first, then by finished_at.
function sortBranchesByFinished(branches) {
  const unfinishedBranches = branches.filter(branch => Ember.isNone(Ember.get(branch, 'last_build.finished_at')));
  const sortedFinishedBranches = branches.filterBy('last_build.finished_at').sortBy('last_build.finished_at').reverse();

  return unfinishedBranches.concat(sortedFinishedBranches);
}

export default sortBranchesByFinished;
