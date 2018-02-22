import { helper } from '@ember/component/helper';

export function obfuscatedChars([n]) {
  return '•'.repeat(n);
}

export default helper(obfuscatedChars);
