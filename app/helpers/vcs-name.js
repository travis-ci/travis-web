import { helper } from '@ember/component/helper';

export function vcsName(vcsType) {
  const vcsTypeLower = (vcsType || 'github').toLowerCase();

  if (vcsTypeLower.startsWith('github')) {
    return 'GitHub';
  } else if (vcsTypeLower.startsWith('bitbucket')) {
    return 'Bitbucket';
  }
}

export default helper(([vcsType]) => vcsName(vcsType));
