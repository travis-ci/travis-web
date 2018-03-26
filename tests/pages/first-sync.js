import {
  create,
  text
} from 'ember-cli-page-object';

export default create({
  heading: text('h1.content-title')
});
