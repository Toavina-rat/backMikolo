-- Données de test initiales pour Mikolo Events

-- Comptes utilisateurs de test (Mot de passe pour tous : password123)
-- 1. Compte Administrateur (role: admin)
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Administrateur Mikolo',
  'admin@mikolo-events.fr',
  '$2a$10$wT0XkG9m1G7Z4vL0P5/AbeX0J9yq6C2.kL9yF4w7V8w8b9b0b1b2c',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- 2. Compte Superviseur (role: superviseur)
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Superviseur Mikolo',
  'superviseur@mikolo-events.fr',
  '$2a$10$wT0XkG9m1G7Z4vL0P5/AbeX0J9yq6C2.kL9yF4w7V8w8b9b0b1b2c',
  'superviseur'
) ON CONFLICT (email) DO NOTHING;

-- 3. Compte Responsable (role: resp)
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Responsable Événementiel',
  'resp@mikolo-events.fr',
  '$2a$10$wT0XkG9m1G7Z4vL0P5/AbeX0J9yq6C2.kL9yF4w7V8w8b9b0b1b2c',
  'resp'
) ON CONFLICT (email) DO NOTHING;

-- Animateurs Initiales
INSERT INTO animators (name, specialty, role, daily_rate, rating, experience_years, location, contact, contact_type, status, status_tone, avatar_bg, avatar_text)
VALUES 
  ('Alexandre Moreau', 'MC / Gala & Corporate', 'Animateur Principal - Gala & Luxe', 450.00, 4.90, 8, 'Paris (75) · Île-de-France', 'a.moreau@mikolo-events.fr', 'email', 'disponible', 'green', 'bg-[#005459]', 'AM'),
  ('Sophie Benali', 'Modératrice B2B', 'Directrice Artistique & MC Scène', 500.00, 5.00, 10, 'Lyon (69) · Auvergne-Rhône-Alpes', '+33 6 42 19 88 02', 'phone', 'en_mission', 'amber', 'bg-[#8c6b2d]', 'SB'),
  ('Thomas Mercier', 'DJ & Sound Designer', 'Superviseur Général & Régisseur', 380.00, 4.80, 6, 'Marseille (13) · PACA', 't.mercier@mikolo-events.fr', 'email', 'disponible', 'blue', 'bg-[#2d6fa8]', 'TM'),
  ('Camille Lefèvre', 'Team Building & Ateliers', 'Animatrice Jeux & Corporate', 350.00, 4.75, 5, 'Bordeaux (33) · Nouvelle-Aquitaine', '+33 6 88 37 45 92', 'phone', 'disponible', 'green', 'bg-[#207a68]', 'CL'),
  ('Émilie Roussel', 'Présentatrice Bilingue VIP', 'Animatrice Bilingue (EN/FR)', 480.00, 4.90, 7, 'Paris & International', 'e.roussel@mikolo-events.fr', 'email', 'disponible', 'teal', 'bg-[#007f87]', 'ER'),
  ('Lucas Moreau', 'Animateur DJ & Tech', 'Animateur DJ & Scène Tech', 400.00, 4.70, 4, 'Lille (59) · Hauts-de-France', '+33 6 56 78 90 12', 'phone', 'disponible', 'teal', 'bg-[#007f87]', 'LM')
ON CONFLICT DO NOTHING;

-- Inventory / Stock Items
INSERT INTO inventory_items (id, name, category, daily_rate, available_stock, total_stock, image_url)
VALUES
  ('eq1', 'Système Sonorisation Line-Array 500p', 'Son', 250.00, 8, 12, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80'),
  ('eq2', 'Pack Projecteurs LED Scéniques & Lyres', 'Éclairage', 180.00, 14, 20, 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80'),
  ('eq3', 'Mur d''Écrans LED 4K (4x3m)', 'Vidéo', 650.00, 3, 4, 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80'),
  ('eq4', 'Pupitre Annonceur VIP avec Micros Sans Fil', 'Scène', 120.00, 6, 8, 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80'),
  ('eq5', 'Studio Photo-booth Interactif Mikolo', 'Animation', 220.00, 5, 5, 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&auto=format&fit=crop&q=80'),
  ('eq8', 'Vidéoprojecteur 10 000 Lumens Laser', 'Vidéo', 310.00, 4, 6, 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- Événements Principaux
INSERT INTO events (
  id, title, client, type, budget, priority, status, status_badge, status_tone, countdown, progress, 
  start_date, end_date, time, briefing_date, briefing_time, location, venue_name, venue_address, city, guest_count, venue_type,
  image_url, notes_alert, description, project_manager, emergency_contact_name, emergency_contact_phone, emergency_contact_role
)
VALUES
  (
    'evt-101', 'Gala Annuel Fondation Lumière', 'Fondation Lumière SA', 'Gala Prestige', 45000.00, 'haute', 'confirme',
    'URGENT - Briefing à finaliser', 'urgent', 'J-2 avant événement', 75,
    '2024-10-15', '2024-10-17', '19:00 - 02:00', '2024-10-15', '16:30',
    'Palais des Congrès, Salle Diamant, Paris', 'Palais des Congrès', '2 Place de la Porte Maillot', 'Paris', 450, 'Salle de Prestige',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80',
    'Validation traiteur en attente. Matériel son supplémentaire requis pour la terrasse VIP.',
    'Célébration du jubilé des 15 ans avec 450 invités d''honneur. Soirée rythmée par 3 interventions artistiques, remise de trophées et régie lumière sur mesure signée Mikolo Events.',
    'Aurélie Dupont', 'Jean Valjean', '+33 6 00 11 22 33', 'Responsable Événement'
  ),
  (
    'evt-102', 'Lancement Gamme NovaTech 2025', 'TechNova Europe', 'Lancement Produit', 28500.00, 'moyenne', 'confirme',
    'EN COURS DE VALIDATION', 'in_progress', 'J-9 avant événement', 45,
    '2024-10-22', '2024-10-24', '14:00 - 18:30', '2024-10-22', '12:00',
    'Espace Wagram, Paris 17e', 'Espace Wagram', '39 Avenue Wagram', 'Paris', 200, 'Showroom',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1000&auto=format&fit=crop&q=80',
    NULL,
    'Présentation exclusive de la nouvelle gamme de produits connectés NovaTech devant 200 journalistes et partenaires. Démonstration live en direct et cockpit multimédia.',
    'Julien Mercer', 'Marie Curie', '+33 6 99 88 77 66', 'Directrice Com'
  ),
  (
    'evt-103', 'Teambuilding Automne Banque Populaire', 'Groupe BPCE', 'Teambuilding & Challenge', 19000.00, 'normale', 'brouillon',
    'EN PRÉPARATION', 'prep', 'J-15 avant événement', 30,
    '2024-10-28', '2024-10-28', '09:00 - 17:00', '2024-10-28', '08:15',
    'Domaine de Chantilly, Oise', 'Domaine de Chantilly', 'Parc du Château', 'Chantilly', 120, 'Parc Outdoor',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1000&auto=format&fit=crop&q=80',
    NULL,
    'Journée d''intégration et challenge inter-branches pour 120 collaborateurs BPCE dans le parc du domaine.',
    'Claire Vasseur', 'Paul Durant', '+33 6 55 44 33 22', 'Chef de Projet HR'
  )
ON CONFLICT (id) DO NOTHING;

-- Staffing par événement
INSERT INTO event_staffing (event_id, name, role, avatar, rating, phone)
VALUES
  ('evt-101', 'Alexandre Moreau', 'Animateur Principal - Gala & Luxe', 'AM', '4.9/5', '+33 6 12 34 56 78'),
  ('evt-101', 'Sophie Benali', 'Directrice Artistique & MC Scène', 'SB', '5.0/5', '+33 6 23 45 67 89'),
  ('evt-101', 'Émilie Roussel', 'Animatrice Bilingue VIP', 'ER', '4.9/5', '+33 6 45 67 89 01'),
  ('evt-102', 'Émilie Roussel', 'Animatrice Bilingue (EN/FR)', 'ER', '4.9/5', '+33 6 45 67 89 01'),
  ('evt-102', 'Lucas Moreau', 'Animateur DJ & Scène Tech', 'LM', '4.7/5', '+33 6 56 78 90 12')
ON CONFLICT DO NOTHING;

-- Équipements par événement
INSERT INTO event_equipment (event_id, equipment_id, name, category, quantity)
VALUES
  ('evt-101', 'eq1', 'Système Sonorisation Line-Array 500p', 'Son', 2),
  ('evt-101', 'eq2', 'Pack Projecteurs LED Scéniques & Lyres', 'Éclairage', 6),
  ('evt-101', 'eq4', 'Pupitre Annonceur VIP avec Micros Sans Fil', 'Scène', 4),
  ('evt-101', 'eq5', 'Studio Photo-booth Interactif Mikolo', 'Animation', 1),
  ('evt-102', 'eq3', 'Mur d''Écrans LED 4K (4x3m)', 'Vidéo', 1),
  ('evt-102', 'eq8', 'Vidéoprojecteur 10 000 Lumens Laser', 'Vidéo', 2)
ON CONFLICT DO NOTHING;

-- Dispatch Sessions
INSERT INTO event_dispatch_sessions (id, event_id, title, date, time, location, animators, equipment)
VALUES
  (
    'sess-1', 'evt-101', 'Session 1 : Soirée d''Inauguration VIP', '2024-10-15', '19:00 - 23:30',
    'Palais des Congrès - Salon Diamant, Paris',
    '[{"name": "Alexandre Moreau", "role": "Animateur Principal", "gender": "Animateur"}, {"name": "Sophie Benali", "role": "MC & Présentatrice Scène", "gender": "Animatrice"}]'::jsonb,
    '[{"name": "Système Sonorisation Line-Array", "category": "Son", "quantity": 2}, {"name": "Pack Projecteurs LED Scéniques", "category": "Éclairage", "quantity": 4}]'::jsonb
  ),
  (
    'sess-2', 'evt-101', 'Session 2 : Gala de Clôture & Remise de Prix', '2024-10-17', '20:00 - 02:00',
    'Hôtel Ritz - Grand Ballroom, Paris',
    '[{"name": "Émilie Roussel", "role": "Animatrice Bilingue VIP", "gender": "Animatrice"}]'::jsonb,
    '[{"name": "Studio Photo-booth Interactif", "category": "Animation", "quantity": 1}]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- Documents
INSERT INTO event_documents (event_id, name, size, date, url)
VALUES
  ('evt-101', 'Cahier_des_Charges_V2.pdf', '2.4 Mo', '10 Oct 2024', '#'),
  ('evt-101', 'Fiche_Technique_Salle_Diamant.pdf', '1.8 Mo', '11 Oct 2024', '#'),
  ('evt-102', 'Dossier_Presse_NovaTech.pdf', '5.2 Mo', '05 Oct 2024', '#')
ON CONFLICT DO NOTHING;

-- Notifications
INSERT INTO notifications (title, message, type, is_read)
VALUES
  ('Briefing urgent', 'Briefing pour le Gala Fondation Lumière à valider avant 17h.', 'urgent', false),
  ('Nouvel Animateur', 'Alexandre Moreau a mis à jour ses disponibilités.', 'info', false),
  ('Stock Faible', 'Il reste seulement 3 Murs d''Écrans LED 4K en stock.', 'warning', false)
ON CONFLICT DO NOTHING;
