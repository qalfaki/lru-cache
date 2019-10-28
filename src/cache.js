
// double linked list

class Node {

  constructor(key, value, maxAge, expires) {
    if ([key, value].includes(undefined))
      throw new Error(`${[key, value].indexOf(undefined) == 0 ? 'key': 'value'} not provided`);

    this.data = {key, value};
    this.previous = null;
    this.next = null;
    this.maxAge = typeof maxAge === 'number' ? maxAge : Infinity;
    this.expires = typeof expires === 'number' ? expires : Infinity;
  }

  getValue() {
    return this.data.value;
  }

  getMaxAge() {
    return this.maxAge;
  }

  getExpiry() {
    return this.expires;
  }

  getKey() {
    return this.data.key
  }
}

module.exports = Cache;
