import {
  collection,
  hasClass,
  text,
} from 'ember-cli-page-object';

export default collection('.yml-message', {
  icon: {
    scope: 'svg',
    isInfo: hasClass('icon-info'),
    isWarning: hasClass('icon-warn'),
    isError: hasClass('icon-error')
  },
  message: text('.message')
});
