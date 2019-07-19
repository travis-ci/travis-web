import { helper } from '@ember/component/helper';

export function vcsName(vcsType) {
  const vcsTypeLower = (vcsType || '').toLowerCase();

  if (vcsTypeLower == '' || vcsTypeLower.startsWith('github')) {
    return 'GitHub';
  }
}

export default helper(([vcsType]) => vcsName(vcsType));
