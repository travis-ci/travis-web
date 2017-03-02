const colors = {
  'default': 'yellow',
  passed: 'green',
  failed: 'red',
  errored: 'red',
  canceled: 'gray'
};

export default function colorForState(state) {
  return colors[state] || colors['default'];
}
