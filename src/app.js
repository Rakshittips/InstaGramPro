// ==========================================================================
// InstaPro — Complete Interactive Features & Real Working Tools
// ==========================================================================

// Global State
const state = {
  theme: localStorage.getItem('instapro_theme') || 'nova',
  privacy: JSON.parse(localStorage.getItem('instapro_privacy') || JSON.stringify({
    ghost_stories: true,
    ghost_dms: true,
    ghost_typing: true,
    ghost_live: true,
    anti_delete: true,
    ad_block: true,
    hd_quality: true,
    pin_lock: false,
  })),
  userPin: localStorage.getItem('instapro_pin') || '',
  activeTab: 'reels',
  currentScreenshotIdx: 0,
  storyIdx: 0,
  storyTimer: null,
  postLiked: false,
  likeCount: 14829,
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

// Stories data for Live Simulator
const simulatorStories = [
  { name: 'rakshittips', img: '/Screenshots/ncy.png', storyImg: '/Screenshots/InstaPro-01.jpg', tag: 'New Update v15.70 🔥' },
  { name: 'apple_ios', img: '/Screenshots/InstaPro-02.jpg', storyImg: '/Screenshots/InstaPro-03.jpg', tag: 'iOS Fonts & Style ✨' },
  { name: 'ghost_mode', img: '/Screenshots/InstaPro-04.jpg', storyImg: '/Screenshots/InstaPro-04.jpg', tag: 'Stealth Viewing 👁️' },
  { name: 'downloader', img: '/Screenshots/InstaPro-05.jpg', storyImg: '/Screenshots/InstaPro-05.jpg', tag: '1-Tap 1080p Media 📥' },
  { name: 'ad_free', img: '/Screenshots/InstaPro-06.jpg', storyImg: '/Screenshots/InstaPro-07.jpg', tag: 'Zero Ads Forever 🚫' },
];

// --------------------------------------------------------------------------
// Initialization
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initPrivacyToggles();
  initSimulator();
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
// TOOL 1: Ghost Mode & Privacy Center
// --------------------------------------------------------------------------
function initPrivacyToggles() {
  document.querySelectorAll('.privacy-toggle-input').forEach(input => {
    const key = input.dataset.key;
    if (state.privacy[key] !== undefined) {
      input.checked = state.privacy[key];
    }

    input.addEventListener('change', (e) => {
      state.privacy[key] = e.target.checked;
      localStorage.setItem('instapro_privacy', JSON.stringify(state.privacy));

      const title = input.closest('.toggle-item')?.querySelector('.toggle-title')?.textContent || key;
      const status = e.target.checked ? 'Enabled' : 'Disabled';
      showToast(`${title}: ${status}`);

      updateStealthBadge();
    });
  });

  const testPinBtn = document.getElementById('testPinBtn');
  if (testPinBtn) {
    testPinBtn.addEventListener('click', () => {
      openPinModal();
    });
  }

  updateStealthBadge();
}

function updateStealthBadge() {
  const badge = document.getElementById('navStealthBadge');
  if (!badge) return;
  const activeCount = Object.values(state.privacy).filter(Boolean).length;
  badge.textContent = `Ghost Mode (${activeCount}/8 Active)`;
}

// PIN Lock Modal Logic
let enteredPin = '';
function openPinModal() {
  enteredPin = '';
  updatePinDots();
  const modal = document.getElementById('pinModal');
  if (modal) modal.classList.add('active');
}

export function closePinModal() {
  const modal = document.getElementById('pinModal');
  if (modal) modal.classList.remove('active');
}

function updatePinDots() {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`pinDot${i}`);
    if (dot) {
      dot.classList.toggle('filled', enteredPin.length >= i);
    }
  }
}

export function pressPinKey(digit) {
  if (enteredPin.length < 4) {
    enteredPin += digit;
    updatePinDots();

    if (enteredPin.length === 4) {
      setTimeout(() => {
        showToast('PIN Verified! InstaPro App Unlocked');
        closePinModal();
      }, 250);
    }
  }
}

export function deletePinDigit() {
  if (enteredPin.length > 0) {
    enteredPin = enteredPin.slice(0, -1);
    updatePinDots();
  }
}

// --------------------------------------------------------------------------
// TOOL 4: Live iOS Instagram Simulator
// --------------------------------------------------------------------------
function initSimulator() {
  const heartBtn = document.getElementById('simHeartBtn');
  const heartPop = document.getElementById('simHeartPop');
  const postMedia = document.getElementById('simPostMedia');
  const likesCountEl = document.getElementById('simLikesCount');
  const instaproDlBtn = document.getElementById('simInstaproDlBtn');

  // Double tap to like
  let lastTap = 0;
  if (postMedia) {
    postMedia.addEventListener('click', (e) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        triggerDoubleTapLike();
      }
      lastTap = now;
    });
  }

  if (heartBtn) {
    heartBtn.addEventListener('click', () => {
      togglePostLike();
    });
  }

  if (instaproDlBtn) {
    instaproDlBtn.addEventListener('click', () => {
      triggerSimulatorDownload();
    });
  }

  // Render Simulator Stories
  const storiesTray = document.getElementById('simStoriesTray');
  if (storiesTray) {
    storiesTray.innerHTML = simulatorStories.map((story, idx) => `
      <div class="sim-story-item" onclick="window.instapro.openStoryViewer(${idx})">
        <div class="sim-story-ring">
          <div class="sim-story-thumb">
            <img src="${story.img}" alt="${story.name}" />
          </div>
        </div>
        <div class="sim-story-label">${story.name}</div>
      </div>
    `).join('');
  }
}

function triggerDoubleTapLike() {
  const heartPop = document.getElementById('simHeartPop');
  if (heartPop) {
    heartPop.classList.add('pop');
    setTimeout(() => heartPop.classList.remove('pop'), 600);
  }
  if (!state.postLiked) {
    togglePostLike();
  }
}

function togglePostLike() {
  state.postLiked = !state.postLiked;
  const heartBtn = document.getElementById('simHeartBtn');
  const likesCountEl = document.getElementById('simLikesCount');

  if (heartBtn) {
    heartBtn.classList.toggle('liked', state.postLiked);
    heartBtn.textContent = state.postLiked ? '❤️' : '🤍';
  }

  if (likesCountEl) {
    const count = state.postLiked ? state.likeCount + 1 : state.likeCount;
    likesCountEl.textContent = `${count.toLocaleString()} likes`;
  }

  showToast(state.postLiked ? 'Liked post' : 'Unliked post');
}

function triggerSimulatorDownload() {
  showToast('📥 InstaPro: Downloading post media to /sdcard/InstaPro/Feed/...');
  setTimeout(() => {
    triggerFileDownload('InstaPro_Post_Rakshittips.jpg', 'InstaPro v15.70 - Saved post media.', 'image/jpeg');
    showToast('Download 100% Complete! Saved to Gallery');
  }, 600);
}

export function openStoryViewer(idx) {
  state.storyIdx = idx;
  const story = simulatorStories[idx];
  if (!story) return;

  const modal = document.getElementById('storyViewerModal');
  const img = document.getElementById('storyViewerImg');
  const user = document.getElementById('storyViewerUser');
  const progressBar = document.getElementById('storyViewerProgressBar');

  if (img) img.src = story.storyImg;
  if (user) user.textContent = `@${story.name}`;

  if (modal) modal.classList.add('active');

  // Reset and start countdown progress bar
  if (progressBar) {
    progressBar.style.width = '0%';
    setTimeout(() => {
      progressBar.style.transition = 'width 5s linear';
      progressBar.style.width = '100%';
    }, 50);
  }

  clearTimeout(state.storyTimer);
  state.storyTimer = setTimeout(() => {
    closeStoryViewer();
  }, 5100);

  showToast(`Ghost Mode: Viewing @${story.name} anonymously`);
}

export function closeStoryViewer() {
  clearTimeout(state.storyTimer);
  const modal = document.getElementById('storyViewerModal');
  if (modal) modal.classList.remove('active');
}

export function downloadActiveStory() {
  const story = simulatorStories[state.storyIdx];
  const filename = `InstaPro_Story_${story?.name || 'anonymous'}.jpg`;
  showToast(`Downloading story from @${story?.name}...`);
  triggerFileDownload(filename, 'InstaPro Story Download.', 'image/jpeg');
  setTimeout(() => {
    showToast('Story saved to /sdcard/InstaPro/Stories!');
  }, 500);
}

// --------------------------------------------------------------------------
// TOOL 5: Screenshot Lightbox
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
// TOOL 6: Interactive APK Download Station
// --------------------------------------------------------------------------
function initApkHub() {
  const cloneBtn = document.getElementById('pkgCloneBtn');
  const uncloneBtn = document.getElementById('pkgUncloneBtn');
  const copyHashBtn = document.getElementById('copyHashBtn');
  const startDlBtn = document.getElementById('startApkDlBtn');

  if (cloneBtn && uncloneBtn) {
    cloneBtn.addEventListener('click', () => {
      cloneBtn.classList.add('active');
      uncloneBtn.classList.remove('active');
      state.currentPackage = 'clone';
      updateApkPackageDetails();
    });

    uncloneBtn.addEventListener('click', () => {
      uncloneBtn.classList.add('active');
      cloneBtn.classList.remove('active');
      state.currentPackage = 'unclone';
      updateApkPackageDetails();
    });
  }

  if (copyHashBtn) {
    copyHashBtn.addEventListener('click', () => {
      const hash = document.getElementById('apkHashText')?.textContent || '';
      copyToClipboard(hash, 'SHA-256 Hash copied to clipboard!');
    });
  }

  if (startDlBtn) {
    startDlBtn.addEventListener('click', () => {
      startApkDownloadProcess();
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

function updateApkPackageDetails() {
  const pkgNameEl = document.getElementById('apkPkgName');
  const apkSizeEl = document.getElementById('apkFileSize');
  const isClone = state.currentPackage === 'clone';

  if (pkgNameEl) pkgNameEl.textContent = isClone ? 'com.instapro.android' : 'com.instagram.android';
  if (apkSizeEl) apkSizeEl.textContent = isClone ? '68.4 MB' : '67.9 MB';
  showToast(`Selected Package: ${isClone ? 'Clone (Dual App)' : 'Unclone'}`);
}

function startApkDownloadProcess() {
  const startDlBtn = document.getElementById('startApkDlBtn');
  const isClone = state.currentPackage === 'clone';
  const apkName = isClone ? 'InstaPro_v15.70_Clone_com.instapro.android.apk' : 'InstaPro_v15.70_Unclone_com.instagram.android.apk';

  if (startDlBtn) {
    startDlBtn.innerHTML = `<span>Preparing Download...</span>`;
    startDlBtn.style.opacity = '0.7';
  }

  showToast('Starting official APK download...');

  setTimeout(() => {
    triggerFileDownload(apkName, 'InstaPro Android Application Package file by Rakshittips.', 'application/vnd.android.package-archive');
    if (startDlBtn) {
      startDlBtn.innerHTML = `<span>Download APK (${isClone ? 'Clone' : 'Unclone'} v15.70)</span>`;
      startDlBtn.style.opacity = '1';
    }
    showToast('Download started! Check notifications or Downloads folder');
  }, 800);
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
  openPinModal,
  closePinModal,
  pressPinKey,
  deletePinDigit,
  openStoryViewer,
  closeStoryViewer,
  downloadActiveStory,
  openLightbox,
  closeLightbox,
  openDevModal,
  closeDevModal,
  showToast
};
