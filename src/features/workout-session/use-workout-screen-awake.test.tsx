import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useWorkoutScreenAwake } from "./use-workout-screen-awake";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { act, create } = require("react-test-renderer");
jest.mock("expo-keep-awake", () => ({
  activateKeepAwakeAsync: jest.fn().mockResolvedValue(undefined),
  deactivateKeepAwake: jest.fn().mockResolvedValue(undefined),
}));
function Probe({ enabled }: { enabled: boolean }) {
  useWorkoutScreenAwake(enabled);
  return null;
}
beforeEach(() => {
  jest.clearAllMocks();
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

test("only acquires while enabled and releases on disable and unmount", async () => {
  let root: ReturnType<typeof create>;
  await act(async () => {
    root = create(<Probe enabled={false} />);
  });
  expect(activateKeepAwakeAsync).not.toHaveBeenCalled();
  await act(async () => {
    root.update(<Probe enabled />);
  });
  const tag = jest.mocked(activateKeepAwakeAsync).mock.calls[0][0];
  await act(async () => {
    root.update(<Probe enabled={false} />);
  });
  expect(deactivateKeepAwake).toHaveBeenCalledWith(tag);
  await act(async () => {
    root.update(<Probe enabled />);
  });
  const nextTag = jest.mocked(activateKeepAwakeAsync).mock.calls[1][0];
  expect(nextTag).not.toBe(tag);
  await act(async () => {
    root.unmount();
  });
  expect(deactivateKeepAwake).toHaveBeenCalledWith(nextTag);
});

test("releases a late activation without releasing the newer workout lock", async () => {
  let resolve!: () => void;
  jest.mocked(activateKeepAwakeAsync).mockImplementationOnce(
    () =>
      new Promise<void>((done) => {
        resolve = done;
      }),
  );
  let root: ReturnType<typeof create>;
  await act(async () => {
    root = create(<Probe enabled />);
  });
  const oldTag = jest.mocked(activateKeepAwakeAsync).mock.calls[0][0];
  await act(async () => {
    root.update(<Probe enabled={false} />);
  });
  await act(async () => {
    root.update(<Probe enabled />);
  });
  const newTag = jest.mocked(activateKeepAwakeAsync).mock.calls[1][0];
  jest.mocked(deactivateKeepAwake).mockClear();
  await act(async () => {
    resolve();
  });
  expect(deactivateKeepAwake).toHaveBeenCalledWith(oldTag);
  expect(deactivateKeepAwake).not.toHaveBeenCalledWith(newTag);
  await act(async () => {
    root.unmount();
  });
});

test("unsupported wake locks fail without throwing", async () => {
  jest
    .mocked(activateKeepAwakeAsync)
    .mockRejectedValueOnce(new Error("Unsupported"));
  let root: ReturnType<typeof create>;
  await act(async () => {
    root = create(<Probe enabled />);
  });
  await act(async () => {
    root.unmount();
  });
});
