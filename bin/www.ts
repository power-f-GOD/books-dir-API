#!/usr/bin/env node
export const appRoutesList: RoutesConfig[] = [];

import _debug from 'debug';
import http from 'http';

import { RoutesConfig } from 'src/common';
import app from 'src/app';

// import { appRoutesList } from 'src/app';

const debug = _debug('books-dir-api:server');
const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', (error: { syscall: string; code: any }) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
});
server.on('listening', () => {
  const addr = server.address();

  appRoutesList.forEach((route) => {
    debug(route.name + ' configured (and ready for debugging)!');
    return route;
  });
  console.log('Server listens on port:', (addr as any)?.port);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
