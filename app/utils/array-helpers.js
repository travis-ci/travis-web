export function uniq(first, second) {
    let ret = [];
    const collection = first.concat(second);
    collection.forEach((k) => {
        var index = ret.findIndex((item) => item.id === k.id);
        if (index === -1) {
            ret.push(k);
        }else{
            ret.replace(index, 1, k);
        }
    });
    return ret;
}

export function remove(collection, id) {
    var index = collection.findIndex((item) => item.id === id);
    return [
        ...collection.slice(0, index),
        ...collection.slice(index + 1)
    ];
}
