// 缓存名称和版本
const CACHE_NAME = 'wallet-app-v1';

// 需要缓存的资源列表
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// 安装Service Worker并缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活Service Worker并清理旧缓存
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 拦截网络请求并从缓存中响应
self.addEventListener('fetch', event => {
  // 获取请求URL
  const requestUrl = new URL(event.request.url);
  
  // 检查是否是API请求
  if (requestUrl.pathname.startsWith('/api/')) {
    // 对于API请求，优先使用网络，网络失败时才使用缓存（网络优先策略）
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // 克隆响应用于缓存
          const responseToCache = response.clone();
          
          // 更新缓存
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          // 网络请求失败时，尝试从缓存获取
          return caches.match(event.request);
        })
    );
  } else {
    // 对于非API请求，优先使用缓存，缓存不存在时才使用网络（缓存优先策略）
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // 如果在缓存中找到响应，则返回缓存的响应
          if (response) {
            return response;
          }
          
          // 否则发起网络请求
          return fetch(event.request).then(response => {
            // 检查是否是有效的响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 克隆响应，因为响应是流，只能使用一次
            const responseToCache = response.clone();
            
            // 将响应添加到缓存
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
        })
    );
  }
});