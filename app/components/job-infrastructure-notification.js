import Ember from 'ember';

export default Ember.Component.extend({
  queue: Ember.computed.alias('job.queue'),
  jobConfig: Ember.computed.alias('job.config'),

  conjugatedRun: Ember.computed('job.isFinished', function () {
    if (this.get('job.isFinished')) {
      return 'ran';
    } else {
      return 'is running';
    }
  }),

  isLegacyInfrastructure: Ember.computed('queue', function () {
    if (this.get('queue') === 'builds.linux') {
      return true;
    }
  }),

  isTrustySudoFalse: Ember.computed.equal('queue', 'builds.ec2'),

  isRetiredMacImageXcode6: Ember.computed('queue', 'jobConfig.osx_image', function () {
    const isMacStadium6 = this.get('queue') === 'builds.macstadium6';
    const retiredImages = ['beta-xcode6.1', 'beta-xcode6.2', 'beta-xcode6.3'];

    return isMacStadium6 && retiredImages.includes(this.get('jobConfig.osx_image'));
  }),

  isRetiredMacImageXcode7: Ember.computed('queue', 'jobConfig.osx_image', function () {
    const isMacStadium6 = this.get('queue') === 'builds.macstadium6';
    const retiredImages = ['xcode7', 'xcode7.1', 'xcode7.2'];

    return isMacStadium6 && retiredImages.includes(this.get('jobConfig.osx_image'));
  })
});
