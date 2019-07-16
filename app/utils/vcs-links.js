function endpoint(vcsType) {
  switch (vcsType) {
    case 'GithubRepository':
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

  userUrl: (vcsType, username) => (
    `${endpoint(vcsType)}/${username}`
  ),
};

export default links;
