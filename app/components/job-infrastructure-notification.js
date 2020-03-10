import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, equal, and, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import moment from 'moment';

const NOVEMBER_2017_RETIREMENT = '2017-11-28T12:00:00-08:00';
const LATEST_TRUSTY_RELEASE = '2017-12-12T17:25:00-00:00';

export default Component.extend({
  auth: service(),
  features: service(),

  queue: reads('job.queue'),
  isJobFinished: reads('job.isFinished'),
  jobStartedAt: reads('job.startedAt'),
  jobConfig: reads('job.config'),
  dist: reads('jobConfig.dist'),
  language: reads('jobConfig.language'),

  isPreciseDist: equal('dist', 'precise'),
  isTrustyDist: equal('dist', 'trusty'),
  isAndroidLanguage: equal('language', 'android'),
  isNotAndroidLanguage: not('isAndroidLanguage'),
  isPreciseEOL: and('isGceBuild', 'isPreciseDist', 'isNotAndroidLanguage'),

  isWindows: equal('jobConfig.os', 'windows'),

  conjugatedRun: computed('isJobFinished', function () {
    return this.isJobFinished ? 'ran' : 'is running';
  }),

  isGceBuild: equal('queue', 'build.gce'),
  isLegacyInfrastructure: equal('queue', 'builds.linux'),
  isTrustySudoFalse: equal('queue', 'builds.ec2'),
  isMacStadium6: equal('queue', 'builds.macstadium6'),

  isTrustySudoRequired: computed('jobStartedAt', 'isGceBuild', 'isTrustyDist', function () {
    if (this.isGceBuild && this.isTrustyDist) {
      const jobRanAfterReleaseDate = Date.parse(this.jobStartedAt) > Date.parse(LATEST_TRUSTY_RELEASE);
      if (jobRanAfterReleaseDate) {
        return true;
      }
    }

    return false;
  }),


  macOSImage: reads('jobConfig.osx_image'),
  deprecatedXcodeImages: ['xcode8.1', 'xcode8.2', 'xcode6.4'],

  imageToRetirementDate: {
    'xcode8.1': NOVEMBER_2017_RETIREMENT,
    'xcode8.2': NOVEMBER_2017_RETIREMENT
  },

  imageToNewImage: {
    'xcode8.1': 'xcode8.3',
    'xcode8.2': 'xcode8.3'
  },

  newImageStrings: {
    'xcode8.3': 'Xcode 8.3',
    'xcode7.3': 'Xcode 7.3.1',
    'xcode6.4': 'Xcode 6.4'
  },

  isDeprecatedOrRetiredMacImage: computed('isMacStadium6', 'macOSImage', function () {
    let isMacStadium6 = this.isMacStadium6;
    let macOSImage = this.macOSImage;
    return isMacStadium6 && this.deprecatedXcodeImages.includes(macOSImage);
  }),

  deprecatedOrRetiredMacImageMessage: computed(
    'jobStartedAt',
    'macOSImage',
    'isJobFinished',
    'conjugatedRun',
    'isDeprecatedOrRetiredMacImage',
    function () {
      let image = this.macOSImage;
      let conjugatedRun = this.conjugatedRun;

      if (image === 'xcode6.4') {
        return `Running builds with Xcode 6.4 in Travis CI is deprecated and will be
  removed in January 2019. If Xcode 6.4 is critical to your builds, please contact our support team
  at <a href="mailto:support@travis-ci.com">support@travis-ci.com</a> to discuss options.`;
      }

      const retirementDate = Date.parse(this.imageToRetirementDate[image]);

      const newImage = this.imageToNewImage[image];
      const newImageString = this.newImageStrings[newImage];
      const newImageAnchor = newImageString.replace(' ', '-');
      const newImageURLString = `<a href='https://docs.travis-ci.com/user/reference/osx/#${newImageAnchor}'>${newImageString}</a>`;
      const imageRetirementAnnouncementURL = 'https://blog.travis-ci.com/2017-11-21-xcode8-3-default-image-announce';

      const jobRanBeforeRetirementDate = Date.parse(this.jobStartedAt) < retirementDate;
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
          This job ${this.isJobFinished ? 'was configured to run on' : 'is configured to run on'}
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
  )
});
