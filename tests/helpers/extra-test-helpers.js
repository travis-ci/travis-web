import { fillIn, triggerKeyEvent } from '@ember/test-helpers';

export async function fillInWithKeyEvent(selector, value) {
  let promises = [];

  // fill in selector using full value
  promises.push(fillIn(selector, value));

  // emit keyup event for final character
  const finalChar = value.slice(-1);
  promises.push(triggerKeyEvent(selector, 'keyup', finalChar.charCodeAt(0)));

  await Promise.all(promises);
}
