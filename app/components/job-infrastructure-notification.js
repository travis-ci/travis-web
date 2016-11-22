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

  isLegacyInfrastructure: Ember.computed.equal('queue', 'builds.linux'),

  isTrustySudoFalse: Ember.computed.equal('queue', 'builds.ec2'),
  isMacStadium6: Ember.computed.equal('queue', 'builds.macstadium6'),

  macOSImage: Ember.computed.alias('jobConfig.osx_image'),

  isRetiredMacImageXcode6: Ember.computed('queue', 'macOSImage', function () {
    const retiredImages = ['beta-xcode6.1', 'beta-xcode6.2', 'beta-xcode6.3'];
    return this.get('isMacStadium6') && retiredImages.includes(this.get('macOSImage'));
  }),

  isRetiredMacImageXcode7: Ember.computed('queue', 'macOSImage', function () {
    const retiredImages = ['xcode7', 'xcode7.1', 'xcode7.2'];
    return this.get('isMacStadium6') && retiredImages.includes(this.get('macOSImage'));
  })
});
