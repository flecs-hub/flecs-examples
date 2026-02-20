<template>
  <div class="page-shell">
    <aside class="page-sidebar">
      <div class="brand">
        <img class="brand-logo" :src="logoSrc" alt="Flecs logo" />
        <h1>Flecs examples</h1>
      </div>

      <section-menu
        v-if="sections.length"
        :sections="sections"
        @select="onSectionLinkClick"
      />
    </aside>

    <main id="example-sections" class="example-sections">
      <example-section
        v-for="section in sections"
        :key="section.id"
        :section="section"
        :rows="rows"
        :explorer-url="explorerUrl"
        :screenshot-dir="screenshotDir"
        @toggle="toggleSection"
      />

      <p v-if="!sections.length" class="empty-state">
        No examples were found in <code>window.FLECS_EXAMPLES.sections</code>.
      </p>
    </main>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import ExampleSection from "./example-section.vue";
import SectionMenu from "./section-menu.vue";

const STORAGE_KEY = "flecs-examples-collapsed-sections-v1";
const explorerUrl = "https://www.flecs.dev/explorer/";
const screenshotDir = "examples/screenshots/";
const logoSrc = "img/flecs_logo.png";

const rawSections = Array.isArray(window.FLECS_EXAMPLES?.sections)
  ? window.FLECS_EXAMPLES.sections
  : [];

const collapsedState = reactive(loadCollapsedState());
const sections = ref(
  rawSections.map((section) => ({
    ...section,
    items: Array.isArray(section.items) ? section.items : [],
    collapsed: !!collapsedState[section.id],
  }))
);

const rows = ref(rowsForHeight(window.innerHeight));
let resizeRaf = null;

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
  } catch (e) {
    // Ignore invalid or inaccessible local storage.
  }
  return {};
}

function saveCollapsedState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsedState));
  } catch (e) {
    // Ignore storage errors (private mode / quota).
  }
}

function persistSectionState(section) {
  collapsedState[section.id] = section.collapsed;
  saveCollapsedState();
}

function toggleSection(sectionId) {
  const section = sections.value.find((entry) => entry.id === sectionId);
  if (!section) {
    return;
  }

  section.collapsed = !section.collapsed;
  persistSectionState(section);
}

function onSectionLinkClick(sectionId) {
  const section = sections.value.find((entry) => entry.id === sectionId);
  if (!section || !section.collapsed) {
    return;
  }

  section.collapsed = false;
  persistSectionState(section);
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

function onResize() {
  if (resizeRaf !== null) {
    window.cancelAnimationFrame(resizeRaf);
  }

  resizeRaf = window.requestAnimationFrame(() => {
    rows.value = rowsForHeight(window.innerHeight);
    resizeRaf = null;
  });
}

onMounted(() => {
  window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
  if (resizeRaf !== null) {
    window.cancelAnimationFrame(resizeRaf);
  }
});
</script>

<style>
:root {
  --steel-300: #dde0e6;
  --steel-600: #4d515a;
  --steel-700: #242832;
  --steel-800: #1a1d23;
  --steel-850: #16171c;
  --steel-950: #0a0c0e;

  --green: #42b983;
  --light-green: #a2d8b4;
  --blue: rgb(73, 129, 181);

  --bg-color: hsl(214, 10%, 13%);
  --bg-content: rgb(36, 41, 46);
  --bg-content-hover: hsl(210, 12%, 20%);
  --border: rgba(255, 255, 255, 0.07);

  --primary-text: hsl(195, 15%, 85%);
  --secondary-text: hsl(198, 9%, 56%);

  --card-width: 320px;
  --card-height: 180px;
  --card-total-width: 344px;
  --grid-gap: 16px;
  --section-content-indent: calc(9px + 0.55rem);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, Helvetica, Arial, sans-serif;
  background: var(--bg-content);
  color: var(--primary-text);
}

.page-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
}

.page-sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 1.25rem 1rem;
  border-right: 1px solid var(--border);
  background: var(--bg-color);
  overflow-y: auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.25rem 0.25rem 1rem;
}

.brand-logo {
  width: 38px;
  height: 38px;
  object-fit: contain;
  flex-shrink: 0;
}

.brand h1 {
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.2;
  color: var(--steel-300);
}

.example-sections {
  padding: 1.25rem 1.5rem 2rem;
}

.empty-state {
  color: var(--secondary-text);
}

@media (max-width: 980px) {
  .page-shell {
    grid-template-columns: 1fr;
  }

  .page-sidebar {
    position: static;
    height: auto;
    border-right: 0;
    border-bottom: 1px solid var(--border);
  }

}

@media (max-width: 760px) {
  :root {
    --card-width: 280px;
    --card-height: 158px;
    --card-total-width: 304px;
  }

  .example-sections {
    padding: 1rem;
  }
}
</style>
