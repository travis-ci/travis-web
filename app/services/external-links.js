import Service from '@ember/service';
import config from 'travis/config/environment';
import { vcsName } from 'travis/helpers/vcs-name';
import { BITBUCKET, GITHUB } from 'travis/utils/vcs-types';

const lowerVcsName = (vcsType) => vcsName(vcsType).toLowerCase();

export const vcsEndpoints = {
  [BITBUCKET]: 'https://bitbucket.org',
  [GITHUB]: 'https://github.com',
};

export const vcsUrl = (vcsType, paths = {}) => {
  const vcs = lowerVcsName(vcsType);
  const endpoint = vcsEndpoints[vcs];
  const path = paths[vcs];

  if (!endpoint) throw new Error(`No endpoint for VCS "${vcsType}"`);
  if (!path) throw new Error(`No path for VCS "${vcsType}"`);

  return endpoint + path;
};

// TODO:
// The URLs below are used in `helpers/format-message.js`
export const vcsLinks = {
  commitUrl: (vcsType, slug, sha) => vcsUrl(vcsType, {
    github: `/${slug}/commit/${sha}`,
    bitbucket: `/${slug}/commits/${sha}`,
  }),

  issueUrl: (vcsType, slug, issueNumber) => vcsUrl(vcsType, {
    github: `/${slug}/issues/${issueNumber}`,
    bitbucket: `/${slug}/issues/${issueNumber}`,
  }),

  profileUrl: (vcsType, username) => vcsUrl(vcsType, {
    github: `/${username}`,
    bitbucket: `/${username}`,
  }),
};

export default Service.extend({
  ...vcsLinks,

  repoUrl: (vcsType, slug) => vcsUrl(vcsType, {
    github: `/${slug}`,
    bitbucket: `/${slug}`,
  }),

  branchUrl: (vcsType, slug, branch) => vcsUrl(vcsType, {
    github: `/${slug}/tree/${branch}`,
    bitbucket: `/${slug}/src/${branch}`,
  }),

  tagUrl: (vcsType, slug, tag) => vcsUrl(vcsType, {
    github: `/${slug}/releases/tag/${tag}`,
    bitbucket: `/${slug}/src/${tag}`,
  }),

  fileUrl: (vcsType, slug, branch, file) => vcsUrl(vcsType, {
    github: `/${slug}/blob/${branch}/${file}`,
    bitbucket: `/${slug}/src/${branch}/${file}`,
  }),

  email(email) {
    return `mailto:${email}`;
  },

  travisWebBranch(branchName) {
    return `https://github.com/travis-ci/travis-web/tree/${branchName}`;
  },

  billingUrl(accountType, login) {
    const id = accountType === 'user' ? 'user' : login;
    return `${config.billingEndpoint}/subscriptions/${id}`;
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
