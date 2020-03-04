export default function countBy(objs, name) {
  return objs.reduce((counts, obj) => {
    if (!counts[obj[name]]) {
      counts[obj[name]] = 0;
    }
    counts[obj[name]] += 1;
    return counts;
  }, {});
}
