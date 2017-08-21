/* eslint-disable */
// generate hash for a string
// found here:
// http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
export default function (string) {
  let hash = 0;
  if (string.length == 0) return hash;
  let i = 0;
  for (; i < string.length; i++) {
      let c = string.charCodeAt(i);
      hash = ((hash<<5)-hash)+c;
      hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};
