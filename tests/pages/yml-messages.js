import PageObject from 'travis/tests/page-object';

let {
  collection,
  hasClass,
  text,
} = PageObject;

export default collection('.yml-message', {
  icon: {
    scope: 'svg',
    isInfo: hasClass('icon-info'),
    isWarning: hasClass('icon-warn'),
    isError: hasClass('icon-error')
  },
  message: text('.message')
});
