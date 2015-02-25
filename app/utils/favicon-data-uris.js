var __inlineImageDataUri__ = function() {}; // in case image inliner doesn't run

var uris = {
  default: __inlineImageDataUri__('favicon.png'),
  red: __inlineImageDataUri__('favicon-red.png'),
  gray: __inlineImageDataUri__('favicon-gray.png'),
  green: __inlineImageDataUri__('favicon-green.png'),
  yellow: __inlineImageDataUri__('favicon-yellow.png')
};

export default function(type) {
  return uris[type] || uris.default;
}
