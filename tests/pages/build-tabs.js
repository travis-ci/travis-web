import {
  create,
  hasClass,
  text,
  clickable
} from 'ember-cli-page-object';

export default create({
  configTab: {
    click: clickable('#tab_config'),
    contents: text('#config_pre')
  }
  
});
