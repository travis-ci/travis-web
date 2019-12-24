import { archConfigKeys } from 'travis/utils/keys-map';

export default function jobConfigArch(config) {
  const { arch, os } = config || {};

  // Previously it was possible to choose ppc64le arch only by setting `os: linux-ppc64le` in the config.
  // We have introduced a separate `arch` config key, but many customers are still using the old one.
  // We need this hack until we deprecate `os: linux-ppc64le`.
  if (os === 'linux-ppc64le') {
    return 'ppc64le';
  }

  return archConfigKeys[arch || 'amd64'] || arch;
}
