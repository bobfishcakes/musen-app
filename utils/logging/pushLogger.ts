import debug from 'debug';

export const pushLogger = {
  connection: debug('push:connection'),
  updates: debug('push:updates'),
  errors: debug('push:errors'),
  info: debug('push:info'),
  error: debug('push:error'),
  warn: debug('push:warn'),
  debug: debug('push:debug')
};

// Export types for TypeScript
export type PushLogger = typeof pushLogger;