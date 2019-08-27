import { helper } from '@ember/component/helper';
import { vcsName } from 'travis/utils/vcs';

export default helper(([vcsType]) => vcsName(vcsType));
