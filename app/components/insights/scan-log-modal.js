import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';
import { task } from 'ember-concurrency';

export default Component.extend({
  api: service(),

  scanLogs: [],
  scanLogsPresentable: computed('scanLogs.[]', function () {
    return this.scanLogs.map((el) => (
      {
        key: Object.keys(el)[0],
        value: Object.values(el)[0]
      }
    ));
  }),
  scanInProgress: false,
  lastScanLogId: undefined,

  fetchScanLog: task(function* () {
    if (!this.scanInProgress) {
      this.set('scanLogs', []);
    }
    const data = yield this.plugin.getScanLogs.perform(this.lastScanLogId);
    this.set('lastScanLogId', data.scan_logs[data.scan_logs.length - 1].id);
    let node = this.scanLogs.popObject();
    data.scan_logs.forEach((scanLog) => {
      let logType = scanLog.log_type;
      if (!node || !node[logType]) {
        if (node) {
          this.scanLogs.pushObject(node);
        }
        node = {};
        node[logType] = [];
      }
      let item = {};
      for (const [key, value] of Object.entries(scanLog)) {
        if (value) {
          if (scanLog.text.includes('Scan started')) {
            item['text'] = scanLog.text;
            item['additional_text'] = scanLog.created_at;
          } else {
            item[key] = value;
          }
        }
      }
      if (logType == 'probes') {
        let index = node[logType].findIndex(scanLogT => scanLogT.test_template_id == scanLog.test_template_id);
        node[logType].splice(++index, 0, item);
      } else {
        node[logType].pushObject(item);
      }
    });
    this.scanLogs.pushObject(node);
    this.set('scanInProgress', data.meta.scan_status_in_progress);
  }).drop(),

  pollScanLogs() {
    this.fetchScanLog.perform().then(() => {
      if (this.scanInProgress) {
        this.set('poller', setTimeout(
          () => this.pollScanLogs(),
          5000
        ));
      }
    });
  },

  modalOpenObserver: observer('isOpen', function () {
    if (this.isOpen) {
      this.pollScanLogs();
    } else {
      clearTimeout(this.poller);
      this.set('scanInProgress', false);
      this.set('lastScanLogId', undefined);
    }
  }),

  actions: {
    collapseSection(evt) {
      if (evt) {
        let btn = document.getElementById(evt.target.id);
        let section = evt.target.parentElement.nextElementSibling;
        if (btn.classList.contains('collapsed')) {
          btn.classList.remove('collapsed');
          section.classList.remove('collapsedSection');
        } else {
          btn.classList.add('collapsed');
          section.classList.add('collapsedSection');
        }
      }
    }
  }
});
