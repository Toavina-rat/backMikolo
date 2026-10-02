const db = require('../config/db');
const { successResponse } = require('../utils/response');

const getPlanningItems = async (req, res, next) => {
  try {
    const eventsRes = await db.query('SELECT * FROM events ORDER BY start_date ASC');
    const sessionsRes = await db.query('SELECT * FROM event_dispatch_sessions ORDER BY date ASC');

    const items = [];

    // Map tones
    const toneMap = {
      urgent: 'red',
      in_progress: 'teal',
      prep: 'teal',
      done: 'muted',
    };

    // 1. Add sessions
    sessionsRes.rows.forEach(sess => {
      items.push({
        id: `plan-sess-${sess.id}`,
        eventId: sess.event_id,
        title: sess.title,
        date: sess.date ? sess.date.toISOString().split('T')[0] : '',
        time: sess.time || '18:00 - 23:00',
        tone: 'teal',
        location: sess.location,
        description: `Session multi-date : ${sess.title}`,
        isSession: true,
      });
    });

    // 2. Add main events
    eventsRes.rows.forEach(evt => {
      const tone = toneMap[evt.status_tone] || 'teal';
      const startDateStr = evt.start_date ? evt.start_date.toISOString().split('T')[0] : '';

      if (startDateStr) {
        items.push({
          id: `plan-evt-${evt.id}`,
          eventId: evt.id,
          title: evt.title,
          date: startDateStr,
          time: evt.time || '18:00 - 23:00',
          tone: tone,
          location: evt.location || '',
          description: evt.description || `Événement client ${evt.client}`,
          isSession: false,
        });
      }
    });

    return successResponse(res, items, 'Éléments du planning récupérés avec succès');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlanningItems,
};
