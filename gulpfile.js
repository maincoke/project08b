/** Cargador de Servidores de Vista (HTTP) y Datos(Servicios REST) para la Tienda Online */
const { parallel } = require('gulp');
const exec = require('child_process').exec;

function runDataServer() {
  return exec('cd server && node start.js');
}

function runViewServer() {
  return exec('npm run start');
}

exports.default = parallel(runDataServer, runViewServer);
