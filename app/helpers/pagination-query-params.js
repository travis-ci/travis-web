import { helper } from '@ember/component/helper';

export function paginationQueryParams([key, value]) {
  let object = {};

  object[key] = value;

  return {
    isQueryParams: true,
    values: object
  };
}

export default helper(paginationQueryParams);
