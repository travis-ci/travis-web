import { helper } from '@ember/component/helper';
import { BITBUCKET, GITHUB } from 'travis/utils/vcs-types'

const VCS_NAMES = {
  [BITBUCKET]: 'Bitbucket',
  [GITHUB]: 'GitHub',
};

export function vcsName(vcsType = GITHUB) {
  const vcsTypeLower = vcsType.toLowerCase();

  if (vcsTypeLower.startsWith(GITHUB)) {
    return VCS_NAMES[GITHUB];
  } else if (vcsTypeLower.startsWith(BITBUCKET)) {
    return VCS_NAMES[BITBUCKET];
  }
}

export default helper(([vcsType]) => vcsName(vcsType));
