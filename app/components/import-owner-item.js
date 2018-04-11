import Component from '@ember/component';
import { service } from 'ember-decorators/service';

export default Component.extend({
  @service('pusher') pusherService: null,
  @service('api') api: null,
  @service('flashes') flashes: null,

  tagName: '',
  phase: 1,
  progressPercent: 0,

  didInsertElement() {
    let guard = (event, data) => {
      let type = this.get('owner').constructor.modelName;
      return data.owner.id === parseInt(this.get('owner.id')) && data.owner.type === type;
    };

    this.get('pusherService').subscribe('import:start', (event, data) => { this.importStarted(event, data) }, guard);
    this.get('pusherService').subscribe('import:phase', (event, data) => { this.importPhase(event, data) }, guard);
    this.get('pusherService').subscribe('import:progress', (event, data) => { this.importProgress(event, data) }, guard);
    this.get('pusherService').subscribe('import:done', (event, data) => { this.importDone(event, data) }, guard);
    this.set('data', {counts: {}, totals: {}});
  },

  willDestroyElement() {
    // TODO: unsubscribe
  },

  importStarted(event, data) {
    this.set('status', 'Started');
  },

  recalculateProgress(data, phase) {
    let currentProgressPercent = this.get('progressPercent'),
      progressPercent, count, total;
    if (phase === 1) {
      count = data.counts && data.counts.repositories || 0;
      total = data.totals && data.totals.repositories || 0;
    } else {
      let sum = (object) => Object.values(object).reduce((sum, v) => sum + v, 0);
      total = data.totals ? sum(data.totals) : 0;
      count = data.counts ? sum(data.counts) : 0;
    }

    progressPercent = Math.round(count / total * 100) || 0;
    progressPercent = progressPercent > 100 ? 100 : progressPercent;
    if (currentProgressPercent < progressPercent) {
      this.set('progressPercent', progressPercent);
    }
  },

  importDone(event, data) {
    this.reset();
    this.set('done', true);
  },

  importProgress(event, data) {
    if (data.phase === 2 && this.get('phase') == 1) {
      this.set('phase', 2);
      this.set('phase2', true);
      this.reset();
    }

    if (this.get('phase') === data.phase) {
      this.set('data.counts', jQuery.extend(this.get('data.counts'), data.counts));
      this.set('data.totals', jQuery.extend(this.get('data.totals'), data.totals));
      this.set('status', JSON.stringify({ counts: this.get('data.counts'), totals: this.get('data.totals'), phase: data.phase }));
      this.recalculateProgress(this.get('data'), data.phase);
    }
  },

  reset() {
    this.set('progressPercent', 0);
    this.set('data.counts', {});
    this.set('data.totals', {});
  },

  actions: {
    import() {
      this.set('status', null);
      this.set('phaseInfo', null);
      this.get('api').post(`/owner/${this.get('owner.login')}/import`).then(
        () => {
          this.set('phase', 1);
          this.get('flashes').success('Repository has been successfully activated.');
        },
        () =>
          this.get('flashes').error('There was an error while trying to import'),
      );
    }
  }
});
