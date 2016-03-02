export default function(anObjectOrAPromise, callback) {
  if(anObjectOrAPromise.then) {
    anObjectOrAPromise.then(function(result) {
      callback(result);
    });
  } else {
    callback(anObjectOrAPromise);
  }
}
