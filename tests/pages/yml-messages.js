import PageObject from 'travis/tests/page-object';

let {
  collection,
  hasClass,
  isVisible,
  text,
} = PageObject;

export default collection({
  itemScope: '.yml-message',

  isVisible: isVisible('.yml-messages'),

  item: {
    icon: {
      scope: 'svg',
      isInfo: hasClass('icon-info'),
      isWarning: hasClass('icon-warn'),
      isError: hasClass('icon-error')
    },
    message: text('.message')
  }
});
