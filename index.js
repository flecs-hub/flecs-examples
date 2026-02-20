(function () {
  const STORAGE_KEY = "flecs-examples-collapsed-sections-v1";
  const EXPLORER_URL = "https://www.flecs.dev/explorer/";
  const SCREENSHOT_DIR = "examples/screenshots/";
  const data = window.FLECS_EXAMPLES;
  const sectionLinksRoot = document.getElementById("section-links");
  const sectionsRoot = document.getElementById("example-sections");
  let resizeRaf = null;
  let collapsedState = {};

  if (!data || !sectionsRoot || !sectionLinksRoot) {
    return;
  }

  function loadCollapsedState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return {};
      }
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
      return {};
    } catch (e) {
      return {};
    }
  }

  function saveCollapsedState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsedState));
    } catch (e) {
      // Ignore storage errors (private mode / quota).
    }
  }

  function setSectionCollapsed(sectionNode, collapsed) {
    const sectionId = sectionNode.dataset.sectionId;
    const title = sectionNode.querySelector(".section-title");
    sectionNode.classList.toggle("is-collapsed", collapsed);
    if (sectionId) {
      collapsedState[sectionId] = collapsed;
    }
    if (title) {
      title.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }
  }

  function createSectionLinks() {
    sectionLinksRoot.textContent = "";

    data.sections.forEach((section) => {
      const link = document.createElement("a");
      link.href = "#section-" + section.id;
      link.textContent = section.title;
      link.addEventListener("click", function () {
        const sectionNode = document.getElementById("section-" + section.id);
        if (sectionNode && sectionNode.classList.contains("is-collapsed")) {
          setSectionCollapsed(sectionNode, false);
          saveCollapsedState();
          updateVisibleCards();
        }
      });
      sectionLinksRoot.appendChild(link);
    });
  }

  function createCard(item) {
    const card = document.createElement("a");
    card.className = "example-card";
    const linkHref = item.url || EXPLORER_URL;
    card.href = linkHref;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute("aria-label", "Open " + item.title + " in Flecs Explorer");

    const image = document.createElement("img");
    image.src = SCREENSHOT_DIR + item.id + ".png";
    image.alt = "Screenshot for " + item.title;

    const title = document.createElement("h3");
    title.textContent = item.title;

    card.appendChild(image);
    card.appendChild(title);
    return card;
  }

  function createSection(section) {
    const wrapper = document.createElement("section");
    wrapper.className = "example-section";
    wrapper.dataset.sectionId = section.id;
    wrapper.id = "section-" + section.id;

    const header = document.createElement("div");
    header.className = "section-header";

    const titleWrap = document.createElement("div");
    titleWrap.className = "section-title-wrap";

    const title = document.createElement("h2");
    title.className = "section-title";
    title.tabIndex = 0;
    title.setAttribute("role", "button");
    title.setAttribute("aria-controls", "grid-" + section.id);

    const chevron = document.createElement("span");
    chevron.className = "section-chevron";
    chevron.setAttribute("aria-hidden", "true");

    const titleLabel = document.createElement("span");
    titleLabel.className = "section-title-label";
    titleLabel.textContent = section.title;

    title.appendChild(chevron);
    title.appendChild(titleLabel);

    const grid = document.createElement("div");
    grid.className = "example-grid";
    grid.id = "grid-" + section.id;

    section.items.forEach((item) => {
      grid.appendChild(createCard(item));
    });

    titleWrap.appendChild(title);
    header.appendChild(titleWrap);
    wrapper.appendChild(header);
    wrapper.appendChild(grid);
    sectionsRoot.appendChild(wrapper);

    setSectionCollapsed(wrapper, !!collapsedState[section.id]);
    function toggleSection() {
      const willCollapse = !wrapper.classList.contains("is-collapsed");
      setSectionCollapsed(wrapper, willCollapse);
      saveCollapsedState();
      updateVisibleCards();
    }
    title.addEventListener("click", toggleSection);
    title.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleSection();
      }
    });
  }

  function rowsForHeight(height) {
    if (height < 760) {
      return 1;
    }
    if (height < 1024) {
      return 2;
    }
    return 3;
  }

  function numberFromVar(varName, fallback) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
      .replace("px", "");
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function updateVisibleCards() {
    const cardWidth = numberFromVar("--card-total-width", 344);
    const gridGap = numberFromVar("--grid-gap", 16);
    const rows = rowsForHeight(window.innerHeight);

    document.querySelectorAll(".example-section").forEach((sectionNode) => {
      const grid = sectionNode.querySelector(".example-grid");
      const cards = Array.from(sectionNode.querySelectorAll(".example-card"));

      if (!grid || cards.length === 0) {
        return;
      }

      if (sectionNode.classList.contains("is-collapsed")) {
        cards.forEach((card) => {
          card.classList.add("is-hidden");
        });
        return;
      }

      const perRow = Math.max(
        1,
        Math.floor((grid.clientWidth + gridGap) / (cardWidth + gridGap))
      );
      const visibleCount = Math.min(cards.length, perRow * rows);

      cards.forEach((card, index) => {
        card.classList.toggle("is-hidden", index >= visibleCount);
      });
    });
  }

  function onResize() {
    if (resizeRaf !== null) {
      cancelAnimationFrame(resizeRaf);
    }
    resizeRaf = requestAnimationFrame(() => {
      updateVisibleCards();
      resizeRaf = null;
    });
  }

  collapsedState = loadCollapsedState();
  createSectionLinks();
  data.sections.forEach(createSection);
  updateVisibleCards();
  window.addEventListener("resize", onResize);
})();
