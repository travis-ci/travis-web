import formatSha from 'travis/utils/format-sha';

export default function formatCommit(sha, branch) {
  return formatSha(sha) + (branch ? ' (' + branch + ')' : '');
}
