const CacheManger = require('./cacheManager.js');

class Cache {

  constructor(limit, maxAge, stale, brokerURL) {
    this.size = 0;
    this.limit = parseInt(limit) ? limit : Infinity;
    this.maxAge = parseInt(maxAge) ? maxAge : Infinity;
    this.stale = typeof stale === 'boolean' ? stale : false;
    this.hashMap = {};
    this.head = null;
    this.tail = null;
    this.CacheManger = new CacheManger(brokerURL);
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
    this.CacheManger.publish({action: 'set', key, value})

  }

  remove(node) {
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
    delete this.hashMap[node.getKey()];
    this.size -= 1;
    this.CacheManger.publish({action: 'remove', node})
  }

  get(key) {
    const oldNode = this.hashMap[key];
    if (oldNode) {
      const value = oldNode.getValue();
      const nodeMaxAge = oldNode.getMaxAge();
      const maxAge = parseInt(nodeMaxAge) ? nodeMaxAge : this.maxAge;
      if (Date.now() >= oldNode.getExpiry()) {
        this.remove(oldNode);
        return this.stale ? oldNode.getValue() : null;
      }
      const newNode = new Node(key, value, maxAge, Date.now() + maxAge);
      this.remove(oldNode);
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
    this.CacheManger.publish({action: 'reset'})
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
    const node = this.hashMap[key];
    this.remove(node)
  }
}


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
