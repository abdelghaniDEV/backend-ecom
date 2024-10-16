// cacheMiddleware.js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 }); // time in seconds

// Middleware check for cache
function checkCache(req, res, next) {
  const key = req.originalUrl;
  console.log(key)
  const cachedData = cache.get(key);

  let namereq = key.slice(5)
  if (cachedData) {
       return res.json({ status: "SUCCESS", data: { [namereq] : cachedData } });
  } else {
    next(); 
  }
}

// save the cached data
function setCache(key, data) {
  cache.set(key, data);
}
// delet the cash 
function deleteCache (key) {
    console.log('key delet',key)
    cache.del(key);
}

module.exports = { checkCache, setCache , deleteCache };
