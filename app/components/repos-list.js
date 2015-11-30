import Ember from 'ember';

var sortCallback = function(repo1, repo2) {
  // this function could be made simpler, but I think it's clearer this way
  // what're we really trying to achieve

  var lastBuild1 = repo1.get('defaultBranch.lastBuild');
  var lastBuild2 = repo2.get('defaultBranch.lastBuild');

  if(!lastBuild1 && !lastBuild2) {
    // if both repos lack builds, put newer repo first
    return repo1.get('id') > repo2.get('id') ? -1 : 1;
  } else if(lastBuild1 && !lastBuild2) {
    // if only repo1 has a build, it goes first
    return -1;
  } else if(lastBuild2 && !lastBuild1) {
    // if only repo2 has a build, it goes first
    return 1;
  }

  var finishedAt1 = lastBuild1.get('finishedAt');
  var finishedAt2 = lastBuild2.get('finishedAt');

  if(finishedAt1) {
    finishedAt1 = new Date(finishedAt1);
  }
  if(finishedAt2) {
    finishedAt2 = new Date(finishedAt2);
  }

  if(finishedAt1 && finishedAt2) {
    // if both builds finished, put newer first
    return finishedAt1.getTime() > finishedAt2.getTime() ? -1 : 1;
  } else if(finishedAt1 && !finishedAt2) {
    // if repo1 finished, but repo2 didn't, put repo2 first
    return 1;
  } else if(finishedAt2 && !finishedAt1) {
    // if repo2 finisher, but repo1 didn't, put repo1 first
    return -1;
  } else {
    // none of the builds finished, put newer build first
    return lastBuild1.get('id') > lastBuild2.get('id') ? -1 : 1;
  }

  throw "should not happen";
};

var ReposListComponent = Ember.Component.extend({
  tagName: 'ul',

  sortedRepos: function() {
    var repos = this.get('repos');

    if(repos && repos.toArray) {
      repos = repos.toArray();
    }

    if(repos && repos.sort) {
      return repos.sort(sortCallback);
    } else {
      return [];
    }
  }.property('repos.[]', 'repos.@each.lastBuildFinishedAt',
             'repos.@each.lastBuildId')
});

export default ReposListComponent;
