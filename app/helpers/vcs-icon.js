import { helper } from '@ember/component/helper';
import { vcsIcon } from 'travis/utils/vcs';

export default helper(([vcsType]) => vcsIcon(vcsType));
