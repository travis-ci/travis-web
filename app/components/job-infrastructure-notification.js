/* global moment */
import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import { alias, equal } from 'ember-decorators/object/computed';

const NOVEMBER_2016_RETIREMENT = '2016-11-28T12:00:00-08:00';
const JANUARY_2017_RETIREMENT = '2017-01-20T12:00:00-08:00';
const LATEST_TRUSTY_RELEASE = '2017-07-12T18:00:00-00:00';

export default Ember.Component.extend({
  @alias('job.queue') queue: null,
  @alias('job.config') jobConfig: null,

  @computed('job.isFinished')
  conjugatedRun(isFinished) {
    return isFinished ? 'ran' : 'is running';
  },

  @equal('queue', 'builds.linux') isLegacyInfrastructure: null,
  @equal('queue', 'builds.ec2') isTrustySudoFalse: null,

  @computed('job.startedAt', 'job.config')
  isTrustyStable(startedAt, config = {}) {
    if (config.dist === 'trusty' && config.group === 'stable') {
      const jobRanAfterReleaseDate = Date.parse(startedAt) > Date.parse(LATEST_TRUSTY_RELEASE);
      if (jobRanAfterReleaseDate) {
        return true;
      }
    }

    return false;
  },

  @equal('queue', 'builds.macstadium6') isMacStadium6: null,

  @computed('queue', 'job.config')
  isPreciseEOL(queue, config) {
    if (queue === 'builds.gce' && config.dist === 'precise') {
      if (config.language !== 'android') {
        return true;
      }
    }
  },

  @alias('jobConfig.osx_image') macOSImage: null,

  deprecatedXcodeImages:
    ['beta-xcode6.1', 'beta-xcode6.2', 'beta-xcode6.3', 'xcode7', 'xcode7.1', 'xcode7.2'],

  imageToRetirementDate: {
    'beta-xcode6.1': JANUARY_2017_RETIREMENT,
    'beta-xcode6.2': NOVEMBER_2016_RETIREMENT,
    'beta-xcode6.3': NOVEMBER_2016_RETIREMENT,
    'xcode7': NOVEMBER_2016_RETIREMENT,
    'xcode7.1': NOVEMBER_2016_RETIREMENT,
    'xcode7.2': NOVEMBER_2016_RETIREMENT
  },

  imageToNewImage: {
    'beta-xcode6.1': 'xcode7.3',
    'beta-xcode6.2': 'xcode7.3',
    'beta-xcode6.3': 'xcode7.3',
    'xcode7': 'xcode7.3',
    'xcode7.1': 'xcode7.3',
    'xcode7.2': 'xcode7.3'
  },

  newImageStrings: {
    'xcode7.3': 'Xcode 7.3.1',
    'xcode6.4': 'Xcode 6.4'
  },

  @computed('isMacStadium6', 'macOSImage')
  isDeprecatedOrRetiredMacImage(isMacStadium6, macOSImage) {
    return isMacStadium6 && this.get('deprecatedXcodeImages').includes(macOSImage);
  },

  // eslint-disable-next-line
  @computed('job.startedAt', 'macOSImage', 'job.isFinished', 'conjugatedRun', 'isDeprecatedOrRetiredMacImage')
  deprecatedOrRetiredMacImageMessage(startedAt, image, isFinished, conjugatedRun) {
    const retirementDate = Date.parse(this.get('imageToRetirementDate')[image]);

    const newImage = this.get('imageToNewImage')[image];
    const newImageString = this.get('newImageStrings')[newImage];
    const newImageAnchor = newImageString.replace(' ', '-');
    const newImageURL = `https://docs.travis-ci.com/user/osx-ci-environment/#${newImageAnchor}`;

    const jobRanBeforeRetirementDate = Date.parse(startedAt) < retirementDate;
    const retirementDateIsInTheFuture = retirementDate > new Date();

    const formattedRetirementDate = moment(retirementDate).format('MMMM D, YYYY');

    const retirementLink =
      `<a href='${newImageURL}'>${retirementDateIsInTheFuture ? 'will be retired' : 'was retired'}
      on ${formattedRetirementDate}</a>`;

    let retirementSentence, routingSentence;

    if (retirementDateIsInTheFuture) {
      retirementSentence = `This job ${conjugatedRun} on an OS X image that ${retirementLink}.`;
    } else {
      retirementSentence = `
        This job ${isFinished ? 'was configured to run on' : 'is configured to run on'}
        an OS X image that ${retirementLink}.`;
    }

    if (retirementDateIsInTheFuture) {
      routingSentence =
        `After that, it will route to our ${newImageString} infrastructure.`;
    } else if (jobRanBeforeRetirementDate) {
      routingSentence = `New jobs will route to our ${newImageString} infrastructure.`;
    } else {
      routingSentence = `It was routed to our ${newImageString} infrastructure.`;
    }

    return `${retirementSentence} ${routingSentence}`;
  }
});
