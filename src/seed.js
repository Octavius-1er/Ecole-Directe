export const ACCOUNTS_VERSION = "3";
export const DATA_VERSION = "3";

export const DEFAULT_ACCOUNTS = [
  { id: "e1", username: "eleve",     password: "eleve123",     role: "eleve",  nom: "Le Chatelier", prenom: "Octave", classe: "5ème F EUROP.", classeId: "c1" },
  { id: "pa1", username: "parent",   password: "parent123",   role: "parent", nom: "Le Chatelier", prenom: "Camille", classe: "5ème F EUROP.", classeId: "c1", enfantId: "e1" },
  { id: "pr1", username: "prof",     password: "prof123",     role: "prof",   nom: "Fischer",      prenom: "Nathalie", matiere: "Français" },
  { id: "ad1", username: "proviseur", password: "proviseur123", role: "admin", nom: "Morel",       prenom: "Sophie" },
];

export const SEED_DATA = {
  classes: {
    c1: { id: "c1", nom: "5ème F EUROP.", niveau: "5ème" },
  },
  evals: [
    { id: "ev1", nom: "Questions sur No et moi", matiere: "Français", type: "Contrôle", date: "2026-10-06", releveId: "r1", classeId: "c1", notes: { e1: "16" }, competences: [{ label: "Lire", desc: "Comprendre un texte littéraire", niveau: "att" }] },
    { id: "ev2", nom: "Fractions et proportions", matiere: "Mathématiques", type: "Interrogation", date: "2026-10-08", releveId: "r1", classeId: "c1", notes: { e1: "14,5" }, competences: [] },
    { id: "ev3", nom: "Past simple", matiere: "Anglais LV1", type: "Devoir maison", date: "2026-10-13", releveId: "r1", classeId: "c1", notes: { e1: "15" }, competences: [] },
    { id: "ev4", nom: "La Révolution française", matiere: "Histoire-Géo", type: "Contrôle", date: "2026-10-15", releveId: "r1", classeId: "c1", notes: { e1: "13" }, competences: [] },
  ],
  devoirsPC: {
    c1: {
      "2026-9-20": {
        label: "MARDI 20 OCTOBRE",
        items: [
          { matiere: "FRANÇAIS", description: "Lire le chapitre 4 de No et moi et préparer trois questions.", donne: "Donné le 19 octobre par Nathalie Fischer", effectue: false },
          { matiere: "MATHÉMATIQUES", description: "Exercices 4, 5 et 6 page 42.", donne: "Donné le 19 octobre", effectue: false },
        ],
      },
      "2026-9-21": {
        label: "MERCREDI 21 OCTOBRE",
        items: [
          { matiere: "ANGLAIS LV1", description: "Apprendre le vocabulaire de l'unité 2.", donne: "Donné le 16 octobre", effectue: true },
        ],
      },
    },
  },
  edtPC: {
    c1: {
      lun: { label: "Lundi", items: [
        { heure: "08:15 - 09:10", matiere: "Français", prof: "Fischer", salle: "B12" },
        { heure: "09:15 - 10:10", matiere: "Mathématiques", prof: "Durand", salle: "B08" },
        { heure: "10:25 - 11:20", matiere: "Anglais LV1", prof: "Martin", salle: "A03" },
        { heure: "11:25 - 12:20", matiere: "Histoire-Géo", prof: "Bernard", salle: "C01" },
      ]},
      mar: { label: "Mardi", items: [
        { heure: "08:15 - 09:10", matiere: "Physique-Chimie", prof: "Leroy", salle: "Labo 2" },
        { heure: "09:15 - 10:10", matiere: "Français", prof: "Fischer", salle: "B12" },
        { heure: "10:25 - 11:20", matiere: "EPS", prof: "Colin", salle: "Gymnase" },
        { heure: "11:25 - 12:20", matiere: "Mathématiques", prof: "Durand", salle: "B08" },
      ]},
      mer: { label: "Mercredi", items: [
        { heure: "08:15 - 09:10", matiere: "Allemand LV2", prof: "Weber", salle: "A11" },
        { heure: "09:15 - 10:10", matiere: "Sciences Vie & Terre", prof: "Petit", salle: "Labo 1" },
        { heure: "10:25 - 11:20", matiere: "Arts Plastiques", prof: "Renard", salle: "Atelier" },
      ]},
      jeu: { label: "Jeudi", items: [
        { heure: "08:15 - 09:10", matiere: "Mathématiques", prof: "Durand", salle: "B08" },
        { heure: "09:15 - 10:10", matiere: "Français", prof: "Fischer", salle: "B12" },
        { heure: "10:25 - 11:20", matiere: "Technologie", prof: "Moreau", salle: "Tech" },
        { heure: "11:25 - 12:20", matiere: "Histoire-Géo", prof: "Bernard", salle: "C01" },
        { heure: "13:30 - 14:25", matiere: "Anglais LV1", prof: "Martin", salle: "A03" },
      ]},
      ven: { label: "Vendredi", items: [
        { heure: "08:15 - 09:10", matiere: "Éducation Musicale", prof: "Blanc", salle: "Musique" },
        { heure: "09:15 - 10:10", matiere: "Français", prof: "Fischer", salle: "B12" },
        { heure: "10:25 - 11:20", matiere: "EPS", prof: "Colin", salle: "Gymnase" },
        { heure: "11:25 - 12:20", matiere: "Mathématiques", prof: "Durand", salle: "B08" },
      ]},
      sam: { label: "Samedi", items: [] },
    },
  },
  absencesPE: {
    e1: [
      { id: "ab1", date: "2026-10-02", duree: "2 h", justifiee: "Oui", motif: "Rendez-vous médical" },
    ],
  },
  punitionsPE: {},
  messages: [
    { id: "m1", sujet: "Réunion parents-professeurs", corps: "La réunion du 5 novembre se tiendra de 17 h à 20 h en salle polyvalente. Merci de vous inscrire auprès de la vie scolaire.", auteur: "Sophie Morel", date: "lundi 19 octobre 2026", lu: false },
    { id: "m2", sujet: "Sortie au musée", corps: "La classe de 5ème F se rend au musée des Beaux-Arts le jeudi 12 novembre. Pensez à l'autorisation signée.", auteur: "Nathalie Fischer", date: "vendredi 16 octobre 2026", lu: true },
  ],
  periode: { releveId: "r1", trimestreId: "t1" },
};
