const CacheManger = require('./cacheManager.js');

class Cache extends CacheManger {

  constructor(maxAge=Infinity) {
    super()
    this.maxAge = maxAge;
    this.hashMap = {};
    this.head = null;
    this.tail = null;
    // clear the cache once its expires
    setTimeout(()=>this.reset(), this.maxAge === Infinity ? 0: this.maxAge);
  }

  set(key, value) {
    const node = new Node(key, value);
    if (Object.keys(this.hashMap).length) {
        this.tail.next = node;
        node.previous = this.tail;
        this.tail = node;
    }
    else {
      this.head = node;
      this.tail = node;
    }
    this.hashMap[node.data.key] = node;
    this.publish({action: 'set', data: {key, value}})
  }

  remove(key) {
    let node = this.hashMap[key];
    if (node.previous !== null) {
      node.previous.next = node.next;
    } else {
      this.head = node.next;
    }
    if (node.next !== null) {
      node.next.previous = node.previous;
    } else {
      this.tail = node.previous;
    }
    delete this.hashMap[key];
  }

  get(key) {
    const oldNode = this.hashMap[key];
    if (oldNode) {
      this.remove(key);
      this.set(oldNode.getKey(), oldNode.getValue());
      return oldNode.value
    }
    return null
  }

  peek(key) {
    return this.hashMap[key] ? this.hashMap[key].getValue() : null
  }

  reset() {
    this.hashMap = {};
    this.head = null;
    this.tail = null;
  }

  toArray() {
    const arr = [];
    let node = this.head;
    while (node) {
      arr.push({
        key: node.getKey(),
        value: node.getValue()
      });
      node = node.next;
    }
    return arr;
  }

  has(key) {
    return !!this.hashMap[key];
  }

  forEach(callback) {
    let node = this.head;
    let i = 0;
    while (node) {
      callback.apply(this, [node.getKey(), node.getValue(), i]);
      i++;
      node = node.next;
    }
  }
}


// double linked list
class Node {

  constructor(key, value) {
    if ([key, value].includes(undefined))
      throw new Error(`${[key, value].indexOf(undefined) == 0 ? 'key': 'value'} not provided`);

    this.data = {key, value};
    this.previous = null;
    this.next = null;
  }

  getValue() {
    return this.data.value;
  }

  getKey() {
    return this.data.key
  }
}

module.exports = Cache;
