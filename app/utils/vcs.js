import { assert } from '@ember/debug';
import config from 'travis/config/environment';

const {
  providers,
  enterprise: isEnterprise,
  sourceEndpoint
} = config;

const vcsTypes = {
  AssemblaOrganization: 'assembla',
  AssemblaRepository: 'assembla',
  AssemblaUser: 'assembla',
  BitbucketOrganization: 'bitbucket',
  BitbucketRepository: 'bitbucket',
  BitbucketUser: 'bitbucket',
  GithubOrganization: 'github',
  GithubRepository: 'github',
  GithubUser: 'github',
};

const vcsId = (vcsType) => {
  if (!vcsType) {
    return 'github';
  }
  assert(`Invalid VCS Type "${vcsType}"`, vcsTypes[vcsType]);
  return vcsTypes[vcsType];
};

const vcsConfig = (vcsType) => (
  providers[vcsId(vcsType)]
);

const replaceParams = (template, params) => (
  Object
    .keys(params)
    .reduce((url, key) => url.replace(`:${key}`, params[key]), template)
);

const templateParams = (template) => (
  template
    .match(/:[a-z]+/g)
    .map((param) => param.slice(1))
);

const paramsValid = (template, params) => (
  arrayEqual(Object.keys(params), templateParams(template))
);

const arrayEqual = (array1, array2) => (
  array1.sort().toString() === array2.sort().toString()
);

export const vcsUrl = (resource, vcsType, params = {}) => {
  const vcs = vcsConfig(vcsType);
  const endpoint = isEnterprise && sourceEndpoint || vcs.endpoint;
  const url = endpoint + vcs.paths[resource];

  assert(`Missing url params. URL: ${url}, PARAMS: ${JSON.stringify(params)}`, paramsValid(url, params));
  return replaceParams(url, params);
};

export const vcsName = (vcsType) => vcsConfig(vcsType).name;

export const vcsIcon = (vcsType) => vcsConfig(vcsType).icon;

export const vcsVocab = (vcsType, vocabKey) => {
  const vocab = vcsConfig(vcsType).vocabulary[vocabKey];
  if (!vocab) {
    throw new Error(`Invalid vocabulary key: ${vocabKey}`);
  }
  return vocab;
};
