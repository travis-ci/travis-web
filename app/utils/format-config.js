import formatSha from 'travis/utils/format-sha';

const slugRe = (slug = '') => (new RegExp(`^${slug}/`));

const fileName = (source = '') => ((source.match(/([^\/]*)(@\w{16})?$/) || [])[1]);

export const fileNameWithoutSha = (source) => (fileName(source).replace(/(@\w{16})$/, ''));

export const isInternal = (source = '', slug = '') => (!source.match(slugRe(slug)));

export const presentedPath = (source = '', slug = '') => (
  source
    .replace(/@\w{16}$/, sha => `@${formatSha(sha.substring(1))}`)
    .replace(slugRe(slug), '')
);

export const codeblockName = (source = '') => (`rccb_${fileName(source)}`);
