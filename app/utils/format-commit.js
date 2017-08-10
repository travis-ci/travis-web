import formatSha from 'travis/utils/format-sha';

export default function formatCommit(sha, branch) {
  let commitString = formatSha(sha);
  if (branch) {
    commitString = `${commitString} (${branch})`;
  }
  return commitString;
}
