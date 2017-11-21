import fuzzysort from 'npm:fuzzysort';

export default function fuzzyMatch(string, query, prefix = '<b>', suffix = '</b>') {
  return fuzzysort.highlight(fuzzysort.single(query, string), prefix, suffix) || string;
}
