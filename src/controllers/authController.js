const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

const ALLOWED_ROLES = ['admin', 'superviseur', 'resp'];

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name) {
      return errorResponse(res, 'Le nom, l\'email et le mot de passe sont requis.', 400);
    }

    const userRole = role ? role.toLowerCase() : 'resp';

    if (!ALLOWED_ROLES.includes(userRole)) {
      return errorResponse(res, `Rôle invalide '${role}'. Rôles valides : [${ALLOWED_ROLES.join(', ')}]`, 400);
    }

    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return errorResponse(res, 'Un utilisateur avec cet email existe déjà.', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name, email, passwordHash, userRole]
    );

    const user = result.rows[0];
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return successResponse(res, { user, token }, 'Compte créé avec succès', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Veuillez fournir un email et un mot de passe.', 400);
    }

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return errorResponse(res, 'Identifiants invalides.', 401);
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return errorResponse(res, 'Identifiants invalides.', 401);
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    };

    return successResponse(res, { user: userProfile, token }, 'Connexion réussie');
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Utilisateur non trouvé.', 404);
    }

    return successResponse(res, result.rows[0], 'Profil utilisateur récupéré');
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY id ASC');
    return successResponse(res, result.rows, 'Liste des comptes utilisateurs');
  } catch (error) {
    next(error);
  }
};

/**
 * Création de compte par un 'resp' ou 'admin'.
 * - Un 'resp' ne peut créer que des comptes 'superviseur'.
 * - Un 'admin' peut créer tout type de compte.
 */
const createUserByResp = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const creatorRole = req.user.role;

    if (!email || !password || !name) {
      return errorResponse(res, 'Le nom, l\'email et le mot de passe sont requis.', 400);
    }

    const targetRole = role ? role.toLowerCase() : 'superviseur';

    if (!ALLOWED_ROLES.includes(targetRole)) {
      return errorResponse(res, `Rôle invalide '${role}'. Rôles valides : [${ALLOWED_ROLES.join(', ')}]`, 400);
    }

    // Un 'resp' ne peut créer que des comptes 'superviseur'
    if (creatorRole === 'resp' && targetRole !== 'superviseur') {
      return errorResponse(
        res,
        `En tant que Responsable, vous ne pouvez créer que des comptes de type 'superviseur'. Vous avez tenté de créer un compte '${targetRole}'.`,
        403
      );
    }

    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return errorResponse(res, 'Un utilisateur avec cet email existe déjà.', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name, email, passwordHash, targetRole]
    );

    const user = result.rows[0];
    return successResponse(res, { user }, `Compte '${targetRole}' créé avec succès par ${creatorRole}`, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Suppression de compte — par admin ou resp.
 * - Un 'resp' ne peut supprimer que des comptes 'superviseur'.
 * - Un 'admin' peut supprimer tout compte sauf lui-même.
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleterId = req.user.id;
    const deleterRole = req.user.role;

    if (parseInt(id) === deleterId) {
      return errorResponse(res, 'Vous ne pouvez pas supprimer votre propre compte.', 400);
    }

    const targetResult = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);
    if (targetResult.rows.length === 0) {
      return errorResponse(res, 'Utilisateur non trouvé.', 404);
    }

    const targetUser = targetResult.rows[0];

    // Un 'resp' ne peut supprimer que des comptes 'superviseur'
    if (deleterRole === 'resp' && targetUser.role !== 'superviseur') {
      return errorResponse(
        res,
        `En tant que Responsable, vous ne pouvez supprimer que des comptes 'superviseur'.`,
        403
      );
    }

    await db.query('DELETE FROM users WHERE id = $1', [id]);
    return successResponse(res, { deletedUser: targetUser }, `Compte '${targetUser.name}' supprimé avec succès.`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  getAllUsers,
  createUserByResp,
  deleteUser,
  ALLOWED_ROLES,
};

