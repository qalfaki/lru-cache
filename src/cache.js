const CacheManger = require('./cacheManager.js');

class Cache extends CacheManger {

  constructor(limit=Infinity, maxAge=Infinity, stale=false, hashMap={}) {
    super()
    this.size = 0;
    this.limit = limit;
    this.maxAge = maxAge;
    this.stale = stale;
    this.hashMap = hashMap;
    this.head = null;
    this.tail = null;
  }

  setHead(node) {
    node.next = this.head;
    node.previous = null;
    if (this.head !== null)
      this.head.previous = node;
      this.head = node;
      if (this.tail === null) {
        this.tail = node;
      }
      this.size += 1;
      this.hashMap[node.data.key] = node;
  }

  setCache(cache) {
    //TODO: implement
  }

  set(key, value, maxAge) {
    maxAge = parseInt(maxAge) ? maxAge : this.maxAge;
    const node = new Node(key, value, maxAge, Date.now() + maxAge);
    if (this.size >= this.limit) {
        delete this.hashMap[this.tail.data.key];
        this.size -= 1;
        this.tail = this.tail.previous;
        this.tail.next = null;
    }
    this.setHead(node);
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
    this.size -= 1;
    this.publish({action: 'remove', data: {key}})
  }

  get(key) {
    const oldNode = this.hashMap[key];
    if (oldNode) {
      const value = oldNode.getValue();
      const nodeMaxAge = oldNode.getMaxAge();
      const maxAge = parseInt(nodeMaxAge) ? nodeMaxAge : this.maxAge;
      if (Date.now() >= oldNode.getExpiry()) {
        this.remove(key);
        return this.stale ? oldNode.getValue() : null;
      }
      const newNode = new Node(key, value, maxAge, Date.now() + maxAge);
      this.remove(key);
      this.setHead(newNode);
      return value
    }
    return null
  }

  peek(key) {
    return this.hashMap[key] ? this.hashMap[key].getValue() : null
  }

  reset() {
    this.size = 0;
    this.hashMap = {};
    this.head = null;
    this.tail = null;
    this.publish({action: 'reset'})
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

  getSize() {
    return this.size
  }

  delete(key) {
    this.remove(key)
  }
}


// double linked list

class Node {

  constructor(key, value, maxAge=Infinity, expires=Infinity) {
    if ([key, value].includes(undefined))
      throw new Error(`${[key, value].indexOf(undefined) == 0 ? 'key': 'value'} not provided`);

    this.data = {key, value};
    this.previous = null;
    this.next = null;
    this.maxAge = maxAge;
    this.expires = Infinity;
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
