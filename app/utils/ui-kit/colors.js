import config from 'travis/config/environment';
import { A } from '@ember/array';
const { tailwind } = config;
const { theme } = tailwind;

export const { colors: COLORS } = theme;

export function colorExists(name) {
  if (COLORS[name]) {
    return true;
  }

  const [color, shade] = name.split('-');
  if (color && shade) {
    const group = COLORS[color];
    return group && group[shade];
  }

  return false;
}

// export const names = Object.entries(COLORS).reduce((list, [name, val]) => {
//   if (typeof val === 'string') {
//     list.push(name);
//   } else {
//     list.push(...Object.keys(val).map(suffix => `${name}-${suffix}`));
//   }
// }, A());
