import React from 'react';
import {
  Select
} from 'react-windows-ui';

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.49l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
);

const themes = [
  { value: 'default', label: 'Default Blue' },
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' },
  { value: 'pink', label: 'Pink' },
  { value: 'teal', label: 'Teal' },
  { value: 'yellow', label: 'Yellow' },
];

const colorSchemes = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'auto', label: 'Auto' },
];

const languages = [
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' },
  { label: '日本語', value: 'ja' },
  { label: '한국어', value: 'ko' },
  { label: 'Français', value: 'fr' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Español', value: 'es' },
  { label: 'Русский', value: 'ru' },
];

const translations = {
  en: {
    settings: 'Settings',
    appearance: 'Appearance',
    themeColor: 'Theme Color',
    language: 'Language',
    darkMode: 'Dark Mode',
    save: 'Save',
    cancel: 'Cancel',
    general: 'General',
    myMusic: 'My Music',
    folders: 'Folders',
    playlist: 'Playlist',
    addMusic: 'Add Music',
    noMusic: 'No music in playlist',
    nowPlaying: 'Now Playing',
    selectSong: 'Select a song to play',
    addFolder: 'Add Folder',
    noFolders: 'No folders added',
    addFolderHint: 'Add a folder to scan for music files',
    folderCount: 'folders',
    songCount: 'songs',
    songs: 'songs',
    refresh: 'Refresh',
    remove: 'Remove',
    addAll: 'Add All to Playlist',
    scanning: 'Scanning...',
    noMusicInFolder: 'No music files found',
    addToPlaylist: 'Add to playlist',
    selectFolder: 'Select a folder to view files',
    colorScheme: 'Color Scheme',
    dark: 'Dark',
    light: 'Light',
    auto: 'Auto',
    confirmRemoveFolder: 'Are you sure you want to remove "{folderName}" from the list?',
    back: 'Back',
    myPlaylists: 'My Playlists',
    newPlaylist: 'New Playlist',
    playlistName: 'Playlist Name',
    create: 'Create',
    delete: 'Delete',
    deletePlaylist: 'Delete Playlist',
    confirmDeletePlaylist: 'Are you sure you want to delete the playlist "{playlistName}"?',
    edit: 'Edit',
    editPlaylist: 'Edit Playlist',
    save: 'Save',
    unknownArtist: 'Unknown Artist',
    unknownAlbum: 'Unknown Album',
  },
  zh: {
    settings: '设置',
    appearance: '外观',
    themeColor: '主题色',
    language: '语言',
    darkMode: '深色模式',
    save: '保存',
    cancel: '取消',
    general: '常规',
    myMusic: '我的音乐',
    folders: '文件夹',
    playlist: '歌单',
    addMusic: '添加音乐',
    noMusic: '播放列表中没有音乐',
    nowPlaying: '正在播放',
    selectSong: '选择一首歌曲播放',
    addFolder: '添加文件夹',
    noFolders: '未添加文件夹',
    addFolderHint: '添加文件夹以扫描音乐文件',
    folderCount: '个文件夹',
    songCount: '首歌曲',
    songs: '首歌曲',
    refresh: '刷新',
    remove: '移除',
    addAll: '全部添加到播放列表',
    scanning: '扫描中...',
    noMusicInFolder: '未找到音乐文件',
    addToPlaylist: '添加到播放列表',
    selectFolder: '选择文件夹查看文件',
    colorScheme: '配色方案',
    dark: '深色',
    light: '浅色',
    auto: '自动',
    confirmRemoveFolder: '确定要从列表中移除"{folderName}"吗？',
    back: '返回',
    myPlaylists: '我的歌单',
    newPlaylist: '新建歌单',
    playlistName: '歌单名称',
    create: '创建',
    delete: '删除',
    deletePlaylist: '删除歌单',
    confirmDeletePlaylist: '确定要删除歌单 "{playlistName}" 吗？',
    edit: '编辑',
    editPlaylist: '编辑歌单',
    save: '保存',
    unknownArtist: '未知艺术家',
    unknownAlbum: '未知专辑',
  },
  ja: {
    settings: '設定',
    appearance: '外観',
    themeColor: 'テーマカラー',
    language: '言語',
    darkMode: 'ダークモード',
    save: '保存',
    cancel: 'キャンセル',
    general: '一般',
    myMusic: 'マイミュージック',
    folders: 'フォルダ',
    playlist: 'プレイリスト',
    addMusic: '音楽を追加',
    noMusic: 'プレイリストに音楽がありません',
    nowPlaying: '再生中',
    selectSong: '曲を選択してください',
    confirmRemoveFolder: '「{folderName}」をリストから削除してもよろしいですか？',
    back: '戻る',
  },
  ko: {
    settings: '설정',
    appearance: '외관',
    themeColor: '테마 색상',
    language: '언어',
    darkMode: '다크 모드',
    save: '저장',
    cancel: '취소',
    general: '일반',
    myMusic: '내 음악',
    folders: '폴다',
    playlist: '재생 목록',
    addMusic: '음악 추가',
    noMusic: '재생 목록에 음악이 없습니다',
    nowPlaying: '재생 중',
    selectSong: '재생할 노래를 선택하세요',
    confirmRemoveFolder: '"{folderName}"을(를) 목록에서 제거하시겠습니까?',
    back: '뒤로',
  },
  fr: {
    settings: 'Paramètres',
    appearance: 'Apparence',
    themeColor: 'Couleur du thème',
    language: 'Langue',
    darkMode: 'Mode sombre',
    save: 'Enregistrer',
    cancel: 'Annuler',
    general: 'Général',
    myMusic: 'Ma Musique',
    folders: 'Dossiers',
    playlist: 'Playlist',
    addMusic: 'Ajouter de la musique',
    noMusic: 'Aucune musique dans la playlist',
    nowPlaying: 'Lecture en cours',
    selectSong: 'Sélectionnez une chanson à lire',
    confirmRemoveFolder: 'Voulez-vous vraiment supprimer "{folderName}" de la liste ?',
    back: 'Retour',
  },
  de: {
    settings: 'Einstellungen',
    appearance: 'Erscheinungsbild',
    themeColor: 'Themenfarbe',
    language: 'Sprache',
    darkMode: 'Dunkelmodus',
    save: 'Speichern',
    cancel: 'Abbrechen',
    general: 'Allgemein',
    myMusic: 'Meine Musik',
    folders: 'Ordner',
    playlist: 'Wiedergabeliste',
    addMusic: 'Musik hinzufügen',
    noMusic: 'Keine Musik in der Wiedergabeliste',
    nowPlaying: 'Jetzt wird gespielt',
    selectSong: 'Wählen Sie einen Song zum Abspielen aus',
    confirmRemoveFolder: 'Möchten Sie "{folderName}" wirklich aus der Liste entfernen?',
    back: 'Zurück',
  },
  es: {
    settings: 'Configuración',
    appearance: 'Apariencia',
    themeColor: 'Color del tema',
    language: 'Idioma',
    darkMode: 'Modo oscuro',
    save: 'Guardar',
    cancel: 'Cancelar',
    general: 'General',
    myMusic: 'Mi Música',
    folders: 'Carpetas',
    playlist: 'Lista de reproducción',
    addMusic: 'Agregar música',
    noMusic: 'No hay música en la lista de reproducción',
    nowPlaying: 'Reproduciendo',
    selectSong: 'Selecciona una canción para reproducir',
    confirmRemoveFolder: '¿Estás seguro de que quieres eliminar "{folderName}" de la lista?',
    back: 'Atrás',
  },
  ru: {
    settings: 'Настройки',
    appearance: 'Внешний вид',
    themeColor: 'Цвет темы',
    language: 'Язык',
    darkMode: 'Темный режим',
    save: 'Сохранить',
    cancel: 'Отмена',
    general: 'Общие',
    myMusic: 'Моя музыка',
    folders: 'Папки',
    playlist: 'Плейлист',
    addMusic: 'Добавить музыку',
    noMusic: 'В плейлисте нет музыки',
    nowPlaying: 'Сейчас играет',
    selectSong: 'Выберите песню для воспроизведения',
    confirmRemoveFolder: 'Вы уверены, что хотите удалить "{folderName}" из списка?',
    back: 'Назад',
  },
};

function Settings({ currentTheme, currentLang, currentColorScheme, onThemeChange, onLangChange, onColorSchemeChange }) {
  const t = translations[currentLang] || translations.en;

  // 自动保存：当值改变时立即调用回调
  const handleThemeChange = (theme) => {
    onThemeChange(theme);
  };

  const handleLangChange = (lang) => {
    onLangChange(lang);
  };

  const handleColorSchemeChange = (scheme) => {
    onColorSchemeChange(scheme);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>{t.settings}</h2>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h3>{t.general}</h3>
          
          <div className="setting-item">
            <label>{t.language}</label>
            <Select
              defaultValue={currentLang}
              onChange={(value) => handleLangChange(value)}
              data={languages}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>{t.appearance}</h3>
          
          <div className="setting-item">
            <label>{t.colorScheme || 'Color Scheme'}</label>
            <Select
              defaultValue={currentColorScheme || 'dark'}
              onChange={(value) => handleColorSchemeChange(value)}
              data={colorSchemes.map(scheme => ({
                value: scheme.value,
                label: t[scheme.value] || scheme.label
              }))}
            />
          </div>
          
          <div className="setting-item">
            <label>{t.themeColor}</label>
            <div className="theme-colors">
              {themes.map(theme => (
                <button
                  key={theme.value}
                  className={`theme-color-btn ${currentTheme === theme.value ? 'active' : ''}`}
                  style={{ backgroundColor: getThemeColor(theme.value) }}
                  onClick={() => handleThemeChange(theme.value)}
                  title={theme.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .settings-page {
          padding: 24px;
          height: 100%;
          overflow-y: auto;
        }

        .settings-header {
          margin-bottom: 24px;
        }

        .settings-header h2 {
          margin: 0;
          font-size: 24px;
          color: var(--color-text);
        }

        .settings-content {
          max-width: 100%;
          width: 100%;
        }

        .settings-section {
          margin-bottom: 32px;
          padding: 20px;
          background: var(--color-card-bg, rgba(255,255,255,0.05));
          border-radius: 8px;
          border: 1px solid var(--color-border);
        }

        .settings-section h3 {
          margin: 0 0 20px 0;
          font-size: 14px;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          letter-spacing: 0.5px;
        }

        .setting-item {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .setting-item:last-child {
          margin-bottom: 0;
        }

        .setting-item label {
          font-size: 14px;
          color: var(--color-text);
          font-weight: 500;
        }

        .theme-colors {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .theme-color-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 3px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-color-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .theme-color-btn.active {
          border-color: var(--color-text);
          box-shadow: 0 0 0 3px var(--color-background), 0 0 0 5px var(--color-primary);
        }

        .settings-footer {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--color-border);
        }
      `}</style>
    </div>
  );
}

function getThemeColor(theme) {
  const colors = {
    default: '#0078D4',
    red: '#E81123',
    green: '#107C10',
    purple: '#881798',
    orange: '#D83B01',
    pink: '#E3008C',
    teal: '#008272',
    yellow: '#FFB900',
  };
  return colors[theme] || colors.default;
}

export default Settings;
export { SettingsIcon, translations };
