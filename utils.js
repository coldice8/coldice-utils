// refers: https://www.sitepoint.com/get-url-parameters-with-javascript/
export function getUrlParams(url = window.location.href) {
  const d = decodeURIComponent;
  let queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  const obj = {};
  if (queryString) {
    queryString = queryString.split('#')[0]; // eslint-disable-line
    const arr = queryString.split('&');
    for (let i = 0; i < arr.length; i += 1) {
      const a = arr[i].split('=');
      let paramNum;
      const paramName = a[0].replace(/\[\d*\]/, (v) => {
        paramNum = v.slice(1, -1);
        return '';
      });
      const paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
      if (obj[paramName]) {
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = d([obj[paramName]]);
        }
        if (typeof paramNum === 'undefined') {
          obj[paramName].push(d(paramValue));
        } else {
          obj[paramName][paramNum] = d(paramValue);
        }
      } else {
        obj[paramName] = d(paramValue);
      }
    }
  }
  return obj;
}

export function isExternal(url) {
  const host = window.location.hostname;

  const linkHost = (url => {
    if (/^https?:\/\//.test(url)) { // Absolute URL.
      // The easy way to parse an URL, is to create <a> element.
      // @see: https://gist.github.com/jlong/2428561
      const parser = document.createElement('a');
      parser.href = url;

      return parser.hostname;
    }
    else { // Relative URL.
      return window.location.hostname;
    }
  })(url);

  return host !== linkHost;
}

/**
 * 格式化时分秒
 * @param result
 * @returns {string}
 */
export function formatSecond(result) {
  const h = Math.floor((result / 3600) % 24);
  const m = Math.floor((result / 60) % 60);
  const s = Math.floor(result % 60);
  result = s + "秒";
  if (m > 0) {
    result = m + "分" + result;
  }
  if (h > 0) {
    result = h + "小时" + result;
  }

  return result;
}
