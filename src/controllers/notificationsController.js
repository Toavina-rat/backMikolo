const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const getAllNotifications = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM notifications ORDER BY created_at DESC');
    return successResponse(res, result.rows, 'Notifications récupérées');
  } catch (error) {
    next(error);
  }
};

const createNotification = async (req, res, next) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !message) {
      return errorResponse(res, 'Le titre et le message sont requis', 400);
    }

    const result = await db.query(
      'INSERT INTO notifications (title, message, type) VALUES ($1, $2, $3) RETURNING *',
      [title, message, type || 'info']
    );

    return successResponse(res, result.rows[0], 'Notification créée', 201);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Notification non trouvée', 404);
    }

    return successResponse(res, result.rows[0], 'Notification marquée comme lue');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllNotifications,
  createNotification,
  markAsRead,
};
