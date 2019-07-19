import { vcsName } from 'travis/helpers/vcs-name';

const lowerVcsName = (vcsType) => (
  vcsType ? vcsName(vcsType).toLowerCase() : 'github'
);

export const endpoints = {
  github: 'https://github.com',
  bitbucket: 'https://bitbucket.org',
};

export const vcsUrl = (vcsType, paths = {}) => {
  const vcs = lowerVcsName(vcsType);
  const endpoint = endpoints[vcs];
  const path = paths[vcs];

  if (endpoint === undefined) throw new Error(`No endpoint for VCS "${vcsType}"`);
  if (path === undefined) throw new Error(`No path for VCS "${vcsType}"`);

  return endpoint + path;
};

const links = {
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

  commitUrl: (vcsType, slug, sha) => vcsUrl(vcsType, {
    github: `/${slug}/commit/${sha}`,
    bitbucket: `/${slug}/commits/${sha}`,
  }),

  fileUrl: (vcsType, slug, branch, file) => vcsUrl(vcsType, {
    github: `/${slug}/blob/${branch}/${file}`,
    bitbucket: `/${slug}/src/${branch}/${file}`,
  }),

  issueUrl: (vcsType, slug, issueNumber) => vcsUrl(vcsType, {
    github: `/${slug}/issues/${issueNumber}`,
    bitbucket: `/${slug}/issues/${issueNumber}`,
  }),

  profileUrl: (vcsType, username) => vcsUrl(vcsType, {
    github: `/${username}`,
    bitbucket: `/${username}`,
  }),

  appsActivationUrl: (vcsType, appName, vcsId) => vcsUrl(vcsType, {
    github: `/apps/${appName}/installations/new/permissions?suggested_target_id=${vcsId}`,
    bitbucket: '',
  }),
};

export default links;
