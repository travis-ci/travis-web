export default function formatSha(sha) {
  return (sha || '').substr(0, 7);
}
