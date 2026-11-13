async function loadTeigu() {
  const error = document.getElementById('errorMessage');
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error('data.json yüklenemedi.');
    const data = await response.json();
    const root = document.documentElement;
    const clamp = (value, min, max, fallback) => {
      const number = Number(value);
      return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
    };
    root.style.setProperty('--accent', data.appearance.accentColor || '#e53a43');
    root.style.setProperty('--accent-dark', data.appearance.accentDark || '#791a22');
    root.style.setProperty('--background-darkness', clamp(data.appearance.backgroundDarkness, 0, 1, .35));

    document.title = data.site.title;
    document.getElementById('aboutText').textContent = data.site.about;
    document.getElementById('footerText').textContent = data.site.footer;
    const tracks = data.tracks || [];
    document.getElementById('trackCount').textContent = String(tracks.length).padStart(2, '0') + ' PARÇA';
    const grid = document.getElementById('tracksGrid');
    grid.replaceChildren();
    tracks.forEach((track, index) => {
      const article = document.createElement('article');
      article.className = 'track-card';
      const cover = document.createElement('div');
      cover.className = 'track-cover';
      cover.style.setProperty('--cover', track.color || '#a62330');
      cover.setAttribute('aria-hidden', 'true');
      const number = document.createElement('span');
      number.className = 'track-number';
      number.textContent = String(index + 1).padStart(2, '0');
      const sigil = document.createElement('span');
      sigil.className = 'track-sigil';
      sigil.textContent = track.sigil || '帝具';
      const play = document.createElement('span');
      play.className = 'play-mark';
      play.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i>';
      cover.append(number, sigil, play);
      const meta = document.createElement('div');
      meta.className = 'track-meta';
      const title = document.createElement('h3');
      title.textContent = track.title;
      const subtitle = document.createElement('p');
      subtitle.textContent = track.subtitle;
      const tag = document.createElement('span');
      tag.className = 'track-tag';
      tag.textContent = track.character;
      meta.append(title, subtitle, tag);
      article.append(cover, meta);
      grid.appendChild(article);
    });
    const themes = document.getElementById('themesGrid');
    themes.replaceChildren();
    (data.themes || []).forEach(theme => {
      const card = document.createElement('article');
      card.className = 'theme-card';
      const icon = document.createElement('i');
      icon.className = theme.icon;
      icon.setAttribute('aria-hidden', 'true');
      const title = document.createElement('h3');
      title.textContent = theme.title;
      const description = document.createElement('p');
      description.textContent = theme.description;
      card.append(icon, title, description);
      themes.appendChild(card);
    });
  } catch (error) {
    console.error('TeiguLyrics yükleme hatası:', error);
    error.hidden = false;
  }
}
loadTeigu();