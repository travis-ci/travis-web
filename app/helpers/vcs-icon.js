import { helper } from '@ember/component/helper';
import vcsConfig from 'travis/utils/vcs-config';

export default helper(([vcsType]) => vcsConfig.get(vcsType).icon);
