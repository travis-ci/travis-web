import { underscore } from '@ember/string';

export function underscoreKeys(obj) {
    let newObj = {};

    Object.keys(obj).forEach(key => {
        newObj[underscore(key)] = obj[key];
    });

    return newObj;
}
