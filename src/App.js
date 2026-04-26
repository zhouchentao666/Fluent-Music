import React, { useState, useRef, useEffect } from 'react';
import {
  AppContainer, AppTheme, Button, SliderBar,
  NavBar, NavBarLink, NavPageContainer, Dialog
} from 'react-windows-ui';
import Settings, { SettingsIcon, translations } from './components/Settings';

const themeColors = {
  default: '#0078D4',
  red: '#E81123',
  green: '#107C10',
  purple: '#881798',
  orange: '#D83B01',
  pink: '#E3008C',
  teal: '#008272',
  yellow: '#FFB900',
};

const getThemeColor = (theme) => themeColors[theme] || themeColors.default;

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const MusicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

const PrevIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
  </svg>
);

const NextIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
  </svg>
);

const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M2.22 2.22l3.58 3.58-3.58 3.58 1.42 1.42 3.58-3.58 3.58 3.58 1.42-1.42-3.58-3.58 3.58-3.58-1.42-1.42-3.58 3.58-3.58-3.58-1.42 1.42z"/>
  </svg>
);

const MaximizeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M2 2h8v8H2V2zm1 1v6h6V3H3z"/>
  </svg>
);

const MinimizeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <rect x="2" y="5.5" width="8" height="1"/>
  </svg>
);

function App() {
  // 多歌单状态管理
  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('playlists');
    if (saved) {
      return JSON.parse(saved);
    }
    return [{ id: 'default', name: '默认歌单', tracks: [] }];
  });
  const [currentPlaylistId, setCurrentPlaylistId] = useState(() => {
    const saved = localStorage.getItem('currentPlaylistId');
    return saved || 'default';
  });
  
  const currentPlaylist = playlists.find(p => p.id === currentPlaylistId) || playlists[0];
  const playlist = currentPlaylist?.tracks || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState('music');
  const [newPlaylistDialog, setNewPlaylistDialog] = useState({ isOpen: false, name: '' });
  const [deletePlaylistDialog, setDeletePlaylistDialog] = useState({ isOpen: false, playlistId: null, playlistName: '' });
  const [editPlaylistDialog, setEditPlaylistDialog] = useState({ isOpen: false, playlistId: null, name: '' });
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'default';
  });
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'zh';
  });
  const [colorScheme, setColorScheme] = useState(() => {
    const saved = localStorage.getItem('colorScheme');
    return saved || 'dark';
  });
  const audioRef = useRef(null);

  const currentTrack = playlist[currentIndex];
  const t = translations[language] || translations.zh;

  // 根据配色方案计算实际的 darkMode 值
  const getActualDarkMode = () => {
    if (colorScheme === 'auto') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return colorScheme === 'dark';
  };

  const actualDarkMode = getActualDarkMode();

  // 保存设置到本地存储
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('colorScheme', colorScheme);
  }, [colorScheme]);

  // 保存歌单到本地存储
  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('currentPlaylistId', currentPlaylistId);
  }, [currentPlaylistId]);

  useEffect(() => {
    if (audioRef.current && isFinite(volume)) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  // 清理音频URL
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const loadAudioFile = async (filePath) => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.readAudioFile(filePath);
        if (result.success) {
          // 将base64转换为blob
          const byteCharacters = atob(result.data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'audio/mpeg' });
          const url = URL.createObjectURL(blob);
          return url;
        }
      }
    } catch (error) {
      console.error('Error loading audio file:', error);
    }
    return null;
  };

  const handleAddFiles = async () => {
    if (window.electronAPI) {
      const files = await window.electronAPI.openFileDialog();
      if (files.length > 0) {
        // 获取每个文件的元数据
        const newTracks = await Promise.all(
          files.map(async (filePath) => {
            const fileName = filePath.split(/[\\/]/).pop();
            let metadata = {};
            try {
              const fileInfo = await window.electronAPI.getFileInfo(filePath);
              if (fileInfo.success && fileInfo.metadata) {
                metadata = fileInfo.metadata;
              }
            } catch (e) {
              console.warn('Failed to get metadata for:', filePath);
            }
            // 如果元数据缺失，标题显示文件名（去掉扩展名），艺术家显示"未知"
            const hasMetadata = metadata.title || metadata.artist;
            return {
              path: filePath,
              name: fileName,
              title: hasMetadata ? (metadata.title || fileName.replace(/\.[^/.]+$/, '')) : fileName.replace(/\.[^/.]+$/, ''),
              artist: hasMetadata ? (metadata.artist || t.unknownArtist || '未知艺术家') : (t.unknownArtist || '未知艺术家'),
              album: metadata.album || '',
              duration: metadata.duration || 0
            };
          })
        );
        // 添加到当前歌单
        setPlaylists(prev => prev.map(p => 
          p.id === currentPlaylistId 
            ? { ...p, tracks: [...p.tracks, ...newTracks] }
            : p
        ));
      }
    }
  };

  // 新建歌单
  const handleCreatePlaylist = () => {
    if (newPlaylistDialog.name.trim()) {
      const newPlaylist = {
        id: Date.now().toString(),
        name: newPlaylistDialog.name.trim(),
        tracks: []
      };
      setPlaylists(prev => [...prev, newPlaylist]);
      setCurrentPlaylistId(newPlaylist.id);
      setNewPlaylistDialog({ isOpen: false, name: '' });
    }
  };

  // 删除歌单 - 打开确认对话框
  const handleDeletePlaylist = (playlistId, playlistName) => {
    if (playlists.length <= 1) return; // 至少保留一个歌单
    setDeletePlaylistDialog({ isOpen: true, playlistId, playlistName });
  };

  // 确认删除歌单
  const confirmDeletePlaylist = () => {
    const playlistId = deletePlaylistDialog.playlistId;
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    if (currentPlaylistId === playlistId) {
      setCurrentPlaylistId(playlists.find(p => p.id !== playlistId)?.id || playlists[0]?.id);
    }
    setDeletePlaylistDialog({ isOpen: false, playlistId: null, playlistName: '' });
  };

  // 取消删除歌单
  const cancelDeletePlaylist = () => {
    setDeletePlaylistDialog({ isOpen: false, playlistId: null, playlistName: '' });
  };

  // 打开编辑歌单对话框
  const handleOpenEditDialog = (playlistId, currentName) => {
    setEditPlaylistDialog({ isOpen: true, playlistId, name: currentName });
  };

  // 确认编辑歌单
  const confirmEditPlaylist = () => {
    if (editPlaylistDialog.name.trim()) {
      setPlaylists(prev => prev.map(p => 
        p.id === editPlaylistDialog.playlistId ? { ...p, name: editPlaylistDialog.name.trim() } : p
      ));
      setEditPlaylistDialog({ isOpen: false, playlistId: null, name: '' });
    }
  };

  // 取消编辑歌单
  const cancelEditPlaylist = () => {
    setEditPlaylistDialog({ isOpen: false, playlistId: null, name: '' });
  };

  const handlePlay = async () => {
    if (playlist.length === 0) return;
    
    if (!audioRef.current && currentTrack) {
      const url = await loadAudioFile(currentTrack.path);
      if (url) {
        setAudioUrl(url);
        audioRef.current = new Audio(url);
        audioRef.current.volume = volume;
        audioRef.current.onloadedmetadata = () => {
          if (!audioRef.current) return;
          const dur = audioRef.current.duration;
          if (isFinite(dur)) {
            setDuration(dur);
          }
        };
        audioRef.current.ontimeupdate = () => {
          if (!audioRef.current) return;
          const current = audioRef.current.currentTime;
          const dur = audioRef.current.duration;
          if (isFinite(current) && isFinite(dur) && dur > 0) {
            setCurrentTime(current);
            setProgress((current / dur) * 100);
          }
        };
        audioRef.current.onended = () => {
          if (audioRef.current) handleNext();
        };
      }
    }
    
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current?.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Play error:', err);
        setIsPlaying(false);
      }
    }
  };

  const handleSelectTrack = async (index) => {
    setCurrentIndex(index);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    if (playlist[index]) {
      const url = await loadAudioFile(playlist[index].path);
      if (url) {
        setAudioUrl(url);
        audioRef.current = new Audio(url);
        audioRef.current.volume = isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.8;
        audioRef.current.onloadedmetadata = () => {
          if (!audioRef.current) return;
          const dur = audioRef.current.duration;
          if (isFinite(dur)) {
            setDuration(dur);
          }
        };
        audioRef.current.ontimeupdate = () => {
          if (!audioRef.current) return;
          const current = audioRef.current.currentTime;
          const dur = audioRef.current.duration;
          if (isFinite(current) && isFinite(dur) && dur > 0) {
            setCurrentTime(current);
            setProgress((current / dur) * 100);
          }
        };
        audioRef.current.onended = () => {
          if (audioRef.current) handleNext();
        };
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.error('Play error:', err);
          setIsPlaying(false);
        }
      }
    }
  };

  const handlePrev = () => {
    if (playlist.length === 0) return;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
    handleSelectTrack(newIndex);
  };

  const handleNext = () => {
    if (playlist.length === 0) return;
    const newIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
    handleSelectTrack(newIndex);
  };

  const handleSeek = (e) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current && duration && isFinite(value)) {
      const newTime = (value / 100) * duration;
      if (isFinite(newTime)) {
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        setProgress(value);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    if (isFinite(value)) {
      setVolume(Math.max(0, Math.min(1, value / 100)));
    }
  };

  const handleRemoveTrack = (index) => {
    const newTracks = [...playlist];
    newTracks.splice(index, 1);
    setPlaylists(prev => prev.map(p => 
      p.id === currentPlaylistId ? { ...p, tracks: newTracks } : p
    ));
    if (index === currentIndex) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else if (index < currentIndex) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMinimize = () => window.electronAPI?.minimizeWindow();
  const handleMaximize = () => window.electronAPI?.maximizeWindow();
  const handleClose = () => window.electronAPI?.closeWindow();

  // 格式化时长
  const formatDuration = (seconds) => {
    if (!seconds || !isFinite(seconds)) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <AppTheme
        scheme={actualDarkMode ? 'dark' : 'light'}
        color={getThemeColor(theme)}
        colorDarkMode={getThemeColor(theme)}
      />
      <AppContainer style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="app">
        <div className="titlebar">
          <div className="titlebar-drag">
            <span className="title"><FolderIcon /> FluentMusic</span>
          </div>
          <div className="titlebar-controls">
            <button className="titlebar-btn" onClick={handleMinimize}><MinimizeIcon /></button>
            <button className="titlebar-btn" onClick={handleMaximize}><MaximizeIcon /></button>
            <button className="titlebar-btn close" onClick={handleClose}><CloseIcon /></button>
          </div>
        </div>
        
        <div className="main-layout">
          <NavBar className="sidebar-nav">
            <NavBarLink
              text={t.playlist || 'Playlist'}
              active={currentPage === 'music'}
              onClick={() => setCurrentPage('music')}
              icon={<i className="icons10-music"></i>}
            />
            <NavBarLink
              text={t.settings}
              active={currentPage === 'settings'}
              onClick={() => setCurrentPage('settings')}
              icon={<i className="icons10-settings"></i>}
            />
          </NavBar>
          
          <div className="content-area">
            <NavPageContainer className="nav-page-container">
              {currentPage === 'music' && (
                <div className="page-content">
                  {/* 歌单列表侧边栏 */}
                  <div className="playlist-sidebar">
                    <div className="playlist-sidebar-header">
                      <h3>{t.myPlaylists || '我的歌单'}</h3>
                      <button 
                        className="new-playlist-btn"
                        onClick={() => setNewPlaylistDialog({ isOpen: true, name: '' })}
                        title={t.newPlaylist || '新建歌单'}
                      >
                        +
                      </button>
                    </div>
                    <div className="playlist-list">
                      {playlists.map(p => (
                        <div
                          key={p.id}
                          className={`playlist-item ${p.id === currentPlaylistId ? 'active' : ''}`}
                          onClick={() => setCurrentPlaylistId(p.id)}
                        >
                          <span className="playlist-item-name">{p.name}</span>
                          <span className="playlist-item-count">{p.tracks.length}</span>
                          <div className="playlist-item-actions">
                            <button
                              className="playlist-item-edit"
                              onClick={(e) => { e.stopPropagation(); handleOpenEditDialog(p.id, p.name); }}
                              title={t.edit || '编辑'}
                            >
                              ✎
                            </button>
                            {playlists.length > 1 && (
                              <button
                                className="playlist-item-delete"
                                onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(p.id, p.name); }}
                                title={t.delete || '删除'}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="playlist-main">
                    <div className="playlist-section">
                      <div className="section-header">
                        <h2>{currentPlaylist?.name}</h2>
                        <Button type="primary" icon={<FolderIcon />} value={t.addMusic} onClick={handleAddFiles} />
                      </div>

                      <div className="playlist-table">
                        {playlist.length === 0 ? (
                          <div className="empty-state">
                            <MusicIcon />
                            <p>{t.noMusic}</p>
                            <Button type="secondary" value={t.addMusic} onClick={handleAddFiles} />
                          </div>
                        ) : (
                          playlist.map((track, index) => (
                            <div
                              key={index}
                              className={`playlist-row ${index === currentIndex ? 'active' : ''}`}
                              onClick={() => handleSelectTrack(index)}
                            >
                              <span className="row-number">{index + 1}</span>
                              <div className="row-info">
                                <span className="row-title">{track.title || track.name}</span>
                                <span className="row-artist">{track.artist}</span>
                              </div>
                              <span className="row-duration">
                                {track.duration ? formatDuration(track.duration) : '--:--'}
                              </span>
                              <span className="row-action">
                                {isPlaying && index === currentIndex ? '▶' : '♪'}
                              </span>
                              <button className="row-remove" onClick={(e) => { e.stopPropagation(); handleRemoveTrack(index); }}>×</button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentPage === 'settings' && (
                <Settings
                  currentTheme={theme}
                  currentLang={language}
                  currentColorScheme={colorScheme}
                onThemeChange={setTheme}
                onLangChange={setLanguage}
                onColorSchemeChange={setColorScheme}
              />
            )}
          </NavPageContainer>
          
          {/* 新建歌单对话框 */}
          <Dialog
            isVisible={newPlaylistDialog.isOpen}
            onBackdropPress={() => setNewPlaylistDialog({ isOpen: false, name: '' })}
          >
            <Dialog.Body style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-text)' }}>
                {t.newPlaylist || '新建歌单'}
              </h3>
              <input
                type="text"
                value={newPlaylistDialog.name}
                onChange={(e) => setNewPlaylistDialog(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t.playlistName || '歌单名称'}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-card-bg)',
                  color: 'var(--color-text)',
                  fontSize: '14px',
                  marginBottom: '20px',
                  outline: 'none'
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                autoFocus
              />
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <Button
                  value={t.cancel || '取消'}
                  onClick={() => setNewPlaylistDialog({ isOpen: false, name: '' })}
                />
                <Button
                  value={t.create || '创建'}
                  type="primary"
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistDialog.name.trim()}
                />
              </div>
            </Dialog.Body>
          </Dialog>
          
          {/* 删除歌单确认对话框 */}
          <Dialog
            isVisible={deletePlaylistDialog.isOpen}
            onBackdropPress={cancelDeletePlaylist}
          >
            <Dialog.Body style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-text)' }}>
                {t.deletePlaylist || '删除歌单'}
              </h3>
              <p style={{ margin: '0 0 20px 0', color: 'var(--color-text-secondary)' }}>
                {(t.confirmDeletePlaylist || '确定要删除歌单 "{playlistName}" 吗？').replace('{playlistName}', deletePlaylistDialog.playlistName)}
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <Button
                  value={t.cancel || '取消'}
                  onClick={cancelDeletePlaylist}
                />
                <Button
                  value={t.delete || '删除'}
                  type="primary"
                  style={{ background: '#e81123' }}
                  onClick={confirmDeletePlaylist}
                />
              </div>
            </Dialog.Body>
          </Dialog>
          
          {/* 编辑歌单名称对话框 */}
          <Dialog
            isVisible={editPlaylistDialog.isOpen}
            onBackdropPress={cancelEditPlaylist}
          >
            <Dialog.Body style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-text)' }}>
                {t.editPlaylist || '编辑歌单'}
              </h3>
              <input
                type="text"
                value={editPlaylistDialog.name}
                onChange={(e) => setEditPlaylistDialog(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t.playlistName || '歌单名称'}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-card-bg)',
                  color: 'var(--color-text)',
                  fontSize: '14px',
                  marginBottom: '20px',
                  outline: 'none'
                }}
                onKeyDown={(e) => e.key === 'Enter' && confirmEditPlaylist()}
                autoFocus
              />
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <Button
                  value={t.cancel || '取消'}
                  onClick={cancelEditPlaylist}
                />
                <Button
                  value={t.save || '保存'}
                  type="primary"
                  onClick={confirmEditPlaylist}
                  disabled={!editPlaylistDialog.name.trim()}
                />
              </div>
            </Dialog.Body>
          </Dialog>
          
          {/* 底部播放器 - 自定义组件 */}
          <div className="bottom-player">
            <div className="player-left">
              {currentTrack ? (
                <>
                  <div className="player-album-art"><MusicIcon /></div>
                  <div className="player-track-info">
                    <span className="player-track-name">{currentTrack.name}</span>
                    <span className="player-track-status">{t.nowPlaying}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="player-album-art"><MusicIcon /></div>
                  <div className="player-track-info">
                    <span className="player-track-name">{t.selectSong}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="player-center">
              <div className="player-controls">
                <button className="player-control-btn" onClick={handlePrev} disabled={playlist.length === 0}>
                  <PrevIcon />
                </button>
                <button 
                  className="player-play-btn" 
                  onClick={handlePlay}
                  disabled={playlist.length === 0}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button className="player-control-btn" onClick={handleNext} disabled={playlist.length === 0}>
                  <NextIcon />
                </button>
              </div>
              <div className="player-progress">
                <span className="player-time">{formatTime(currentTime)}</span>
                <div className="player-progress-bar">
                  <SliderBar
                    value={progress}
                    onChange={handleSeek}
                    disabled={!currentTrack}
                  />
                </div>
                <span className="player-time">{formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="player-right">
              <span className="player-volume-icon">🔊</span>
              <div className="player-volume-slider">
                <SliderBar
                  value={volume * 100}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <style>{`
        .app {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--color-background);
        }

        .titlebar {
          height: 32px;
          background: var(--color-card-bg, var(--color-background));
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--color-border);
        }

        .titlebar-drag {
          flex: 1;
          padding-left: 12px;
          -webkit-app-region: drag;
        }

        .title {
          color: var(--color-text);
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .titlebar-controls {
          display: flex;
          -webkit-app-region: no-drag;
        }

        .titlebar-btn {
          width: 46px;
          height: 32px;
          background: none;
          border: none;
          color: var(--color-text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .titlebar-btn:hover { background: var(--color-hover, rgba(128,128,128,0.1)); }
        .titlebar-btn.close:hover { background: #e81123; color: #fff; }

        .main-layout {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .nav-page-container {
          flex: 1;
          overflow: hidden;
        }

        /* 底部播放器样式 */
        .bottom-player {
          height: 80px;
          background: var(--color-card-bg, rgba(255,255,255,0.05));
          border-top: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 24px;
          z-index: 100;
        }

        .player-left {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 250px;
          min-width: 200px;
        }

        .player-album-art {
          width: 48px;
          height: 48px;
          background: var(--color-primary-transparent, rgba(0,120,212,0.2));
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .player-track-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .player-track-name {
          font-size: 14px;
          color: var(--color-text);
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .player-track-status {
          font-size: 12px;
          color: var(--color-text-secondary);
        }

        .player-center {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          max-width: 600px;
          margin: 0 auto;
        }

        .player-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .player-control-btn {
          width: 36px;
          height: 36px;
          background: none;
          border: none;
          color: var(--color-text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .player-control-btn:hover:not(:disabled) {
          background: var(--color-hover, rgba(128,128,128,0.2));
        }

        .player-control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .player-play-btn {
          width: 44px;
          height: 44px;
          background: var(--color-primary);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: transform 0.2s, background 0.2s;
        }

        .player-play-btn:hover:not(:disabled) {
          transform: scale(1.05);
          background: var(--color-primary-hover, #106ebe);
        }

        .player-play-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .player-progress {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .player-time {
          font-size: 12px;
          color: var(--color-text-secondary);
          min-width: 40px;
          text-align: center;
        }

        .player-progress-bar {
          flex: 1;
        }

        .player-right {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 150px;
          min-width: 120px;
          justify-content: flex-end;
        }

        .player-volume-icon {
          font-size: 16px;
        }

        .player-volume-slider {
          width: 100px;
        }

        .sidebar-nav {
          width: 200px !important;
          min-width: 200px !important;
          height: 100% !important;
          background: var(--color-card-bg, var(--color-background)) !important;
          border-right: 1px solid var(--color-border) !important;
        }

        .sidebar-nav .winui-navbar {
          background: var(--color-card-bg, var(--color-background)) !important;
          height: 100% !important;
        }

        .page-content {
          flex: 1;
          display: flex;
          flex-direction: row;
          background: var(--color-background);
          overflow: hidden;
          height: 100%;
        }

        .playlist-sidebar {
          width: 200px;
          min-width: 200px;
          background: var(--color-card-bg, rgba(255,255,255,0.05));
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
        }

        .playlist-sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--color-border);
        }

        .playlist-sidebar-header h3 {
          margin: 0;
          font-size: 14px;
          color: var(--color-text);
        }

        .new-playlist-btn {
          width: 28px;
          height: 28px;
          background: var(--color-primary);
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 4px;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .new-playlist-btn:hover {
          background: var(--color-primary-hover, #106ebe);
        }

        .playlist-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }

        .playlist-item {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.2s;
          gap: 8px;
        }

        .playlist-item:hover {
          background: var(--color-hover, rgba(128,128,128,0.1));
        }

        .playlist-item.active {
          background: var(--color-primary-transparent, rgba(0,120,212,0.2));
        }

        .playlist-item-name {
          flex: 1;
          font-size: 14px;
          color: var(--color-text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .playlist-item-count {
          font-size: 12px;
          color: var(--color-text-secondary);
          min-width: 20px;
          text-align: right;
        }

        .playlist-item-actions {
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .playlist-item:hover .playlist-item-actions {
          opacity: 1;
        }

        .playlist-item-edit {
          width: 20px;
          height: 20px;
          background: none;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .playlist-item-edit:hover {
          background: var(--color-primary-transparent, rgba(0,120,212,0.2));
          color: var(--color-primary);
        }

        .playlist-item-delete {
          width: 20px;
          height: 20px;
          background: none;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .playlist-item-delete:hover {
          background: rgba(255,0,0,0.2);
          color: #ff4444;
        }

        .playlist-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .playlist-section {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          min-height: 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-header h2 {
          color: var(--color-text);
          margin: 0;
        }

        .playlist-table {
          background: var(--color-card-bg, var(--color-background));
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--color-border);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: var(--color-text-secondary);
          gap: 16px;
        }

        .empty-state svg {
          width: 48px;
          height: 48px;
        }

        .playlist-row {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--color-border);
          cursor: pointer;
          transition: background 0.2s;
        }

        .playlist-row:hover { background: var(--color-hover, rgba(128,128,128,0.1)); }
        .playlist-row.active { background: var(--color-primary-transparent, rgba(0,120,212,0.2)); }

        .row-number {
          width: 32px;
          color: var(--color-text-secondary);
          font-size: 14px;
        }

        .row-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .row-title {
          color: var(--color-text);
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .row-artist {
          color: var(--color-text-secondary);
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .row-duration {
          width: 50px;
          color: var(--color-text-secondary);
          font-size: 12px;
          text-align: right;
        }

        .row-action {
          width: 32px;
          color: var(--color-primary);
          text-align: center;
        }

        .row-remove {
          width: 24px;
          background: none;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          font-size: 18px;
        }

        .row-remove:hover { color: #e81123; }
      `}</style>
      </AppContainer>
    </>
  );
}

export default App;