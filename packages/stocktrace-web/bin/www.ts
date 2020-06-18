#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app';
import createDebug from 'debug';
import http from 'http';
import {closeScheduler, initScheduler} from 'stocktrace-ocr';

const debug = createDebug('stocktrace-web:server');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

(async () => {
  await initScheduler();

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
  server.on('close', async () => {
    await closeScheduler();
  });

  process.on('SIGINT', function() {
    server.close();
  });
})()

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): string|number|boolean {
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

/**
 * Event listener for HTTP server "error" event.
 */

type ServerError = Error & {
  syscall: string;
  code: string;
}

function onError(error: ServerError) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address()!;
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
