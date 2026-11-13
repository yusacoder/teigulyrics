
async function loadProfile() {
  const isTurkish = window.location.pathname.startsWith('/tr');
  const $ = (id) => document.getElementById(id);

  function safeUrl(value) {
    try {
      const url = new URL(value, window.location.href);
      if (!['http:', 'https:'].includes(url.protocol)) return '';
      return url.href;
    } catch {
      return '';
    }
  }

  function setText(id, value) {
    $(id).textContent = value || '';
  }

  try {
    const response = await fetch(isTurkish ? '/tr/data.json' : '/data.json');

    if (!response.ok) {
      throw new Error('data.json yüklenemedi.');
    }

    const data = await response.json();
    const { profile, appearance } = data;
    const root = document.documentElement;

    // BACKGROUND AND APPEARANCE

    const backgroundUrl = safeUrl(appearance.backgroundImage);

    root.style.setProperty(
      '--background-image',
      backgroundUrl ? `url("${backgroundUrl}")` : 'none'
    );

    root.style.setProperty('--background-blur', `${appearance.backgroundBlur}px`);
    root.style.setProperty('--background-darkness', appearance.backgroundDarkness);
    root.style.setProperty('--background-zoom', appearance.backgroundZoom);

    root.style.setProperty('--navbar-opacity', appearance.navbarOpacity);
    root.style.setProperty('--navbar-blur', `${appearance.navbarBlur}px`);

    root.style.setProperty('--card-opacity', appearance.cardOpacity);
    root.style.setProperty('--card-blur', `${appearance.cardBlur}px`);

    root.style.setProperty('--element-opacity', appearance.elementOpacity);
    root.style.setProperty('--element-blur', `${appearance.elementBlur}px`);

    root.style.setProperty('--border-opacity', appearance.borderOpacity);
    root.style.setProperty('--accent', appearance.accentColor);

    // PROFILE

    document.title = profile.name;
    setText('navbarLogo', profile.name);
    setText('name', profile.name);
    setText('username', profile.username);
    setText('description', profile.description);

    const avatar = $('avatar');
    avatar.src = safeUrl(profile.avatar) || 'https://placehold.co/400x400/171717/ffffff?text=TL';
    avatar.alt = `${profile.name} profil fotoğrafı`;

    avatar.onerror = () => {
      avatar.src = 'https://placehold.co/400x400/171717/ffffff?text=TL';
    };

    $('verified').hidden = !profile.verified;

    // BADGES

    const badgesContainer = $('badges');
    badgesContainer.replaceChildren();

    data.badges.forEach(item => {
      const badge = document.createElement('span');
      badge.className = `badge ${item.type || ''}`;
      badge.textContent = item.text;
      badgesContainer.appendChild(badge);
    });

    // ABOUT

    setText('aboutDescription', data.about.description);

    // TASKS

    const tasksContainer = $('tasks');
    tasksContainer.replaceChildren();

    data.tasks.forEach(item => {
      const card = document.createElement('article');
      card.className = 'task-card';

      const icon = document.createElement('i');
      icon.className = `${item.icon} task-icon`;

      const title = document.createElement('h3');
      title.textContent = item.title;

      const description = document.createElement('p');
      description.textContent = item.description;

      card.append(icon, title, description);
      tasksContainer.appendChild(card);
    });

    // COMPANY

    if (data.company.enabled) {
      const companyLogo = $('companyLogo');
      const companyLogoUrl = safeUrl(data.company.logo);

      companyLogo.src = companyLogoUrl || 'https://placehold.co/100x100/171717/ffffff?text=EP';
      companyLogo.onerror = () => {
        companyLogo.src = 'https://placehold.co/100x100/171717/ffffff?text=EP';
      };

      setText('companyName', data.company.name);
      setText('companyRole', data.company.role);

      $('companyLink').href = safeUrl(data.company.url) || '#';
    } else {
      $('companySection').hidden = true;
    }

    // SOCIALS

    const socialsContainer = $('socials');
    socialsContainer.replaceChildren();

    data.socials
      .filter(item => item.enabled && safeUrl(item.url))
      .forEach(item => {
        const link = document.createElement('a');

        link.className = 'social-link';
        link.href = safeUrl(item.url);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.title = item.name;
        link.setAttribute('aria-label', item.name);

        const icon = document.createElement('i');
        icon.className = item.icon;

        link.appendChild(icon);
        socialsContainer.appendChild(link);
      });

    // FOOTER

    setText('footerName', data.footer.text);
    setText(
      'footerCopyright',
      `© ${new Date().getFullYear()} ${data.footer.copyright}`
    );

  } catch (error) {
    console.error(error);

    const message = document.createElement('div');
    message.className = 'error-message';
    message.textContent = isTurkish ? 'Site yüklenemedi. Lütfen sayfayı yenileyin.' : 'The site could not load. Please refresh the page.';
    document.body.appendChild(message);
  }
}

loadProfile();
