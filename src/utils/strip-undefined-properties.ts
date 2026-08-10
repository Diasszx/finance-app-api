export function stripUndefinedProperties<TInput extends object>(
  input: TInput,
): { [TKey in keyof TInput]: Exclude<TInput[TKey], undefined> } {
  const entriesWithValue = Object.entries(input).filter(([, value]) => value !== undefined);

  return Object.fromEntries(entriesWithValue) as {
    [TKey in keyof TInput]: Exclude<TInput[TKey], undefined>;
  };
}
