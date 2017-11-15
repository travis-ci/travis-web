import { helper } from '@ember/component/helper';

export default helper((params) => {
  const [url] = params;
  let path, shas;
  path = (url || '').split('/').pop();
  if (path.indexOf('...') >= 0) {
    shas = path.split('...');
    return `${shas[0].slice(0, 7)}..${shas[1].slice(0, 7)}`;
  } else {
    return path;
  }
});
