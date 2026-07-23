import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

// Leer datos del archivo local
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return {
        coupleSettings: { partnerA: 'Dilan', partnerB: 'Sofía', weddingDate: '2027-10-14' },
        citas: [],
        boda: [],
        citasCasados: [],
        peliculas: []
      };
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error leyendo el archivo de datos:', err);
    return {};
  }
}

// Guardar datos en el archivo local
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error escribiendo el archivo de datos:', err);
  }
}

// Servir archivos estáticos del build de Vue en producción
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Rutas de la API
app.get('/api/data', (req, res) => {
  res.json(readData());
});

app.post('/api/data', (req, res) => {
  const newData = req.body;
  writeData(newData);
  broadcast(newData); // Difundir la actualización a todos los WebSockets
  res.json({ success: true, data: newData });
});

// Ruta fallback para el ruteo de Single Page Application (SPA) de Vue
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/ws')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('Frontend no compilado. Ejecuta "npm run build" para generar los archivos de producción de Vue.');
  }
});

// Crear servidor HTTP integrado
const server = http.createServer(app);

// Inicializar servidor de WebSockets
const wss = new WebSocketServer({ noServer: true });

// Escuchar solicitudes de actualización a WebSocket
server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Función para transmitir actualizaciones a todos los clientes
function broadcast(data, excludeWs = null) {
  const message = JSON.stringify({ type: 'UPDATE_DATA', payload: data });
  wss.clients.forEach((client) => {
    if (client.readyState === 1 && client !== excludeWs) { // 1 es WebSocket.OPEN
      client.send(message);
    }
  });
}

wss.on('connection', (ws) => {
  console.log('Cliente conectado para sincronización en tiempo real');
  
  // Enviar mensaje de confirmación inicial
  ws.send(JSON.stringify({ type: 'CONNECTED', message: 'Sincronización activa' }));

  ws.on('message', (messageStr) => {
    try {
      const data = JSON.parse(messageStr);
      if (data.type === 'UPDATE_DATA') {
        writeData(data.payload);
        broadcast(data.payload, ws);
      }
    } catch (err) {
      console.error('Error al procesar mensaje de WebSocket:', err);
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor de Our Journey ejecutándose en: http://localhost:${PORT}`);
});
