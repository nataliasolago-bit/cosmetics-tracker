const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');

// Registro de un nuevo usuario
async function registrar(req, res) {
    try {
        const { nombre, email, password, rol_id } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, email, password' });
        }

        // Verificar que el email no exista ya
        const existente = await Usuario.findOne({ where: { email } });
        if (existente) {
            return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
        }

        let rolFinal = rol_id;

        if (!rolFinal) {
            // Si no se especifica un rol (caso normal: registro público), se asigna "operario" por defecto
            const rolOperario = await Rol.findOne({ where: { nombre: 'operario' } });
            if (!rolOperario) {
                return res.status(500).json({ error: 'No se encontró el rol por defecto "operario"' });
            }
            rolFinal = rolOperario.id;
        } else {
            // Si se especifica un rol, verificamos que exista
            const rol = await Rol.findByPk(rolFinal);
            if (!rol) {
                return res.status(400).json({ error: 'El rol especificado no existe' });
            }
        }

        // Hashear la contraseña (nunca guardamos texto plano)
        const password_hash = await bcrypt.hash(password, 10);

        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password_hash,
            rol_id: rolFinal
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
