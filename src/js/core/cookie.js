var Cookie = (function() {
  var
  get = function(cookieName) {
    var re = new RegExp('[; ]' + cookieName + '=([^\\s;]*)');
    var sMatch = (' ' + document.cookie).match(re);
    if (cookieName && sMatch) return sMatch[1];
    return '';
  },

  create = function(name, value, days) {
    days = days || 30;
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
    document.cookie = name + "=" + value + expires + "; path=/; domain="+ getDomain();
  },

  destroy = function(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain="+ getDomain();
  },

  userKey = function(size) {
    size = size || 25;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < size; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  },

  clearCookies = function() {
    Cookie.destroy(variantCookieName);
    Cookie.destroy(delayedCookieName);
    Cookie.destroy(filteredCookieName);
  },

  getDomain = function() {
    fullDomain = window.location.host.split('.');
    fullDomain.shift();
    return '.' + fullDomain.join('.');
  },

  name = function(testName, variantName, createdAt) {
    return "lind_" + testName + "_" + variantName + "_" + createdAt + "#" + userKey();
  };

  return {
    clear: clearCookies,
    get: get,
    create: create,
    update: create,
    destroy: destroy,
    name: name
  };
})();
