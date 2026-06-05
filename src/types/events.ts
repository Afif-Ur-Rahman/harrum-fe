type GenericPayload<T = Record<string, unknown>> = T | undefined;

type GenerictEvents = {
  [eventType: string]: GenericPayload;
};

export { type GenerictEvents, type GenericPayload };
