import { vcsName } from 'travis/helpers/vcs-name';

const lowerVcsName = (vcsType) => vcsName(vcsType).toLowerCase();

export const endpoints = {
  github: 'https://github.com',
};

export const vcsUrl = (vcsType, paths = {}) => {
  const vcs = lowerVcsName(vcsType);
  const endpoint = endpoints[vcs];
  const path = paths[vcs];

  if (!endpoint) throw new Error(`Invalid endpoint "${endpoint}"`);
  if (!path) throw new Error(`Invalid path "${path}"`);

  return endpoint + path;
};

const links = {
  repoUrl: (vcsType, slug) => vcsUrl(vcsType, {
    github: `/${slug}`,
  }),

  branchUrl: (vcsType, slug, branch) => vcsUrl(vcsType, {
    github: `/${slug}/tree/${branch}`,
  }),

  tagUrl: (vcsType, slug, tag) => vcsUrl(vcsType, {
    github: `/${slug}/releases/tag/${tag}`,
  }),

  commitUrl: (vcsType, slug, sha) => vcsUrl(vcsType, {
    github: `/${slug}/commit/${sha}`,
  }),

  fileUrl: (vcsType, slug, branch, file) => vcsUrl(vcsType, {
    github: `/${slug}/blob/${branch}/${file}`,
  }),

  issueUrl: (vcsType, slug, issueNumber) => vcsUrl(vcsType, {
    github: `/${slug}/issues/${issueNumber}`,
  }),

  profileUrl: (vcsType, username) => vcsUrl(vcsType, {
    github: `/${username}`,
  }),

  appsActivationUrl: (vcsType, appName, vcsId) => vcsUrl(vcsType, {
    github: `/apps/${appName}/installations/new/permissions?suggested_target_id=${vcsId}`,
  })
};

export default links;
