import Service from '@ember/service';
import config from 'travis/config/environment';
import { vcsUrl } from 'travis/utils/vcs';

// TODO:
// The URLs below are used in `helpers/format-message.js` which needs
// to be changed to use services.
export const vcsLinks = {
  commitUrl: (vcsType, params) => vcsUrl('commit', vcsType, params),

  issueUrl: (vcsType, params) => vcsUrl('issue', vcsType, params),

  profileUrl: (vcsType, params) => vcsUrl('profile', vcsType, params),

  accessSettingsUrl: (vcsType, params) => vcsUrl('accessSettings', vcsType, params),
};

export default Service.extend({
  ...vcsLinks,

  branchUrl: (vcsType, params) => vcsUrl('branch', vcsType, params),

  fileUrl: (vcsType, params) => vcsUrl('file', vcsType, params),

  repoUrl: (vcsType, params) => vcsUrl('repo', vcsType, params),

  tagUrl: (vcsType, params) => vcsUrl('tag', vcsType, params),

  email(email) {
    return `mailto:${email}`;
  },

  travisWebBranch(branchName) {
    return `https://github.com/travis-ci/travis-web/tree/${branchName}`;
  },

  billingUrl(accountType, login) {
    const id = accountType === 'user' ? 'account' : `organizations/${login}`;
    return `${config.billingEndpoint}/${id}/plan`;
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
