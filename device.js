let canvas;
let gl;
let glRenderer;
let models;
const devices = {
  'PowerVR SGX 543': {
    1136: ['iPhone 5', 'iPhone 5c'],
  },
  'Apple A7 GPU': {
    1136: ['iPhone 5s'],
    2048: ['iPad Air', 'iPad Mini 2', 'iPad Mini 3'],
  },
  'Apple A8 GPU': {
    1136: ['iPod touch (6th generation)'],
    1334: ['iPhone 6'],
    2208: ['iPhone 6 Plus'],
    2048: ['iPad Air 2', 'iPad Mini 4'],
  },
  'Apple A9 GPU': {
    1136: ['iPhone SE'],
    1334: ['iPhone 6s'],
    2208: ['iPhone 6s Plus'],
    2224: ['iPad Pro (9.7-inch)'],
    2732: ['iPad Pro (12.9-inch)'],
  },
  'Apple A10 GPU': {
    1334: ['iPhone 7'],
    2208: ['iPhone 7 Plus'],
  },
  'Apple A11 GPU': {
    1334: ['iPhone 8'],
    2208: ['iPhone 8 Plus'],
    2436: ['iPhone X'],
  },
  'Apple A12 GPU': {
    2436: ['iPhone XS'],
    2688: ['iPhone XS Max'],
    1792: ['iPhone XR'],
  },
};

function getCanvas() {
  if (canvas == null) {
    canvas = document.createElement('canvas');
  }

  return canvas;
}

function getGl() {
  if (gl == null) {
    gl = getCanvas().getContext('experimental-webgl');
  }

  return gl;
}

function getScreenWidth() {
  return Math.max(window.screen.width, window.screen.height) * (window.devicePixelRatio || 1);
}
function getScreenHeight() {
  return Math.min(window.screen.width, window.screen.height) * (window.devicePixelRatio || 1);
}
const getGlRenderer = () => {
  if (glRenderer == null) {
    const debugInfo = getGl().getExtension('WEBGL_debug_renderer_info');
    glRenderer = debugInfo == null ? 'unknown' : getGl().getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  }

  return glRenderer;
};

const getIosModels = () => {
  if (models == null) {
    const device = devices[getGlRenderer()];

    if (device === undefined) {
      models = ['unknown'];
    } else {
      models = device[getScreenWidth()];

      if (models === undefined) {
        models = ['unknown'];
      }
    }
  }
  return models;
};

// 屏幕分辨率
const getScreen = () => {
  return `${getScreenWidth()} * ${getScreenHeight()}`;
};

const getModelAndOS = () => {
  // 获取用户代理
  const ua = navigator.userAgent;
  const devInfo = ua.substring(ua.indexOf("(") + 1, ua.indexOf(")"))
  const info = { os: 'unknown', model: 'unknown' };
  if (devInfo.indexOf('Windows NT 5.1') !== -1) return { os: 'Windows XP', model: 'unknown' };
  if (devInfo.indexOf('Windows NT 6.0') !== -1) return { os: 'Windows Vista', model: 'unknown' };
  if (devInfo.indexOf('Windows NT 6.1') !== -1) return { os: 'Windows 7', model: 'unknown' };
  if (devInfo.indexOf('Windows NT 6.2') !== -1) return { os: 'Windows 8', model: 'unknown' };
  if (devInfo.indexOf('Windows NT 6.3') !== -1) return { os: 'Windows 8.1', model: 'unknown' };
  if (devInfo.indexOf('Windows NT 10.0') !== -1) return { os: 'Windows 10', model: 'unknown' };
  if (devInfo.indexOf('iPhone') !== -1) {
    const index = devInfo.indexOf('CPU');
    const index1 = devInfo.indexOf(' like');
    info.os = devInfo.slice(index + 3, index1);
    info.model = getIosModels().join(',');
    return info;
  }

  if (devInfo.indexOf('iPad') !== -1) return { os: 'iPad', model: 'iPad' };
  if (devInfo.indexOf('Linux') !== -1) {
    info.os = 'Linux';
    const index = devInfo.indexOf('Android');
    if (index !== -1) {
      const infoArr = devInfo.split('; ');
      // os以及版本
      [, info.os] = infoArr;
      // 手机型号
      info.model = infoArr[infoArr.length - 1].replace(' Build');
      return info;
    } else {
      return info;
    }
  }
  if (devInfo.indexOf('Macintosh') !== -1) {
    const index = devInfo.indexOf('Macintosh');
    if (index !== -1) {
      const index1 = devInfo.lastIndexOf('; ');
      info.model = devInfo.slice(index, index1);
      const index2 = devInfo.indexOf(') ');
      info.os = devInfo.slice(index1 + 2, index2);
      return info;
    }
  }

  return info;
};

const getDeviceInfo = () => {
  const deviceInfo = getModelAndOS();
  const { os } = deviceInfo;
  deviceInfo.gpu = getGlRenderer();
  deviceInfo.resolution = getScreen();
  deviceInfo.isMobile = !!os.match(/Android|iPhone|iPad|iPod/i);
  return deviceInfo;
};

export const deviceInfo = getDeviceInfo();

export default {
  deviceInfo,
};
