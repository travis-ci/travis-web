import {
  create,
  collection,
  text,
} from 'ember-cli-page-object';

export default create({
  sections: collection('footer.footer .footer-elem', {
    title: text('ul > li > a'),
  }),
});
