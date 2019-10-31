describe('Cache', function(){
  const Cache = require('../src/cache')
  let cache = new Cache();

  afterEach(()=>{
    cache.reset();
  })


  it('it should set a cache node', ()=>{
    cache.set('a', 2);
    expect(cache.hashMap['a'].getValue()).toBe(2)
  });

  it('it shout get and set as recent', ()=>{
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.get('a');
    expect(cache.hashMap['a'].getValue()).toBe(1)
    expect(Object.keys(cache.hashMap)[1]).toBe('c')
  });

  it('it should reset the cache', ()=>{
    cache.reset()
    expect(cache.hashMap).toEqual({})
  });

  it('it should remove the cached item', ()=>{
    cache.set('b', 3);
    cache.remove('b');
    expect(cache.get('b')).toEqual(null)
  });
})
