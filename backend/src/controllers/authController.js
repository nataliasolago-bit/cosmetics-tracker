const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');

async function registrar(req, res) {
    try {
        const { nombre, email, password } = req.body;
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, email, password' });
        }
        const existente = await Usuario.findOne({ where: { email } });
        if (existente) return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
        // El registro público nunca acepta rol_id del solicitante.
        const rolOperario = await Rol.findOne({ where: { nombre: 'operario' } });
        if (!rolOperario) return res.status(500).json({ error: 'No existe el rol operario' });
        const password_hash = await bcrypt.hash(password, 10);
        const nuevoUsuario = await Usuario.create({
            nombre, email, password_hash, rol_id: rolOperario.id
        });
        const { password_hash: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();
        res.status(201).json(usuarioSinPassword);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email y password son obligatorios' });
        const usuario = await Usuario.findOne({where:{email},include:Rol});
        if (!usuario || !await bcrypt.compare(password, usuario.password_hash))
            return res.status(401).json({ error: 'Credenciales inválidas' });
        const token = jwt.sign(
            {id:usuario.id,email:usuario.email,rol:usuario.Rol.nombre},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES_IN || '1d'}
        );
        res.json({token,usuario:{id:usuario.id,nombre:usuario.nombre,email:usuario.email,rol:usuario.Rol.nombre}});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}
module.exports = {registrar,login};
