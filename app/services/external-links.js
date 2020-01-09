import Service from '@ember/service';
import config from 'travis/config/environment';
import { vcsUrl } from 'travis/utils/vcs';

// TODO:
// The URLs below are used in `helpers/format-message.js` which needs
// to be changed to use services.
export const vcsLinks = {
  commitUrl: (vcsType, { owner, repo, commit }) => vcsUrl('commit', vcsType, { owner, repo, commit }),

  issueUrl: (vcsType, { owner, repo, issue }) => vcsUrl('issue', vcsType, { owner, repo, issue }),

  profileUrl: (vcsType, { owner }) => vcsUrl('profile', vcsType, { owner }),

  accessSettingsUrl: (vcsType, { owner }) => vcsUrl('accessSettings', vcsType, { owner }),
};

export default Service.extend({
  ...vcsLinks,

  branchUrl: (vcsType, { owner, repo, branch }) => vcsUrl('branch', vcsType, { owner, repo, branch }),

  fileUrl: (vcsType, { owner, repo, branch, file }) => vcsUrl('file', vcsType, { owner, repo, branch, file }),

  repoUrl: (vcsType, { owner, repo }) => vcsUrl('repo', vcsType, { owner, repo }),

  tagUrl: (vcsType, { owner, repo, tag }) => vcsUrl('tag', vcsType, { owner, repo, tag }),

  email(email) {
    return `mailto:${email}`;
  },

  travisWebBranch(branchName) {
    return `https://github.com/travis-ci/travis-web/tree/${branchName}`;
  },

  billingUrl(accountType, login) {
    const id = accountType === 'user' ? 'account' : `organizations/${login}`;
    return `${config.billingEndpoint}/${id}/subscription`;
  },

  openSourceMigrationDocs: 'https://docs.travis-ci.com/user/open-source-on-travis-ci-com/#existing-open-source-repositories-on-travis-ciorg',

  betaMigrationDocs: 'https://docs.travis-ci.com/user/open-source-repository-migration/',

  platformLink(platform, rest) {
    return `https://travis-ci.${platform}/${rest}`;
  },

  migratedToComLink(slug) {
    return this.platformLink('com', slug);
  },

  migratedToComSettingsLink(slug) {
    return this.platformLink('com', `${slug}/settings`);
  },

  orgBuildHistoryLink(slug) {
    return this.platformLink('org', `${slug}/builds`);
  },

  comBuildHistoryLink(slug) {
    return this.platformLink('com', `${slug}/builds`);
  },

  communityTopicLink(slug, id) {
    return `${config.urls.community}/t/${slug}/${id}`;
  },
});
