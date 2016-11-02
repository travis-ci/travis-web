import Ember from 'ember';

// Created branches are sorted first, then by finished_at.
function sortBranchesByCreatedOrFinished(branches) {
  const sortedByFinishedAt = branches.sortBy('last_build.finished_at').reverse();

  const createdAndNot = sortedByFinishedAt.reduce((createdAndNot, branch) => {
    if (Ember.get(branch, 'last_build.state') === 'created') {
      createdAndNot.created.push(branch);
    } else {
      createdAndNot.notCreated.push(branch);
    }

    return createdAndNot;
  }, { created: [], notCreated: [] });

  return createdAndNot.created.concat(createdAndNot.notCreated);
}

export default sortBranchesByCreatedOrFinished;
