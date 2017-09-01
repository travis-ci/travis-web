export default function (anObjectOrAPromise, callback) {
  if (anObjectOrAPromise.then) {
    anObjectOrAPromise.then(result => callback(result));
  } else {
    callback(anObjectOrAPromise);
  }
}
