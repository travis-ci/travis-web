import { vcsName } from 'travis/helpers/vcs-name';

function endpoint(vcsType) {
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
};

export default links;
