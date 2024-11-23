export const sendToDevice = (message: string) => {
  // @ts-expect-error WebviewCommunicator can be undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window.WebviewCommunicator as any)?.postMessage(message);
};
