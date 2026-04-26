const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const log = require('electron-log');
const mm = require('music-metadata');

log.initialize({ preload: true });
log.transports.file.level = 'info';

let mainWindow;
let server;

function startServer() {
  return new Promise((resolve) => {
    const buildPath = path.join(__dirname, '../build');
    log.info('Build path:', buildPath);
    
    server = http.createServer((req, res) => {
      // 移除URL中的查询参数并解码
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      // 处理路径，移除开头的斜杠以避免双斜杠问题
      const cleanPath = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '');
      let filePath = path.join(buildPath, cleanPath);
      
      log.info('Request:', req.url, '-> File:', filePath);
      
      const ext = path.extname(filePath).toLowerCase();
      const contentTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf'
      };
      
      fs.readFile(filePath, (err, data) => {
        if (err) {
          log.error('File not found:', filePath, err.message);
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found: ' + req.url);
          return;
        }
        const contentType = contentTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });
    
    server.listen(3000, () => {
      log.info('Server started on port 3000');
      resolve();
    });
  });
}

async function createWindow() {
  await startServer();
  
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 500,
    frame: false,
    backgroundColor: '#000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL('http://localhost:3000');

  // 打开开发者工具以便调试白屏问题
  mainWindow.webContents.openDevTools();

  // 捕获渲染进程的控制台输出
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    const levels = ['debug', 'info', 'warn', 'error'];
    log.info(`[Renderer ${levels[level] || 'log'}]`, message, `(${sourceId}:${line})`);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 监听渲染进程崩溃事件
  mainWindow.webContents.on('render-process-gone', (event, details) => {
    log.error('Render process gone:', details);
  });

  // 监听页面加载失败事件
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    log.error('Page failed to load:', errorCode, errorDescription);
  });

  log.info('FluentMusic started');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac', 'wma'] }
    ]
  });
  return result.canceled ? [] : result.filePaths;
});

ipcMain.handle('open-folder-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('scan-folder', async (event, folderPath) => {
  try {
    const audioExtensions = ['.mp3', '.wav', '.flac', '.ogg', '.m4a', '.aac', '.wma'];
    const files = [];
    
    function scanDirectory(dir) {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(item).toLowerCase();
          if (audioExtensions.includes(ext)) {
            files.push({
              path: fullPath,
              name: item,
              folder: path.basename(folderPath)
            });
          }
        }
      }
    }
    
    scanDirectory(folderPath);
    return { success: true, files };
  } catch (error) {
    log.error('Scan folder error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('read-audio-file', async (event, filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    return { success: true, data: buffer.toString('base64'), path: filePath };
  } catch (error) {
    log.error('Read audio file error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-file-info', async (event, filePath) => {
  try {
    const stats = fs.statSync(filePath);
    const name = path.basename(filePath);
    
    // 解析音乐元数据
    let metadata = {};
    try {
      const meta = await mm.parseFile(filePath);
      metadata = {
        title: meta.common.title || null,
        artist: meta.common.artist || null,
        album: meta.common.album || null,
        year: meta.common.year || null,
        genre: meta.common.genre?.[0] || null,
        duration: meta.format.duration || null,
        bitrate: meta.format.bitrate || null,
        sampleRate: meta.format.sampleRate || null
      };
    } catch (metaError) {
      log.warn('Failed to parse metadata for:', filePath, metaError.message);
    }
    
    return { success: true, name, size: stats.size, path: filePath, metadata };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.on('minimize-window', () => {
  mainWindow?.minimize();
});

ipcMain.on('maximize-window', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.on('close-window', () => {
  mainWindow?.close();
});