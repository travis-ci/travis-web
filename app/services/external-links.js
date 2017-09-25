import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Service.extend({
  githubPullRequest(slug, pullRequestNumber) {
    return `${config.sourceEndpoint}/${slug}/pull/${pullRequestNumber}`;
  },

  githubCommit(slug, sha) {
    return `${config.sourceEndpoint}/${slug}/commit/${sha}`;
  },

  githubRepo(slug) {
    return `${config.sourceEndpoint}/${slug}`;
  },

  email(email) {
    return `mailto:${email}`;
  },

  travisWebBranch(branchName) {
    return `https://github.com/travis-ci/travis-web/tree/${branchName}`;
  },

  githubBranch(slug, branch) {
    return `${config.sourceEndpoint}/${slug}/tree/${branch}`;
  },

  billingUrl(accountType, login) {
    const id = accountType === 'user' ? 'user' : login;
    return `${config.billingEndpoint}/subscriptions/${id}`;
  },

  githubTag(slug, tag) {
    return `${config.sourceEndpoint}/${slug}/releases/tag/${tag}`;
  }
});
