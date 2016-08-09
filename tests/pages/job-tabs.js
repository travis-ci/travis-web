import {
  create,
  hasClass,
  text,
  clickable,
  isVisible,
  isHidden
} from 'ember-cli-page-object';

export default create({
  configTab: {
    click: clickable('#tab_config'),
    contents: text('#config_pre'),
    active: hasClass('active', '#tab_config'),
    isHidden: isHidden('#config_pre'),
    isShowing: isVisible('#config_pre')
  },
  logTab: {
    isShowing: isVisible('.job-log'),
    isHidden: isHidden('.job-log'),
    active: hasClass('active', '#tab_log'),
    click: clickable('#tab_log')
  }
});
