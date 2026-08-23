const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');

// Registro de un nuevo usuario
async function registrar(req, res) {
    try {
        const { nombre, email, password, rol_id } = req.body;

        if (!nombre || !email || !password || !rol_id) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, email, password, rol_id' });
        }

        // Verificar que el email no exista ya
        const existente = await Usuario.findOne({ where: { email } });
        if (existente) {
            return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
        }

        // Verificar que el rol exista
        const rol = await Rol.findByPk(rol_id);
        if (!rol) {
            return res.status(400).json({ error: 'El rol especificado no existe' });
        }

        // Hashear la contraseña (nunca guardamos texto plano)
        const password_hash = await bcrypt.hash(password, 10);

        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password_hash,
            rol_id
        });

        // No devolvemos el password_hash en la respuesta
        const { password_hash: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();

        res.status(201).json(usuarioSinPassword);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
}

// Login
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y password son obligatorios' });
        }

        const usuario = await Usuario.findOne({
            where: { email },
            include: Rol
        });

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.Rol.nombre
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        res.json({
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.Rol.nombre
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}

module.exports = {
    registrar,
    login
};
