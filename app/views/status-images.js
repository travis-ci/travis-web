import Ember from 'ember';
import format from 'travis/utils/status-image-formats';

export default Ember.View.extend({
  templateName: 'status_images',
  classNames: ['popup', 'status-images'],
  classNameBindings: ['display'],
  repoBinding: 'toolsView.repo',
  buildBinding: 'toolsView.build',
  jobBinding: 'toolsView.job',
  branchesBinding: 'repo.branches',
  formats: ['Image URL', 'Markdown', 'Textile', 'Rdoc', 'AsciiDoc', 'RST', 'Pod', 'CCTray'],

  didInsertElement() {
    this._super(...arguments);
    this.setStatusImageBranch();
    this.setStatusImageFormat();
    this.show();
  },

  show() {
    return this.set('display', true);
  },

  actions: {
    close() {
      return this.destroy();
    }
  },

  setStatusImageFormat: (function() {
    this.set('statusImageFormat', this.formats[0]);
  }),

  setStatusImageBranch: function() {
    var branch = this.get('repo.branches').findProperty('commit.branch', this.get('build.commit.branch'));
    this.set('statusImageBranch', branch);
  }.observes('repo.branches', 'repo.branches.isLoaded', 'build.commit.branch'),

  statusString: function() {
    return format(this.get('statusImageFormat'), this.get('repo.slug'), this.get('statusImageBranch.commit.branch'));
  }.property('statusImageFormat', 'repo.slug', 'statusImageBranch.commit.branch')
});
