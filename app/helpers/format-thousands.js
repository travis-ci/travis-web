import { helper } from '@ember/component/helper';

export default helper((params) => {
  const [number] = params;
  if (number === 0) return '0';
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});
