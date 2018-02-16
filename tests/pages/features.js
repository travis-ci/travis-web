import {
  clickable,
  collection,
  create,
  hasClass,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/features'),

  features: collection('.features-list .feature', {
    name: text('.feature-name'),
    description: text('p'),
    isOn: hasClass('active', '.switch'),

    click: clickable('.switch')
  })
});
