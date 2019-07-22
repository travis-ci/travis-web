import { findElement } from 'ember-cli-page-object/extend';

export default function joinTexts(selector) {
  return {
    isDescriptor: true,

    get() {
      const allTexts = findElement(this, selector, { multiple: true });
      return allTexts.map(function () { return this.textContent; })
        .get()
        .join('')
        .trim();
    }
  };
}
