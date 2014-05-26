/**
 * This file defines API calls to server to fetch images from the search query.
 */

var SearchAPI = function () {
  var API_URL = 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&start=0&rsz=8&q=';

  return search;

  function search(query, callback) {
    var url = API_URL+encodeURIComponent(query);
    jsonp(url, function (data) {
      if ( !data ) {
        callback();
        return;
      }
      if (data.responseStatus !== 200) {
        callback();
        return;
      }

      var images = [];
      try {
        data.responseData.results.forEach(function (result) {
          images.push({
            height : result.height,
            width  : result.width,
            url    : result.url
          });
        });
      } catch (err) {
        callback();
        return;
      }
      callback(images);
    });
  }

  function jsonp(url, callback) {
    var callbackName = ('x'+Math.random()).replace(/[\-\.]/g,'');
    if (url.indexOf('?') === -1) {
      url += '?';
    } else {
      url += '&';
    }
    url += 'callback='+callbackName;

    window[callbackName] = finish;
    var timeout = setTimeout(function () {
      finish();
    }, 25*1000);

    var script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = url;
    document.documentElement.appendChild(script);

    function finish(data) {
      clearTimeout(timeout);
      delete window[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (callback) {
        callback(data);
        callback = null;
      }
    }
  }
}();
