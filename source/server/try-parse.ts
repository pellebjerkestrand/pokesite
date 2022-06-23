export const tryParse = (input: string) => {
  try {
    return JSON.parse(input);
  } catch {
    return;
  }
};
