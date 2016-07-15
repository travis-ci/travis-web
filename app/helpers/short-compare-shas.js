import { pathFrom } from 'travis/utils/helpers';
import Ember from "ember";

export default Ember.Helper.helper(function(params) {
  var path, shas, url;
  url = params[0];
  path = pathFrom(url);
  if (path.indexOf('...') >= 0) {
    shas = path.split('...');
    return shas[0].slice(0, 7) + ".." + shas[1].slice(0, 7);
  } else {
    return path;
  }
});
