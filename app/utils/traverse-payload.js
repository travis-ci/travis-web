import { isArray } from '@ember/array';

let traverse = function (object, callback) {
  if (!object) {
    return;
  }

  if (typeof(object) === 'object' && !isArray(object)) {
    callback(object);
  }

  if (isArray(object)) {
    for (let item of object) {
      traverse(item, callback);
    }
  } else if (typeof object === 'object') {
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        let item = object[key];
        traverse(item, callback);
      }
    }
  }
};

export default traverse;
