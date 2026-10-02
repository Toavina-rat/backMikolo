const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

// Helper to fetch full event object with nested relations
async function fetchFullEvent(eventId) {
  const eventRes = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);
  if (eventRes.rows.length === 0) return null;

  const event = eventRes.rows[0];

  const staffingRes = await db.query('SELECT * FROM event_staffing WHERE event_id = $1', [eventId]);
  const equipmentRes = await db.query('SELECT * FROM event_equipment WHERE event_id = $1', [eventId]);
  const sessionsRes = await db.query('SELECT * FROM event_dispatch_sessions WHERE event_id = $1', [eventId]);
  const docsRes = await db.query('SELECT * FROM event_documents WHERE event_id = $1', [eventId]);

  return {
    id: event.id,
    title: event.title,
    client: event.client,
    type: event.type,
    budget: `${parseFloat(event.budget).toLocaleString('fr-FR')} Ar`,
    budgetValue: parseFloat(event.budget),
    priority: event.priority,
    status: event.status,
    statusBadge: event.status_badge || (event.status === 'confirme' ? 'CONFIRMÉ' : 'BROUILLON'),
    statusTone: event.status_tone || 'prep',
    countdown: event.countdown || 'Prochainement',
    progress: event.progress || 0,
    startDate: event.start_date ? event.start_date.toISOString().split('T')[0] : null,
    endDate: event.end_date ? event.end_date.toISOString().split('T')[0] : null,
    date: event.start_date ? new Date(event.start_date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : '',
    time: event.time || '18:00 - 23:00',
    briefingDate: event.briefing_date ? event.briefing_date.toISOString().split('T')[0] : null,
    briefingTime: event.briefing_time || '15:00',
    location: event.location || '',
    venueName: event.venue_name || '',
    venueAddress: event.venue_address || '',
    city: event.city || '',
    guestCount: event.guest_count || 0,
    venueType: event.venue_type || '',
    accessNotes: event.access_notes || '',
    image: event.image_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80',
    notesAlert: event.notes_alert,
    description: event.description || '',
    projectManager: event.project_manager || 'Équipe Mikolo',
    briefingNotes: event.briefing_notes || '',
    emergencyContact: {
      name: event.emergency_contact_name || '',
      phone: event.emergency_contact_phone || '',
      role: event.emergency_contact_role || '',
    },
    staffing: staffingRes.rows.map(s => ({
      id: s.id,
      animatorId: s.animator_id,
      name: s.name,
      role: s.role,
      avatar: s.avatar || s.name ? s.name.split(' ').map(n=>n[0]).join('').substring(0,2) : 'AN',
      rating: s.rating || '5.0/5',
      phone: s.phone || '',
    })),
    staffStatus: `${staffingRes.rows.length} Animateurs affectés`,
    equipment: equipmentRes.rows.map(e => ({
      id: e.equipment_id || e.id,
      name: e.name,
      category: e.category,
      quantity: e.quantity,
    })),
    dispatchSessions: sessionsRes.rows.map(sess => ({
      id: sess.id,
      title: sess.title,
      date: sess.date ? sess.date.toISOString().split('T')[0] : '',
      time: sess.time,
      location: sess.location,
      animators: typeof sess.animators === 'string' ? JSON.parse(sess.animators) : sess.animators,
      equipment: typeof sess.equipment === 'string' ? JSON.parse(sess.equipment) : sess.equipment,
    })),
    documents: docsRes.rows.map(d => ({
      id: d.id,
      name: d.name,
      size: d.size,
      date: d.date,
      url: d.url,
    })),
    createdAt: event.created_at,
  };
}

const getAllEvents = async (req, res, next) => {
  try {
    const { status, type, search } = req.query;

    let queryText = 'SELECT id FROM events WHERE 1=1';
    const params = [];

    if (status) {
      params.push(status);
      queryText += ` AND status = $${params.length}`;
    }

    if (type) {
      params.push(`%${type}%`);
      queryText += ` AND type LIKE $${params.length}`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      queryText += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(client) LIKE $${params.length} OR LOWER(location) LIKE $${params.length})`;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await db.query(queryText, params);

    const events = await Promise.all(result.rows.map(row => fetchFullEvent(row.id)));

    return successResponse(res, events, 'Liste des événements récupérée');
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await fetchFullEvent(id);

    if (!event) {
      return errorResponse(res, 'Événement non trouvé', 404);
    }

    return successResponse(res, event, 'Détails de l\'événement');
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const {
      name,
      title,
      client: clientName,
      type,
      budget,
      priority,
      status,
      startDate,
      endDate,
      time,
      venueName,
      venueAddress,
      city,
      guestCount,
      venueType,
      accessNotes,
      imageUrl,
      description,
      staffing,
      equipment,
      emergencyContact,
      briefingNotes,
    } = req.body;

    const eventTitle = title || name || 'Nouvel Événement';
    const eventClient = clientName || 'Client Inconnu';
    const id = `evt-${Date.now()}`;

    const insertEventQuery = `
      INSERT INTO events (
        id, title, client, type, budget, priority, status, status_badge, status_tone, countdown, progress,
        start_date, end_date, time, briefing_date, briefing_time, location, venue_name, venue_address, city, guest_count,
        venue_type, access_notes, image_url, description, project_manager, briefing_notes,
        emergency_contact_name, emergency_contact_phone, emergency_contact_role
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30)
      RETURNING *
    `;

    const locationStr = [venueName, venueAddress, city].filter(Boolean).join(', ') || 'France';

    await client.query(insertEventQuery, [
      id,
      eventTitle,
      eventClient,
      type || 'Gala Corporate & Prestige',
      budget || 0,
      priority || 'normale',
      status || 'brouillon',
      status === 'confirme' ? 'CONFIRMÉ' : 'EN PRÉPARATION',
      'prep',
      'Prochainement',
      25,
      startDate || new Date().toISOString().split('T')[0],
      endDate || startDate || new Date().toISOString().split('T')[0],
      time || '18:00 - 23:00',
      startDate || new Date().toISOString().split('T')[0],
      '15:00',
      locationStr,
      venueName || '',
      venueAddress || '',
      city || '',
      guestCount || 50,
      venueType || '',
      accessNotes || '',
      imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80',
      description || '',
      'Équipe Mikolo',
      briefingNotes || '',
      emergencyContact ? emergencyContact.name : '',
      emergencyContact ? emergencyContact.phone : '',
      emergencyContact ? emergencyContact.role : '',
    ]);

    if (staffing && Array.isArray(staffing)) {
      for (const st of staffing) {
        await client.query(
          'INSERT INTO event_staffing (event_id, animator_id, name, role) VALUES ($1, $2, $3, $4)',
          [id, st.animatorId || null, st.name || 'Animateur', st.role || 'Animateur']
        );
      }
    }

    if (equipment && Array.isArray(equipment)) {
      for (const eq of equipment) {
        await client.query(
          'INSERT INTO event_equipment (event_id, equipment_id, name, category, quantity) VALUES ($1, $2, $3, $4, $5)',
          [id, eq.itemId || eq.id, eq.name || 'Équipement', eq.category || 'Matériel', eq.quantity || 1]
        );
      }
    }

    await client.query('COMMIT');

    const createdEvent = await fetchFullEvent(id);
    return successResponse(res, createdEvent, 'Événement créé avec succès', 201);
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    const check = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return errorResponse(res, 'Événement non trouvé', 404);
    }

    const {
      title,
      client,
      type,
      budget,
      priority,
      status,
      startDate,
      endDate,
      time,
      location,
      description,
      notesAlert,
      progress,
    } = fields;

    await db.query(
      `UPDATE events SET
        title = COALESCE($1, title),
        client = COALESCE($2, client),
        type = COALESCE($3, type),
        budget = COALESCE($4, budget),
        priority = COALESCE($5, priority),
        status = COALESCE($6, status),
        start_date = COALESCE($7, start_date),
        end_date = COALESCE($8, end_date),
        time = COALESCE($9, time),
        location = COALESCE($10, location),
        description = COALESCE($11, description),
        notes_alert = COALESCE($12, notes_alert),
        progress = COALESCE($13, progress)
      WHERE id = $14`,
      [title, client, type, budget, priority, status, startDate, endDate, time, location, description, notesAlert, progress, id]
    );

    const updated = await fetchFullEvent(id);
    return successResponse(res, updated, 'Événement mis à jour avec succès');
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Événement non trouvé', 404);
    }

    return successResponse(res, null, 'Événement supprimé avec succès');
  } catch (error) {
    next(error);
  }
};

const addDispatchSession = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;
    const { title, date, time, location, animators, equipment } = req.body;

    const check = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (check.rows.length === 0) {
      return errorResponse(res, 'Événement non trouvé', 404);
    }

    const sessionId = `sess-${Date.now()}`;

    const result = await db.query(
      `INSERT INTO event_dispatch_sessions (id, event_id, title, date, time, location, animators, equipment)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        sessionId,
        eventId,
        title || 'Nouvelle Session',
        date || new Date().toISOString().split('T')[0],
        time || '18:00 - 22:00',
        location || '',
        JSON.stringify(animators || []),
        JSON.stringify(equipment || []),
      ]
    );

    return successResponse(res, result.rows[0], 'Session ajoutée avec succès', 201);
  } catch (error) {
    next(error);
  }
};

const removeDispatchSession = async (req, res, next) => {
  try {
    const { id: eventId, sessionId } = req.params;
    const result = await db.query(
      'DELETE FROM event_dispatch_sessions WHERE id = $1 AND event_id = $2 RETURNING *',
      [sessionId, eventId]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Session non trouvée', 404);
    }

    return successResponse(res, null, 'Session supprimée avec succès');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  addDispatchSession,
  removeDispatchSession,
};
