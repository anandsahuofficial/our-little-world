const CACHE = 'our-little-world-v4';
const ASSETS = [
  '.',
  'index.html',
  'manifest.json',
  'src/main.js',
  'src/scenes/BootScene.js',
  'src/scenes/WorldScene.js',
  'src/scenes/UIScene.js',
  'src/entities/Player.js',
  'src/entities/Moo.js',
  'src/entities/Duck.js',
  'src/audio/SoundEngine.js',
  'src/data/gameState.js',
  'https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      });
    })
  );
});
