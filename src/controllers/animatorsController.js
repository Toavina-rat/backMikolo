const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const getAllAnimators = async (req, res, next) => {
  try {
    const { status, specialty, search } = req.query;

    let queryText = 'SELECT * FROM animators WHERE 1=1';
    const params = [];

    if (status && status !== 'Tous les statuts') {
      params.push(status.toLowerCase());
      queryText += ` AND LOWER(status) = $${params.length}`;
    }

    if (specialty && specialty !== 'Toutes spécialités') {
      params.push(`%${specialty.toLowerCase()}%`);
      queryText += ` AND LOWER(specialty) LIKE $${params.length}`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      queryText += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(specialty) LIKE $${params.length} OR LOWER(location) LIKE $${params.length})`;
    }

    queryText += ' ORDER BY id DESC';

    const result = await db.query(queryText, params);
    
    // Format response object fields for frontend compatibility
    const animators = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      specialty: row.specialty,
      role: row.role,
      dailyRate: parseFloat(row.daily_rate),
      rating: parseFloat(row.rating),
      experienceYears: row.experience_years,
      location: row.location,
      contact: row.contact,
      contactType: row.contact_type,
      status: row.status,
      statusTone: row.status_tone,
      avatarBg: row.avatar_bg,
      avatarText: row.avatar_text,
      avatar: row.avatar,
      createdAt: row.created_at,
    }));

    return successResponse(res, animators, 'Liste des animateurs récupérée');
  } catch (error) {
    next(error);
  }
};

const getAnimatorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM animators WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Animateur non trouvé', 404);
    }

    const row = result.rows[0];
    const animator = {
      id: row.id,
      name: row.name,
      specialty: row.specialty,
      role: row.role,
      dailyRate: parseFloat(row.daily_rate),
      rating: parseFloat(row.rating),
      experienceYears: row.experience_years,
      location: row.location,
      contact: row.contact,
      contactType: row.contact_type,
      status: row.status,
      statusTone: row.status_tone,
      avatarBg: row.avatar_bg,
      avatarText: row.avatar_text,
      avatar: row.avatar,
      createdAt: row.created_at,
    };

    return successResponse(res, animator, 'Détails de l\'animateur');
  } catch (error) {
    next(error);
  }
};

const createAnimator = async (req, res, next) => {
  try {
    const { name, specialty, role, dailyRate, rating, experienceYears, location, contact, contactType, status, statusTone, avatarBg, avatarText } = req.body;

    if (!name) {
      return errorResponse(res, 'Le nom de l\'animateur est requis', 400);
    }

    const result = await db.query(
      `INSERT INTO animators 
      (name, specialty, role, daily_rate, rating, experience_years, location, contact, contact_type, status, status_tone, avatar_bg, avatar_text)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        name,
        specialty || 'MC / Animation Corporate',
        role || 'Animateur',
        dailyRate || 350.00,
        rating || 5.0,
        experienceYears || 1,
        location || 'Paris',
        contact || 'contact@mikolo-events.fr',
        contactType || 'email',
        status || 'disponible',
        statusTone || 'green',
        avatarBg || 'bg-[#005459]',
        avatarText || name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      ]
    );

    const row = result.rows[0];
    return successResponse(res, row, 'Animateur créé avec succès', 201);
  } catch (error) {
    next(error);
  }
};

const updateAnimator = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, specialty, role, dailyRate, rating, experienceYears, location, contact, contactType, status, statusTone } = req.body;

    const checkResult = await db.query('SELECT * FROM animators WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return errorResponse(res, 'Animateur non trouvé', 404);
    }

    const current = checkResult.rows[0];

    const result = await db.query(
      `UPDATE animators SET
        name = COALESCE($1, name),
        specialty = COALESCE($2, specialty),
        role = COALESCE($3, role),
        daily_rate = COALESCE($4, daily_rate),
        rating = COALESCE($5, rating),
        experience_years = COALESCE($6, experience_years),
        location = COALESCE($7, location),
        contact = COALESCE($8, contact),
        contact_type = COALESCE($9, contact_type),
        status = COALESCE($10, status),
        status_tone = COALESCE($11, status_tone)
      WHERE id = $12
      RETURNING *`,
      [name, specialty, role, dailyRate, rating, experienceYears, location, contact, contactType, status, statusTone, id]
    );

    return successResponse(res, result.rows[0], 'Animateur mis à jour');
  } catch (error) {
    next(error);
  }
};

const deleteAnimator = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM animators WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Animateur non trouvé', 404);
    }

    return successResponse(res, null, 'Animateur supprimé avec succès');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAnimators,
  getAnimatorById,
  createAnimator,
  updateAnimator,
  deleteAnimator,
};
