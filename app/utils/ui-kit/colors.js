import config from 'travis/config/environment';
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
