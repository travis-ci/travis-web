import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  api: service(),
  download: service(),

  tagName: 'li',
  classNames: ['row-li', 'pr-row'],

  actions: {
    async downloadExport() {
      const url = this.build['@href'];
      const fileName = this.build.file_name;
      const fileContent = await this.api.get(`${url}.txt`);

      this.download.asTxt(fileName, fileContent);
    }
  }
});
