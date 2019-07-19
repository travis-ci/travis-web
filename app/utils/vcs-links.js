import { vcsName } from 'travis/helpers/vcs-name';

export function endpoint(vcsType) {
  switch (vcsName(vcsType).toLowerCase()) {
    case 'github':
    default:
      return 'https://github.com';
  }
}

const links = {
  repoUrl: (vcsType, slug) => (
    `${endpoint(vcsType)}/${slug}`
  ),

  branchUrl: (vcsType, slug, branch) => (
    `${endpoint(vcsType)}/${slug}/tree/${branch}`
  ),

  tagUrl: (vcsType, slug, tag) => (
    `${endpoint(vcsType)}/${slug}/releases/tag/${tag}`
  ),

  commitUrl: (vcsType, slug, sha) => (
    `${endpoint(vcsType)}/${slug}/commit/${sha}`
  ),

  fileUrl: (vcsType, slug, branch, file) => (
    `${endpoint(vcsType)}/${slug}/blob/${branch}/${file}`
  ),

  issueUrl: (vcsType, slug, issueNumber) => (
    `${endpoint(vcsType)}/${slug}/issues/${issueNumber}`
  ),

  profileUrl: (vcsType, username) => (
    `${endpoint(vcsType)}/${username}`
  ),

  appsActivationUrl: (vcsType, appName, vcsId) => (
    `${endpoint(vcsType)}/apps/${appName}/installations/new/permissions?suggested_target_id=${vcsId}`
  )
};

export default links;
