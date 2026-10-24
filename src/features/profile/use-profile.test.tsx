import React from 'react';

import { getLocalUserProfile, saveLocalProfile, type UserRow } from '@/db';
import { useProfile } from './use-profile';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { act, create } = require('react-test-renderer');
let mockFocusVersion = 0;

jest.mock('expo-router', () => ({
  useFocusEffect: (effect: () => void) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('react').useEffect(effect, [effect, mockFocusVersion]);
  },
}));
jest.mock('@/db', () => ({
  ...jest.requireActual('@/db'),
  initializeLocalDatabase: jest.fn().mockResolvedValue({}),
  getLocalUserProfile: jest.fn(),
  getLatestBodyMeasurement: jest.fn().mockResolvedValue(null),
  saveLocalProfile: jest.fn(),
}));

const user: UserRow = {
  user_id: 'local-user', username: 'Daniel', theme_preference: 'system', email: null, dob: null, height: null,
  height_unit: 'cm', weight_unit: 'kg', speed_unit: 'kmh', distance_unit: 'km', created_at: 'now', updated_at: 'now',
};
let profile: ReturnType<typeof useProfile>;
function Probe() {
  const value = useProfile();
  React.useEffect(() => { profile = value; });
  return null;
}

beforeEach(() => {
  mockFocusVersion = 0;
  jest.clearAllMocks();
  jest.mocked(getLocalUserProfile).mockResolvedValue(user);
  jest.mocked(saveLocalProfile).mockResolvedValue(user);
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
});

test('starts clean, preserves unsaved edits on refocus, and returns to a clean state after save', async () => {
  let root: ReturnType<typeof create>;
  await act(async () => { root = create(<Probe />); });
  expect(profile.hasLoaded).toBe(true);
  expect(profile.hasChanges).toBe(false);
  await act(async () => { await profile.save(); });
  expect(saveLocalProfile).not.toHaveBeenCalled();

  await act(async () => { profile.setField('username', 'Dani'); });
  expect(profile.hasChanges).toBe(true);
  mockFocusVersion += 1;
  await act(async () => { root.update(<Probe />); });
  expect(profile.draft.username).toBe('Dani');
  expect(getLocalUserProfile).toHaveBeenCalledTimes(1);

  await act(async () => { await profile.save(); });
  expect(saveLocalProfile).toHaveBeenCalledWith({}, expect.objectContaining({ username: 'Dani', currentWeightKg: undefined }));
  expect(profile.hasChanges).toBe(false);
  expect(profile.success).toBe('Changes saved.');
  await act(async () => { root.unmount(); });
});

test('blocks duplicate saves and edits while a write is pending', async () => {
  let root: ReturnType<typeof create>;
  await act(async () => { root = create(<Probe />); });
  await act(async () => { profile.setField('weight', '75'); });
  let finish!: (value: UserRow) => void;
  jest.mocked(saveLocalProfile).mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
  let write!: Promise<void>;
  await act(async () => { write = profile.save(); });
  expect(profile.isSaving).toBe(true);
  await act(async () => { await profile.save(); profile.setField('weight', '80'); });
  expect(saveLocalProfile).toHaveBeenCalledTimes(1);
  expect(profile.draft.weight).toBe('75');
  await act(async () => { finish(user); await write; });
  expect(profile.hasChanges).toBe(false);
  expect(profile.isSaving).toBe(false);
  await act(async () => { root.unmount(); });
});

test('a failed save keeps edits available for retry', async () => {
  let root: ReturnType<typeof create>;
  await act(async () => { root = create(<Probe />); });
  await act(async () => { profile.setField('username', 'Dani'); });
  jest.mocked(saveLocalProfile).mockRejectedValueOnce(new Error('Unable to save'));
  await act(async () => { await profile.save(); });
  expect(profile.hasChanges).toBe(true);
  expect(profile.draft.username).toBe('Dani');
  expect(profile.error).toBe('Unable to save');
  await act(async () => { await profile.save(); });
  expect(profile.error).toBeNull();
  expect(profile.hasChanges).toBe(false);
  await act(async () => { root.unmount(); });
});

test('load failure offers a retry before enabling profile edits', async () => {
  jest.mocked(getLocalUserProfile).mockRejectedValueOnce(new Error('Unable to load'));
  let root: ReturnType<typeof create>;
  await act(async () => { root = create(<Probe />); });
  expect(profile.hasLoaded).toBe(false);
  expect(profile.isLoading).toBe(false);
  await act(async () => { profile.setField('username', 'Cannot edit yet'); });
  expect(profile.draft.username).toBe('');
  await act(async () => { profile.retry(); });
  expect(profile.hasLoaded).toBe(true);
  expect(profile.draft.username).toBe('Daniel');
  expect(profile.error).toBeNull();
  await act(async () => { root.unmount(); });
});
