import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias, equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import moment from 'moment';

const NOVEMBER_2017_RETIREMENT = '2017-11-28T12:00:00-08:00';
const LATEST_TRUSTY_RELEASE = '2017-12-12T17:25:00-00:00';

export default Component.extend({
  auth: service(),
  features: service(),

  queue: alias('job.queue'),
  jobConfig: alias('job.config'),

  isWindows: equal('jobConfig.os', 'windows'),

  conjugatedRun: computed('job.isFinished', function () {
    let isFinished = this.get('job.isFinished');
    return isFinished ? 'ran' : 'is running';
  }),

  isLegacyInfrastructure: equal('queue', 'builds.linux'),
  isTrustySudoFalse: equal('queue', 'builds.ec2'),

  isTrustySudoRequired: computed('job.startedAt', 'queue', 'job.config.dist', function () {
    let startedAt = this.get('job.startedAt');
    let queue = this.get('queue');
    let dist = this.get('job.config.dist');

    if (queue === 'builds.gce' && dist === 'trusty') {
      const jobRanAfterReleaseDate = Date.parse(startedAt) > Date.parse(LATEST_TRUSTY_RELEASE);
      if (jobRanAfterReleaseDate) {
        return true;
      }
    }

    return false;
  }),

  isMacStadium6: equal('queue', 'builds.macstadium6'),

  isPreciseEOL: computed('queue', 'job.config.dist', 'job.config.language', function () {
    let queue = this.get('queue');
    let dist = this.get('job.config.dist');
    let language = this.get('job.config.language');
    if (queue === 'builds.gce' && dist === 'precise') {
      if (language !== 'android') {
        return true;
      }
    }
  }),

  isPHPDefault: computed('job.config.{language,php}', function () {
    const language = this.get('job.config.language');
    const php = this.get('job.config.php');
    return language === 'php' && !php;
  }),

  isPythonDefault: computed('job.config.{language,python}', function () {
    const language = this.get('job.config.language');
    const python = this.get('job.config.python');
    return language === 'python' && !python;
  }),

  macOSImage: alias('jobConfig.osx_image'),
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
    let isMacStadium6 = this.get('isMacStadium6');
    let macOSImage = this.get('macOSImage');
    return isMacStadium6 && this.get('deprecatedXcodeImages').includes(macOSImage);
  }),

  deprecatedOrRetiredMacImageMessage: computed(
    'job.startedAt',
    'macOSImage',
    'job.isFinished',
    'conjugatedRun',
    'isDeprecatedOrRetiredMacImage',
    function () {
      let startedAt = this.get('job.startedAt');
      let image = this.get('macOSImage');
      let isFinished = this.get('job.isFinished');
      let conjugatedRun = this.get('conjugatedRun');

      if (image === 'xcode6.4') {
        return `Running builds with Xcode 6.4 in Travis CI is deprecated and will be
  removed in January 2019. If Xcode 6.4 is critical to your builds, please contact our support team
  at <a href="mailto:support@travis-ci.com">support@travis-ci.com</a> to discuss options.`;
      }

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
  )
});
