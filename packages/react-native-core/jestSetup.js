'use strict';

const MockNativeMethods = {
  Brightness: {
    getBrightness: jest.fn(),
    setBrightness: jest.fn(),
    getSystemBrightness: jest.fn(),
  },
  Core: {
    initialLocalization: jest.fn(),
    SUPPORTED_ABIS: jest.fn(),
    isAppInstalled: jest.fn(),
    openDownloadManager: jest.fn(),
    getAction: jest.fn(),
    exitApp: jest.fn(),
    getCountry: jest.fn(),
    getLocales: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  Files: {
    openFolder: jest.fn(),
    getRealPathFromSaf: jest.fn(),
    getUriPermission: jest.fn(),
    removeUriPermission: jest.fn(),
  },
  Notification: {
    notify: jest.fn(),
    cancel: jest.fn(),
    cancelAll: jest.fn(),
    PRIORITY_DEFAULT: jest.fn(),
    PRIORITY_HIGH: jest.fn(),
    PRIORITY_LOW: jest.fn(),
    PRIORITY_MAX: jest.fn(),
    PRIORITY_MIN: jest.fn(),
    VISIBILITY_PRIVATE: jest.fn(),
    VISIBILITY_PUBLIC: jest.fn(),
    VISIBILITY_SECRET: jest.fn(),
  },
  Safetynet: {
    isGooglePlayServicesAvailable: jest.fn(),
    getVerification: jest.fn(),
    verifyWithRecaptcha: jest.fn(),
  },
};

module.exports = MockNativeMethods;
