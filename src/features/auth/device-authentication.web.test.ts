/// <reference types="jest" />

import {
  authenticateWithDevice,
  getDeviceAuthenticationCapability,
} from './device-authentication.web';

describe('web device authentication adapter', () => {
  it('discloses that browser access is not protected by biometrics', async () => {
    const capability = await getDeviceAuthenticationCapability();

    expect(capability).toEqual(expect.objectContaining({
      availability: 'available',
      kind: 'web',
      label: 'Continue on Web',
    }));
    expect(capability.description).toContain('not protected by device biometrics');
  });

  it('continues with an in-memory browser session', async () => {
    await expect(authenticateWithDevice()).resolves.toEqual({ success: true });
  });
});
