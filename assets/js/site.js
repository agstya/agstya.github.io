(function () {
  "use strict";

  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  document.body.classList.add("js-ready");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!finePointer.matches || reducedMotion.matches) document.body.classList.add("skip-reveals");
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = themeToggle?.querySelector(".theme-icon");
  const themeLabel = themeToggle?.querySelector(".theme-label");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.getElementById("nav-links");

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const formatDate = (value) => new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));

  function setTheme(theme, persist) {
    const nextTheme = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    themeToggle?.setAttribute("aria-label", `${nextTheme === "dark" ? "Dark" : "Light"} theme active. Switch to ${nextTheme === "dark" ? "light" : "dark"} mode`);
    themeToggle?.setAttribute("title", `Switch to ${nextTheme === "dark" ? "light" : "dark"} mode`);
    if (themeIcon) themeIcon.textContent = nextTheme === "dark" ? "☾" : "☀";
    if (themeLabel) themeLabel.textContent = nextTheme === "dark" ? "Dark" : "Light";
    if (themeMeta) themeMeta.content = nextTheme === "dark" ? "#06080f" : "#f4f8fb";
    if (persist) localStorage.setItem("agastya-theme", nextTheme);
  }

  setTheme(document.documentElement.dataset.theme, false);
  themeToggle?.addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
  });

  function closeMenu() {
    navLinks?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    const label = menuToggle?.querySelector(".sr-only");
    if (label) label.textContent = "Open navigation";
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = !navLinks?.classList.contains("open");
    navLinks?.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    const label = menuToggle.querySelector(".sr-only");
    if (label) label.textContent = isOpen ? "Close navigation" : "Open navigation";
  });

  navLinks?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!navLinks?.contains(event.target) && !menuToggle?.contains(event.target)) closeMenu();
  });

  function alignHashTarget(hash, behavior = "auto") {
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    target?.scrollIntoView({ behavior, block: "start" });
  }

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = anchor.getAttribute("href");
    if (!hash || hash === "#" || !document.querySelector(hash)) return;
    event.preventDefault();
    history.pushState(null, "", hash);
    alignHashTarget(hash, reducedMotion.matches ? "auto" : "smooth");
    window.setTimeout(() => alignHashTarget(hash), reducedMotion.matches ? 0 : 850);
  });

  window.addEventListener("load", () => {
    if (location.hash) window.setTimeout(() => alignHashTarget(location.hash), 80);
  });

  const credentialMarkup = (credential) => `
    <article class="credential-card spotlight-card reveal">
      <a href="${escapeHtml(credential.url)}" target="_blank" rel="noreferrer" aria-label="Verify ${escapeHtml(credential.name)} on Credly">
        <span class="credential-mark" aria-hidden="true">${escapeHtml(credential.mark)}</span>
        <h3>${escapeHtml(credential.name)}</h3>
        <p class="issuer">${escapeHtml(credential.issuer)}</p>
        <div class="credential-status">${credential.status.startsWith("Expired") ? "Archived" : "Verified"}<span>${escapeHtml(credential.status)}</span></div>
      </a>
    </article>`;

  const credentialGrid = document.getElementById("credential-grid");
  const expiredCredentialGrid = document.getElementById("expired-credential-grid");

  function renderCredentials() {
    if (credentialGrid) {
      credentialGrid.innerHTML = data.credentials.active.map(credentialMarkup).join("");
      observeReveals(credentialGrid);
    }
    if (expiredCredentialGrid) {
      expiredCredentialGrid.innerHTML = data.credentials.expired.map(credentialMarkup).join("");
      observeReveals(expiredCredentialGrid);
    }
  }

  const articleGrid = document.getElementById("article-grid");

  function renderArticles() {
    if (!articleGrid) return;
    articleGrid.innerHTML = data.articles.map((article, index) => `
        <article class="article-card spotlight-card reveal" data-delay="${index % 3}">
          <a href="${escapeHtml(article.url)}" target="_blank" rel="noreferrer">
            <div class="article-meta"><span>${escapeHtml(article.date)}</span><span>${escapeHtml(article.readTime)}</span></div>
            <h4>${escapeHtml(article.title)}</h4>
            <p>${escapeHtml(article.description)}</p>
            <div class="article-tags" aria-label="Article topics">${article.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
          </a>
        </article>`).join("");
    observeReveals(articleGrid);
  }

  const tableauGrid = document.getElementById("tableau-grid");

  function renderTableau() {
    if (!tableauGrid) return;
    tableauGrid.innerHTML = data.tableau.map((item, index) => `
        <article class="tableau-card reveal" data-delay="${index % 3}" data-tableau-group="${escapeHtml(item.group)}">
          <a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer" aria-label="${item.exact ? "Open" : "Find"} ${escapeHtml(item.title)} on Tableau Public">
            <span class="tableau-index">${String(index + 1).padStart(2, "0")} / 10</span>
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.category)} · ${item.exact ? "Direct view ↗" : "Profile view ↗"}</p>
          </a>
        </article>`).join("");
    observeReveals(tableauGrid);
  }

  const tableauFilterButtons = [...document.querySelectorAll("[data-tableau-filter]")];
  tableauFilterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.tableauFilter === "all"));
    button.addEventListener("click", () => {
      const selectedGroup = button.dataset.tableauFilter;
      tableauFilterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      tableauGrid?.querySelectorAll(".tableau-card").forEach((card) => {
        card.classList.toggle("hidden", selectedGroup !== "all" && card.dataset.tableauGroup !== selectedGroup);
      });
    });
  });

  const repoGrid = document.getElementById("repo-grid");
  const repoCount = document.getElementById("repo-count");
  const repoToggle = document.getElementById("repo-toggle");
  const repoSearch = document.getElementById("repo-search");
  const filterButtons = [...document.querySelectorAll("[data-repo-filter]")];
  let activeRepoFilter = "all";
  let showAllRepos = false;

  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.repoFilter === activeRepoFilter));
  });

  function filteredRepos() {
    const query = repoSearch?.value.trim().toLowerCase() || "";
    return data.repositories.filter((repository) => {
      const kindMatches = activeRepoFilter === "all"
        || (activeRepoFilter === "fork" && repository.fork)
        || (activeRepoFilter === "original" && !repository.fork);
      const queryMatches = !query || [repository.name, repository.description, repository.language]
        .some((value) => value.toLowerCase().includes(query));
      return kindMatches && queryMatches;
    });
  }

  function renderRepositories() {
    if (!repoGrid) return;
    const matches = filteredRepos();
    const visible = showAllRepos ? matches : matches.slice(0, 9);

    repoGrid.innerHTML = visible.map((repository, index) => `
      <article class="repo-card spotlight-card reveal ${repository.featured ? "featured" : ""}" data-delay="${index % 3}">
        <a href="${escapeHtml(repository.url)}" target="_blank" rel="noreferrer">
          <div class="repo-top">
            <span class="repo-kind ${repository.fork ? "" : "original"}">${repository.fork ? "Fork / sample" : "Original"}</span>
            <span class="repo-language">${escapeHtml(repository.language)}</span>
          </div>
          <h3>${escapeHtml(repository.name)}</h3>
          <p>${escapeHtml(repository.description)}</p>
          <div class="repo-bottom"><span>Updated ${formatDate(repository.updated)}</span><span class="repo-arrow" aria-hidden="true">↗</span></div>
        </a>
      </article>`).join("");

    if (!matches.length) {
      repoGrid.innerHTML = '<p class="empty-state">No repositories match that search.</p>';
    }

    if (repoCount) repoCount.textContent = `Showing ${visible.length} of ${matches.length} ${matches.length === 1 ? "repository" : "repositories"}`;
    if (repoToggle) {
      repoToggle.hidden = matches.length <= 9;
      repoToggle.textContent = showAllRepos ? "Show fewer repositories" : "Show all repositories";
      repoToggle.setAttribute("aria-expanded", String(showAllRepos));
    }
    observeReveals(repoGrid);
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeRepoFilter = button.dataset.repoFilter;
      showAllRepos = false;
      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      renderRepositories();
    });
  });

  repoSearch?.addEventListener("input", () => {
    showAllRepos = false;
    renderRepositories();
  });

  repoToggle?.addEventListener("click", () => {
    showAllRepos = !showAllRepos;
    renderRepositories();
  });

  const revealObserver = !reducedMotion.matches && "IntersectionObserver" in window
    ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 })
    : null;

  function observeReveals(root = document) {
    if (document.body.classList.contains("skip-reveals")) return;
    root.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => {
      if (revealObserver) revealObserver.observe(element);
      else element.classList.add("is-visible");
    });
  }

  observeReveals();

  const collectionGroups = [
    { target: document.getElementById("credentials"), initialize: renderCredentials },
    { target: document.getElementById("open-source"), initialize: renderRepositories },
    {
      target: document.getElementById("insights"),
      initialize() {
        renderArticles();
        renderTableau();
      }
    }
  ].filter((group) => group.target).map((group) => ({ ...group, initialized: false }));

  function initializeCollection(group) {
    if (!group || group.initialized) return;
    group.initialized = true;
    group.initialize();
  }

  function initializeHashCollection() {
    if (!location.hash || location.hash === "#") return;
    const target = document.querySelector(location.hash);
    const group = collectionGroups.find((item) => item.target === target || item.target.contains(target));
    initializeCollection(group);
  }

  initializeHashCollection();
  window.addEventListener("hashchange", () => {
    initializeHashCollection();
    window.requestAnimationFrame(() => alignHashTarget(location.hash));
  });

  if ("IntersectionObserver" in window) {
    const collectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const group = collectionGroups.find((item) => item.target === entry.target);
        initializeCollection(group);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "800px 0px", threshold: 0 });
    collectionGroups.forEach((group) => collectionObserver.observe(group.target));
  } else {
    collectionGroups.forEach(initializeCollection);
  }

  const header = document.querySelector(".site-header");
  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 18);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const navigationAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const activeSections = navigationAnchors
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (finePointer.matches && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navigationAnchors.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-30% 0px -55%", threshold: [0, 0.15, 0.4] });
    activeSections.forEach((section) => navObserver.observe(section));
  }

  document.addEventListener("pointermove", (event) => {
    if (!finePointer.matches) return;
    const card = event.target.closest(".spotlight-card");
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  }, { passive: true });

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const bounds = card.getBoundingClientRect();
      const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
      const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}());
