import config from 'travis/config/environment';

export const VARIANTS = [
  ...Object.values(config.screens).map(screen => screen.prefix),
  'hover'
];

export function filterExtantProps(obj, props) {
  props.filter(prop => typeof obj[prop] !== 'undefined');
}

export default function generatePropVariants(props) {
  if (props.length === 0) {
    return [];
  }

  const generatedVariants = VARIANTS.reduce(
    (results, variant) => {
      props.map(candidate => {
        const propName = variant.length > 0 ? `${variant}:${candidate}` : candidate;
        results.push(propName);
      });

      return results;
    },
    []
  );

  return generatedVariants;
}
