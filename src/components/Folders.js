import React, { useState, useEffect } from 'react';
import { Button, Dialog } from 'react-windows-ui';

const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
  </svg>
);

const MusicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
  </svg>
);

const AddIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
  </svg>
);

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

function Folders({ onAddToPlaylist, t }) {
  const [folders, setFolders] = useState(() => {
    const saved = localStorage.getItem('musicFolders');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderFiles, setFolderFiles] = useState({});
  const [loading, setLoading] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, folderPath: null, folderName: '' });
  const [showFilesView, setShowFilesView] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      const containerWidth = window.innerWidth - 240;
      const collapsed = containerWidth < 600;
      setIsCollapsed(collapsed);
      if (!collapsed) {
        setShowFilesView(false);
      }
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  useEffect(() => {
    localStorage.setItem('musicFolders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    folders.forEach(folder => {
      if (!folderFiles[folder.path]) {
        scanFolder(folder.path);
      }
    });
  }, [folders]);

  const scanFolder = async (folderPath) => {
    setLoading(prev => ({ ...prev, [folderPath]: true }));
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.scanFolder(folderPath);
        if (result.success) {
          setFolderFiles(prev => ({ ...prev, [folderPath]: result.files }));
        }
      }
    } catch (error) {
      console.error('Scan folder error:', error);
    }
    setLoading(prev => ({ ...prev, [folderPath]: false }));
  };

  const handleAddFolder = async () => {
    if (window.electronAPI) {
      const folderPath = await window.electronAPI.openFolderDialog();
      if (folderPath) {
        const folderName = folderPath.split(/[\\/]/).pop();
        const existingFolder = folders.find(f => f.path === folderPath);
        if (!existingFolder) {
          const newFolder = { path: folderPath, name: folderName };
          setFolders(prev => [...prev, newFolder]);
        }
      }
    }
  };

  const handleRemoveFolder = (folderPath, folderName) => {
    setDeleteDialog({ isOpen: true, folderPath, folderName });
  };

  const confirmDeleteFolder = () => {
    const folderPath = deleteDialog.folderPath;
    setFolders(prev => prev.filter(f => f.path !== folderPath));
    setFolderFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[folderPath];
      return newFiles;
    });
    if (selectedFolder === folderPath) {
      setSelectedFolder(null);
    }
    setDeleteDialog({ isOpen: false, folderPath: null, folderName: '' });
  };

  const cancelDeleteFolder = () => {
    setDeleteDialog({ isOpen: false, folderPath: null, folderName: '' });
  };

  const handleAddAllToPlaylist = (folderPath) => {
    const files = folderFiles[folderPath] || [];
    if (files.length > 0 && onAddToPlaylist) {
      onAddToPlaylist(files);
    }
  };

  const handleAddFileToPlaylist = (file) => {
    if (onAddToPlaylist) {
      onAddToPlaylist([file]);
    }
  };

  const getTotalFiles = () => {
    return Object.values(folderFiles).reduce((total, files) => total + files.length, 0);
  };

  return (
    <div className="folders-page">
      <div className="folders-header">
        <div className="folders-title">
          <h2>{t.folders}</h2>
          <span className="folders-stats">
            {folders.length} {t.folderCount || 'folders'}, {getTotalFiles()} {t.songCount || 'songs'}
          </span>
        </div>
        <Button type="primary" icon={<AddIcon />} value={t.addFolder || 'Add Folder'} onClick={handleAddFolder} />
      </div>

      <div className="folders-content">
        {folders.length === 0 ? (
          <div className="folders-empty">
            <FolderIcon />
            <p>{t.noFolders || 'No folders added'}</p>
            <span>{t.addFolderHint || 'Add a folder to scan for music files'}</span>
            <Button type="secondary" icon={<AddIcon />} value={t.addFolder || 'Add Folder'} onClick={handleAddFolder} />
          </div>
        ) : (
          <div className={`folders-layout ${isCollapsed ? 'collapsed' : ''} ${showFilesView ? 'show-files' : ''}`}>
            <div className="folders-sidebar">
              {folders.map(folder => (
                <div
                  key={folder.path}
                  className={`folder-item ${selectedFolder === folder.path ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedFolder(folder.path);
                    if (isCollapsed) {
                      setShowFilesView(true);
                    }
                  }}
                  title={folder.name}
                >
                  <div className="folder-icon">
                    <FolderIcon />
                  </div>
                  <div className="folder-info">
                    <span className="folder-name">{folder.name}</span>
                    <span className="folder-count">
                      {(folderFiles[folder.path] || []).length} {t.songs || 'songs'}
                    </span>
                  </div>
                  <div className="folder-actions">
                    <button
                      className="folder-action-btn"
                      onClick={(e) => { e.stopPropagation(); scanFolder(folder.path); }}
                      title={t.refresh || 'Refresh'}
                      disabled={loading[folder.path]}
                    >
                      <RefreshIcon />
                    </button>
                    <button
                      className="folder-action-btn delete"
                      onClick={(e) => { e.stopPropagation(); handleRemoveFolder(folder.path, folder.name); }}
                      title={t.remove || 'Remove'}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="folder-files">
              {selectedFolder ? (
                <>
                  <div className="folder-files-header">
                    <div className="folder-files-title">
                      {isCollapsed && (
                        <button
                          className="back-btn"
                          onClick={() => setShowFilesView(false)}
                          title={t.back || 'Back'}
                        >
                          <BackIcon />
                        </button>
                      )}
                      <h3>{folders.find(f => f.path === selectedFolder)?.name}</h3>
                    </div>
                    <Button
                      type="secondary"
                      value={t.addAll || 'Add All to Playlist'}
                      onClick={() => handleAddAllToPlaylist(selectedFolder)}
                      disabled={(folderFiles[selectedFolder] || []).length === 0}
                    />
                  </div>
                  <div className="files-list">
                    {loading[selectedFolder] ? (
                      <div className="files-loading">{t.scanning || 'Scanning...'}</div>
                    ) : (folderFiles[selectedFolder] || []).length === 0 ? (
                      <div className="files-empty">{t.noMusicInFolder || 'No music files found'}</div>
                    ) : (
                      (folderFiles[selectedFolder] || []).map((file, index) => (
                        <div key={file.path} className="file-item">
                          <span className="file-number">{index + 1}</span>
                          <MusicIcon />
                          <span className="file-name">{file.name}</span>
                          <button
                            className="file-add-btn"
                            onClick={() => handleAddFileToPlaylist(file)}
                            title={t.addToPlaylist || 'Add to playlist'}
                          >
                            <AddIcon />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div className="no-folder-selected">
                  <FolderIcon />
                  <p>{t.selectFolder || 'Select a folder to view files'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog
        isVisible={deleteDialog.isOpen}
        onBackdropPress={cancelDeleteFolder}
      >
        <Dialog.Body style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-text)' }}>
            {t.remove || 'Remove'} {t.folders || 'Folder'}
          </h3>
          <p style={{ margin: '0 0 20px 0', color: 'var(--color-text-secondary)' }}>
            {(t.confirmRemoveFolder || 'Are you sure you want to remove "{folderName}" from the list?').replace('{folderName}', deleteDialog.folderName)}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button
              value={t.cancel || 'Cancel'}
              onClick={cancelDeleteFolder}
            />
            <Button
              value={t.remove || 'Remove'}
              type="primary"
              style={{ background: '#e81123' }}
              onClick={confirmDeleteFolder}
            />
          </div>
        </Dialog.Body>
      </Dialog>

      <style>{`
        .folders-page {
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .folders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .folders-title {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .folders-title h2 {
          margin: 0;
          font-size: 24px;
          color: var(--color-text);
        }

        .folders-stats {
          font-size: 12px;
          color: var(--color-text-secondary);
        }

        .folders-content {
          flex: 1;
          overflow: hidden;
        }

        .folders-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--color-text-secondary);
          gap: 16px;
        }

        .folders-empty svg {
          width: 64px;
          height: 64px;
          opacity: 0.5;
        }

        .folders-empty p {
          margin: 0;
          font-size: 16px;
        }

        .folders-empty span {
          font-size: 12px;
          opacity: 0.7;
        }

        .folders-layout {
          display: flex;
          height: 100%;
          gap: 16px;
          min-width: 0;
        }

        .folders-sidebar {
          width: 280px;
          min-width: 200px;
          max-width: 35%;
          background: var(--color-card-bg, rgba(255,255,255,0.05));
          border-radius: 8px;
          border: 1px solid var(--color-border);
          overflow-y: auto;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .folders-layout.collapsed .folders-sidebar {
          width: 60px;
          min-width: 60px;
          max-width: 60px;
        }

        .folders-layout.collapsed .folder-item {
          padding: 12px;
          justify-content: center;
        }

        .folders-layout.collapsed .folder-icon {
          margin-right: 0;
        }

        .folders-layout.collapsed .folder-info,
        .folders-layout.collapsed .folder-actions {
          display: none;
        }

        .folders-layout.collapsed.show-files .folders-sidebar {
          display: none;
        }

        .folders-layout.collapsed.show-files .folder-files {
          display: flex;
        }

        .back-btn {
          width: 32px;
          height: 32px;
          background: none;
          border: none;
          color: var(--color-text);
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }

        .back-btn:hover {
          background: var(--color-hover, rgba(128,128,128,0.2));
        }

        .folder-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid var(--color-border);
          transition: background 0.2s;
        }

        .folder-item:hover {
          background: var(--color-hover, rgba(128,128,128,0.1));
        }

        .folder-item.active {
          background: var(--color-primary-transparent, rgba(0,120,212,0.2));
        }

        .folder-icon {
          color: var(--color-primary);
          margin-right: 12px;
        }

        .folder-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .folder-name {
          font-size: 14px;
          color: var(--color-text);
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .folder-count {
          font-size: 12px;
          color: var(--color-text-secondary);
        }

        .folder-actions {
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .folder-item:hover .folder-actions {
          opacity: 1;
        }

        .folder-action-btn {
          width: 28px;
          height: 28px;
          background: none;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .folder-action-btn:hover {
          background: var(--color-hover, rgba(128,128,128,0.2));
          color: var(--color-text);
        }

        .folder-action-btn.delete:hover {
          background: rgba(255,0,0,0.2);
          color: #ff4444;
        }

        .folder-files {
          flex: 1;
          background: var(--color-card-bg, rgba(255,255,255,0.05));
          border-radius: 8px;
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .folder-files-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--color-border);
        }

        .folder-files-title {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
        }

        .folder-files-title h3 {
          margin: 0;
          font-size: 16px;
          color: var(--color-text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .files-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
        }

        .files-loading,
        .files-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: var(--color-text-secondary);
        }

        .file-item {
          display: flex;
          align-items: center;
          padding: 10px 20px;
          gap: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .file-item:hover {
          background: var(--color-hover, rgba(128,128,128,0.1));
        }

        .file-number {
          width: 24px;
          text-align: center;
          font-size: 12px;
          color: var(--color-text-secondary);
        }

        .file-item svg {
          color: var(--color-primary);
        }

        .file-name {
          flex: 1;
          font-size: 14px;
          color: var(--color-text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-add-btn {
          width: 28px;
          height: 28px;
          background: none;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.2s;
        }

        .file-item:hover .file-add-btn {
          opacity: 1;
        }

        .file-add-btn:hover {
          background: var(--color-primary);
          color: white;
        }

        .no-folder-selected {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          gap: 12px;
        }

        .no-folder-selected svg {
          width: 48px;
          height: 48px;
          opacity: 0.5;
        }

        .no-folder-selected p {
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export default Folders;
