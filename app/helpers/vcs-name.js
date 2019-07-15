import { helper } from '@ember/component/helper';

export function vcsName([vcsType]) {
  switch (vcsType) {
    case 'GithubRepository':
    default:
      return 'GitHub';
  }
}

export default helper(vcsName);
