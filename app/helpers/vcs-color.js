import { helper } from '@ember/component/helper';
import { vcsColor } from 'travis/utils/vcs';

export default helper(([vcsType, color]) => vcsColor(vcsType, color));
