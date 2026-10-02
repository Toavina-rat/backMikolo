const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const getAllStocks = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    let queryText = 'SELECT * FROM inventory_items WHERE 1=1';
    const params = [];

    if (category && category !== 'Toutes les catégories') {
      params.push(category);
      queryText += ` AND LOWER(category) = LOWER($${params.length})`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      queryText += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(category) LIKE $${params.length})`;
    }

    queryText += ' ORDER BY id ASC';

    const result = await db.query(queryText, params);

    const stocks = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      dailyRate: parseFloat(row.daily_rate),
      availableStock: row.available_stock,
      totalStock: row.total_stock,
      imageUrl: row.image_url,
      createdAt: row.created_at,
    }));

    return successResponse(res, stocks, 'Liste des équipements récupérée');
  } catch (error) {
    next(error);
  }
};

const getStockById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM inventory_items WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Équipement non trouvé', 404);
    }

    const row = result.rows[0];
    const item = {
      id: row.id,
      name: row.name,
      category: row.category,
      dailyRate: parseFloat(row.daily_rate),
      availableStock: row.available_stock,
      totalStock: row.total_stock,
      imageUrl: row.image_url,
      createdAt: row.created_at,
    };

    return successResponse(res, item, 'Détails de l\'équipement');
  } catch (error) {
    next(error);
  }
};

const createStock = async (req, res, next) => {
  try {
    const { id, name, category, dailyRate, availableStock, totalStock, imageUrl } = req.body;

    if (!name || !category) {
      return errorResponse(res, 'Le nom et la catégorie sont requis', 400);
    }

    const itemId = id || `eq${Date.now()}`;

    const result = await db.query(
      `INSERT INTO inventory_items (id, name, category, daily_rate, available_stock, total_stock, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        itemId,
        name,
        category,
        dailyRate || 0,
        availableStock !== undefined ? availableStock : 1,
        totalStock !== undefined ? totalStock : 1,
        imageUrl || 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
      ]
    );

    return successResponse(res, result.rows[0], 'Équipement créé avec succès', 201);
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, dailyRate, availableStock, totalStock, imageUrl } = req.body;

    const check = await db.query('SELECT * FROM inventory_items WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return errorResponse(res, 'Équipement non trouvé', 404);
    }

    const result = await db.query(
      `UPDATE inventory_items SET
        name = COALESCE($1, name),
        category = COALESCE($2, category),
        daily_rate = COALESCE($3, daily_rate),
        available_stock = COALESCE($4, available_stock),
        total_stock = COALESCE($5, total_stock),
        image_url = COALESCE($6, image_url)
      WHERE id = $7
      RETURNING *`,
      [name, category, dailyRate, availableStock, totalStock, imageUrl, id]
    );

    return successResponse(res, result.rows[0], 'Équipement mis à jour avec succès');
  } catch (error) {
    next(error);
  }
};

const deleteStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM inventory_items WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Équipement non trouvé', 404);
    }

    return successResponse(res, null, 'Équipement supprimé avec succès');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
};
