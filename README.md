# Bitacorapp

**Bitacorapp** es una aplicación móvil y web diseñada para que navegantes, capitanes y entusiastas de la náutica lleven un registro digital de cada salida de mar (“bitácora de navegación”). Su objetivo es simplificar la captura, el almacenamiento y la consulta de datos clave de cada travesía: datos de partida y llegada, tripulantes vinculados por usuarios y mas adelante cualquier otro detalle relevante como trackeo, condiciones climaticas e informacion del barco

## Características principales
- **Registro de viajes (“voyages”)**  
  Crea, edita y consulta bitácoras de navegación asociadas a cada usuario.   
- **Adjuntos multimedia**  
  Fotos, capturas de instrumentos y notas de voz para enriquecer cada bitácora.  
- **Dashboard de estadísticas**  
  Gráficos y métricas acumuladas: distancia total navegada, horas de navegación, consumo promedio, etc.
- **Informacion compartida**  
  Comparte con amigos, colegas o compañeros la informacion de la navegada que hicieron juntos.  
- **Sincronización y respaldos**  
  Almacenamiento en servidor (Node.js + MongoDB) para acceder desde múltiples dispositivos y salvaguardar tus datos.  

## Tecnología
- **Frontend móvil**: React Native + Redux  
- **Frontend web**: React.js + Context API  
- **Backend**: Node.js + Express  
- **Base de datos**: MongoDB (Mongoose)  
- **Autenticación**: JWT  
- **Despliegue (para mas adelante)**: Docker / AWS (CloudFront para assets estáticos)  

## Objetivo
Permitir que cada navegante lleve un historial digital completo y accesible de sus travesías, facilite el análisis de su desempeño y contribuya a mejorar la seguridad y la planificación de futuras salidas de mar.

---
