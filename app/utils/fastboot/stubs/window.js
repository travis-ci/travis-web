import doc from 'travis/utils/fastboot/stubs/document';
import { localStorage, sessionStorage } from 'travis/utils/fastboot';

export default {
  document: doc,
  navigator: {},
  localStorage,
  sessionStorage,
  innerHeight: 500,
  pageXOffset: 0,
  pageYOffset: 0,
  scrollTo() {},
};
