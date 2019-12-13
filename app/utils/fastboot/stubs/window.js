import doc from 'travis/utils/fastboot/stubs/document';
import { makeStorage } from 'travis/utils/fastboot/stubs/localstorage';

export default {
  document: doc,
  navigator: {},
  localStorage: makeStorage(),
  sessionStorage: makeStorage(),
  innerHeight: 500,
  pageXOffset: 0,
  pageYOffset: 0,
  scrollTo() {},
};
