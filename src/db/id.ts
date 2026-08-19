export function createLocalId(prefix: string): string {
  const randomPart = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (marker) => {
    const value = Math.floor(Math.random() * 16);
    const nibble = marker === 'x' ? value : (value & 0x3) | 0x8;

    return nibble.toString(16);
  });

  return `${prefix}_${randomPart}`;
}
