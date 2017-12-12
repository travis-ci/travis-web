import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { alias, equal } from 'ember-decorators/object/computed';

import moment from 'moment';

const NOVEMBER_2017_RETIREMENT = '2017-11-28T12:00:00-08:00';
const LATEST_TRUSTY_RELEASE = '2017-12-12T16:15:00-00:00';

export default Component.extend({
  @alias('job.queue') queue: null,
  @alias('job.config') jobConfig: null,

  @computed('job.isFinished')
  conjugatedRun(isFinished) {
    return isFinished ? 'ran' : 'is running';
  },

  @equal('queue', 'builds.linux') isLegacyInfrastructure: null,
  @equal('queue', 'builds.ec2') isTrustySudoFalse: null,

  @computed('job.startedAt', 'queue', 'job.config.dist')
  isTrustySudoRequired(startedAt, queue, dist) {
    if (queue === 'builds.gce' && dist === 'trusty') {
      const jobRanAfterReleaseDate = Date.parse(startedAt) > Date.parse(LATEST_TRUSTY_RELEASE);
      if (jobRanAfterReleaseDate) {
        return true;
      }
    }

    return false;
  },

  @equal('queue', 'builds.macstadium6') isMacStadium6: null,

  @computed('queue', 'job.config,dist', 'job.config.language')
  isPreciseEOL(queue, dist, language) {
    if (queue === 'builds.gce' && dist === 'precise') {
      if (language !== 'android') {
        return true;
      }
    }
  },

  @alias('jobConfig.osx_image') macOSImage: null,

  deprecatedXcodeImages: ['xcode8', 'xcode8.1', 'xcode8.2'],

  imageToRetirementDate: {
    'xcode8': NOVEMBER_2017_RETIREMENT,
    'xcode8.1': NOVEMBER_2017_RETIREMENT,
    'xcode8.2': NOVEMBER_2017_RETIREMENT
  },

  imageToNewImage: {
    'xcode8': 'xcode8.3',
    'xcode8.1': 'xcode8.3',
    'xcode8.2': 'xcode8.3'
  },

  newImageStrings: {
    'xcode8.3': 'Xcode 8.3',
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
    const newImageURLString = `<a href='https://docs.travis-ci.com/user/reference/osx/#${newImageAnchor}'>${newImageString}</a>`;
    const imageRetirementAnnouncementURL = 'https://blog.travis-ci.com/2017-11-21-xcode8-3-default-image-announce';

    const jobRanBeforeRetirementDate = Date.parse(startedAt) < retirementDate;
    const retirementDateIsInTheFuture = retirementDate > new Date();

    const formattedRetirementDate = moment(retirementDate).format('MMMM D, YYYY');

    const retirementLink =
      `<a href='${imageRetirementAnnouncementURL}'>
      ${retirementDateIsInTheFuture ? 'will be retired' : 'was retired'}
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
        `After that, it will route to our ${newImageURLString} image.`;
    } else if (jobRanBeforeRetirementDate) {
      routingSentence = `New jobs will route to our ${newImageURLString} image.`;
    } else {
      routingSentence = `It was routed to our ${newImageURLString} image.`;
    }

    return `${retirementSentence} ${routingSentence}`;
  }
});
