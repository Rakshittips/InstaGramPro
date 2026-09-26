// ==========================================================================
// InstaPro — Complete Interactive Features & Real Working Tools
// ==========================================================================

// Global State
const state = {
  theme: localStorage.getItem('instapro_theme') || 'nova',
  activeTab: 'reels',
  currentScreenshotIdx: 0,
  currentPackage: 'clone'
};

// Screenshot metadata for lightbox
const screenshotsData = [
  { file: 'InstaPro-01.jpg', title: 'iOS-Style In-App Media Downloader', desc: 'Direct 1-tap HD download button integrated on all Reels, Feed posts, and Stories.' },
  { file: 'InstaPro-02.jpg', title: 'Stealth Ghost Mode Settings', desc: 'Anonymously view stories, hide DM seen receipts, and hide typing status in real time.' },
  { file: 'InstaPro-03.jpg', title: 'Custom iOS Story Fonts on Android', desc: 'Full suite of iOS story fonts (San Francisco, Neon, Modern Serif) with Apple iOS 17 emojis.' },
  { file: 'InstaPro-04.jpg', title: 'Direct Messages Anti-Delete', desc: 'Read recalled and deleted direct messages with original timestamp.' },
  { file: 'InstaPro-05.jpg', title: 'High-Res 1080p 60fps Downloader', desc: 'Download media in true uncompressed resolution directly to gallery.' },
  { file: 'InstaPro-06.jpg', title: 'App Lock with 4-Digit PIN & Fingerprint', desc: 'Protect your chats and app with biometric and PIN lock encryption.' },
  { file: 'InstaPro-07.jpg', title: '100% Ad-Free Feed & Stories', desc: 'Zero sponsored advertisements, commercial shopping tags, or video interruptions.' },
  { file: 'InstaPro-08.jpg', title: 'Reels Video Fast-Forward Scrubber', desc: 'Drag-to-seek, pause, and speed up video playback on any Reel.' },
  { file: 'InstaPro-09.jpg', title: 'Profile Picture Zoom & Downloader', desc: 'Long-press any user avatar to enlarge and download full-size HD profile picture.' },
  { file: 'InstaPro-010.jpg', title: 'Multiple Themes & AMOLED Pitch Black', desc: 'Choose from Nova Purple, Pulse Teal, Ember Orange, Ocean Depth, and AMOLED.' },
  { file: 'InstaPro-011.jpg', title: 'Multi-Account Manager & Chat Backup', desc: 'Switch accounts smoothly with local backup and restore.' },
  { file: 'InstaPro-012.jpg', title: 'Developer Settings & Speed Engine', desc: 'Optimized base 439.0.0.38.89 using up to 40% less RAM.' }
];

// --------------------------------------------------------------------------
// Initialization
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLightbox();
  initApkHub();
  initModals();
});

// --------------------------------------------------------------------------
// Toast Notification Engine
// --------------------------------------------------------------------------
let toastTimeout;
export function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  if (!toast || !toastText) return;
  toastText.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2200);

  // Subtle haptic feedback if supported on mobile
  if (navigator.vibrate) {
    try { navigator.vibrate(35); } catch (_) {}
  }
}

// --------------------------------------------------------------------------
// Theme Engine
// --------------------------------------------------------------------------
const themeNames = {
  nova: 'Nova Purple',
  pulse: 'Pulse Teal',
  ember: 'Ember Orange',
  depth: 'Ocean Depth',
  amoled: 'Midnight AMOLED',
  ioslight: 'iOS Light'
};

function initTheme() {
  setTheme(state.theme, false);
}

export function setTheme(name, notify = true) {
  state.theme = name;
  localStorage.setItem('instapro_theme', name);
  document.body.setAttribute('data-theme', name);

  document.querySelectorAll('.theme-option').forEach(el => {
    el.classList.toggle('active', el.dataset.themeChoice === name);
  });

  if (notify) {
    showToast(`${themeNames[name] || name} theme applied`);
  }
  closeThemePanel();
}

export function toggleThemePanel() {
  const panel = document.getElementById('themePanel');
  if (panel) panel.classList.toggle('open');
}

export function closeThemePanel() {
  const panel = document.getElementById('themePanel');
  if (panel) panel.classList.remove('open');
}

// --------------------------------------------------------------------------
// Drawer Navigation
// --------------------------------------------------------------------------
export function openMenu() {
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('overlay');
  if (drawer && overlay) {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

export function closeMenu() {
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('overlay');
  if (drawer && overlay) {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// --------------------------------------------------------------------------
// Screenshot Lightbox
// --------------------------------------------------------------------------
function initLightbox() {
  document.querySelectorAll('.screenshot-frame').forEach((frame, idx) => {
    frame.addEventListener('click', () => {
      openLightbox(idx);
    });
  });

  const prevBtn = document.getElementById('lbPrevBtn');
  const nextBtn = document.getElementById('lbNextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigateLightbox(1));
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightboxModal');
    if (modal && modal.classList.contains('active')) {
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'Escape') closeLightbox();
    }
  });
}

export function openLightbox(idx) {
  state.currentScreenshotIdx = idx;
  const item = screenshotsData[idx];
  if (!item) return;

  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lbImg');
  const title = document.getElementById('lbTitle');
  const desc = document.getElementById('lbDesc');
  const count = document.getElementById('lbCount');

  if (img) img.src = `/Screenshots/${item.file}`;
  if (title) title.textContent = item.title;
  if (desc) desc.textContent = item.desc;
  if (count) count.textContent = `${idx + 1} of ${screenshotsData.length}`;

  if (modal) modal.classList.add('active');
}

export function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('active');
}

function navigateLightbox(dir) {
  let newIdx = state.currentScreenshotIdx + dir;
  if (newIdx < 0) newIdx = screenshotsData.length - 1;
  if (newIdx >= screenshotsData.length) newIdx = 0;
  openLightbox(newIdx);
}

// --------------------------------------------------------------------------
// Official APK Download Station
// --------------------------------------------------------------------------
function initApkHub() {
  const startDlBtn = document.getElementById('startApkDlBtn');

  if (startDlBtn) {
    startDlBtn.addEventListener('click', () => {
      showToast('Opening official download link (DevUploads)...');
    });
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.faq-item');
      if (item) {
        item.classList.toggle('open');
      }
    });
  });
}

// --------------------------------------------------------------------------
// TOOL 7: Developer & Channel Profile Modal
// --------------------------------------------------------------------------
function initModals() {
  // Modal background click to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        clearTimeout(state.storyTimer);
      }
    });
  });
}

export function openDevModal() {
  closeMenu();
  const modal = document.getElementById('devModal');
  if (modal) modal.classList.add('active');
}

export function closeDevModal() {
  const modal = document.getElementById('devModal');
  if (modal) modal.classList.remove('active');
}

// --------------------------------------------------------------------------
// Utilities: File Downloader & Clipboard
// --------------------------------------------------------------------------
function triggerFileDownload(filename, content, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (_) {
    showToast('Copied to clipboard');
  }
  document.body.removeChild(textarea);
}

// Export for window access
window.instapro = {
  setTheme,
  toggleThemePanel,
  closeThemePanel,
  openMenu,
  closeMenu,
  openLightbox,
  closeLightbox,
  openDevModal,
  closeDevModal,
  showToast
};
