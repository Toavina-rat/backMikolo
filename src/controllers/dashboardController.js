const db = require('../config/db');
const { successResponse } = require('../utils/response');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalAnimatorsRes = await db.query('SELECT COUNT(*) FROM animators');
    const availableAnimatorsRes = await db.query("SELECT COUNT(*) FROM animators WHERE LOWER(status) = 'disponible'");
    
    const totalEventsRes = await db.query('SELECT COUNT(*) FROM events');
    const activeEventsRes = await db.query("SELECT COUNT(*) FROM events WHERE status = 'confirme'");
    
    const totalBudgetRes = await db.query('SELECT SUM(budget) FROM events');

    const totalEquipmentRes = await db.query('SELECT COUNT(*) FROM inventory_items');
    const lowStockEquipmentRes = await db.query('SELECT COUNT(*) FROM inventory_items WHERE available_stock <= 3');

    const recentEventsRes = await db.query('SELECT id, title, client, type, budget, status, start_date FROM events ORDER BY created_at DESC LIMIT 5');

    const stats = {
      animators: {
        total: parseInt(totalAnimatorsRes.rows[0].count),
        available: parseInt(availableAnimatorsRes.rows[0].count),
        assignmentRate: totalAnimatorsRes.rows[0].count > 0 
          ? Math.round(((totalAnimatorsRes.rows[0].count - availableAnimatorsRes.rows[0].count) / totalAnimatorsRes.rows[0].count) * 100) 
          : 0,
      },
      events: {
        total: parseInt(totalEventsRes.rows[0].count),
        active: parseInt(activeEventsRes.rows[0].count),
        totalBudget: parseFloat(totalBudgetRes.rows[0].sum || 0),
        totalBudgetFormatted: `${parseFloat(totalBudgetRes.rows[0].sum || 0).toLocaleString('fr-FR')} Ar`,
      },
      equipment: {
        totalTypes: parseInt(totalEquipmentRes.rows[0].count),
        lowStockCount: parseInt(lowStockEquipmentRes.rows[0].count),
      },
      recentEvents: recentEventsRes.rows.map(row => ({
        id: row.id,
        title: row.title,
        client: row.client,
        type: row.type,
        budget: `${parseFloat(row.budget).toLocaleString('fr-FR')} Ar`,
        status: row.status,
        startDate: row.start_date ? row.start_date.toISOString().split('T')[0] : null,
      })),
    };

    return successResponse(res, stats, 'Statistiques du tableau de bord récupérées');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
