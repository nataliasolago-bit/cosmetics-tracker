const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = f => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8');

test('el registro público no acepta rol_id del cuerpo', () => {
 const s = read('controllers/authController.js');
 assert.doesNotMatch(s, /const\s*\{[^}]*\brol_id\b[^}]*\}\s*=\s*req\.body/);
 assert.match(s, /rolOperario\.id/);
});
test('los movimientos usan transacción y usuario autenticado', () => {
 const s=read('controllers/movimientoController.js');
 assert.match(s,/sequelize\.transaction/);
 assert.match(s,/usuario_id\s*:\s*req\.usuario\.id/);
 assert.match(s,/transaction\.LOCK\.UPDATE/);
});
test('la creación de lote usa transacción',()=>{
 assert.match(read('controllers/loteController.js'),/sequelize\.transaction/);
});
test('las rutas de reportes requieren token',()=>{
 assert.match(read('routes/reporteRoutes.js'),/router\.use\(verificarToken\)/);
});
