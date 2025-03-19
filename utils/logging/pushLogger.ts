import debug from 'debug';

export const pushLogger = {
  connection: debug('push:connection'),
  updates: debug('push:updates'),
  errors: debug('push:errors')
};