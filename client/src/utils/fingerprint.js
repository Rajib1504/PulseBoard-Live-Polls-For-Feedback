import fpPromise from '@fingerprintjs/fingerprintjs';

export const getDeviceId = async () => {
      const fp = await fpPromise.load();// from here we will get the visitorsId
      const result = await fp.get();
      return result.visitorId;
};