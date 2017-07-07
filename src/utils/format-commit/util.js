import formatSha from "travis/src/utils/format-sha/util";

export default function formatCommit(sha, branch) {
  return formatSha(sha) + (branch ? ' (' + branch + ')' : '');
}
