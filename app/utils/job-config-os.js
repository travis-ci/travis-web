export const OSX_IMAGES = {
  'xcode11.3': '10.14',
  'xcode11.2': '10.14',
  'xcode11.1': '10.14',
  'xcode11': '10.14',
  'xcode10.3': '10.14.4',
  'xcode10.2': '10.14',
  'xcode10.1': '10.13',
  'xcode10': '10.13',
  'xcode9.4': '10.13',
  'xcode9.3': '10.13',
  'xcode9.2': '10.12',
  'xcode9.1': '10.12',
  'xcode9': '10.12',
  'xcode8.3': '10.12',
  'xcode8': '10.11',
  'xcode7.3': '10.11',
  'xcode6.4': '10.10',
};

const DEFAULT_OS = 'unknown';
const DEFAULT_OS_VERSION = 'unknown';

export function jobConfigOs(os) {
  if (os === 'linux' || os === 'linux-ppc64le') {
    return 'linux';
  } else if (os === 'freebsd') {
    return 'freebsd';
  } else if (os === 'osx') {
    return 'osx';
  } else if (os === 'windows') {
    return 'windows';
  } else {
    return DEFAULT_OS;
  }
}

export function jobConfigOsVersion({os, dist, osx_image: osxImage} = {}) {
  if (os === 'osx') {
    return OSX_IMAGES[osxImage] || DEFAULT_OS_VERSION;
  } else {
    return dist || DEFAULT_OS_VERSION;
  }
}
