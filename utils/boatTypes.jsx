// Mapeo de nombres de barco (Español ⇄ Inglés)
export const boatTypesMap = {
  Velero: "Sailboat",
  "Barco a motor": "Motorboat",
  "Barco de pesca": "Fishing Boat",
  Ferry: "Ferry",
  "Barco de carga": "Cargo Ship",
  Crucero: "Cruise Ship",
};

// Lista de nombres en español para mostrar en un dropdown
export const boatTypesFrontend = Object.keys(boatTypesMap);

// Mapeo inverso para convertir del backend al frontend (Inglés → Español)
export const boatTypesReverseMap = Object.fromEntries(
  Object.entries(boatTypesMap).map(([es, en]) => [en, es])
);

// Función para traducir del inglés al español
export const translateBoatType = (englishType) =>
  boatTypesReverseMap[englishType] || englishType;
