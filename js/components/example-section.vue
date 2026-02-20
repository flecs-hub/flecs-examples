<template>
  <section
    :id="sectionDomId"
    class="example-section"
    :class="{ 'is-collapsed': section.collapsed }"
    :data-section-id="section.id"
  >
    <div class="section-header">
      <div class="section-title-wrap">
        <button
          class="section-title"
          type="button"
          :aria-controls="gridId"
          :aria-expanded="!section.collapsed"
          @click="emit('toggle', section.id)"
        >
          <span class="section-chevron" aria-hidden="true"></span>
          <span class="section-title-label">{{ section.title }}</span>
        </button>
      </div>
    </div>

    <div class="example-grid" :id="gridId" ref="gridRef">
      <example-item-card
        v-for="(item, index) in section.items"
        :key="item.id"
        :item="item"
        :hidden="isCardHidden(index)"
        :explorer-url="explorerUrl"
        :screenshot-dir="screenshotDir"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import ExampleItemCard from "./example-item-card.vue";

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
  rows: {
    type: Number,
    required: true,
  },
  explorerUrl: {
    type: String,
    required: true,
  },
  screenshotDir: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["toggle"]);

const gridRef = ref(null);
const visibleCount = ref(props.section.items.length);
let resizeObserver = null;

const sectionDomId = computed(() => `section-${props.section.id}`);
const gridId = computed(() => `grid-${props.section.id}`);

function numberFromVar(varName, fallback) {
  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim()
    .replace("px", "");

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function updateVisibleCount() {
  if (props.section.collapsed) {
    visibleCount.value = 0;
    return;
  }

  const grid = gridRef.value;
  const totalCards = props.section.items.length;

  if (!grid || totalCards === 0) {
    visibleCount.value = totalCards;
    return;
  }

  const cardWidth = numberFromVar("--card-total-width", 344);
  const gridGap = numberFromVar("--grid-gap", 16);

  const perRow = Math.max(
    1,
    Math.floor((grid.clientWidth + gridGap) / (cardWidth + gridGap))
  );

  visibleCount.value = Math.min(totalCards, perRow * props.rows);
}

function isCardHidden(index) {
  if (props.section.collapsed) {
    return true;
  }

  return index >= visibleCount.value;
}

onMounted(() => {
  nextTick(updateVisibleCount);

  if (window.ResizeObserver) {
    resizeObserver = new window.ResizeObserver(() => {
      updateVisibleCount();
    });

    if (gridRef.value) {
      resizeObserver.observe(gridRef.value);
    }
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

watch(
  () => [props.rows, props.section.collapsed, props.section.items.length],
  () => {
    nextTick(updateVisibleCount);
  }
);
</script>

<style scoped>
.example-section + .example-section {
  margin-top: 1.25rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.section-title-wrap {
  min-width: 0;
}

.section-title {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--steel-300);
  cursor: pointer;
  user-select: none;
}

.section-title:focus-visible {
  outline: 1px solid var(--blue);
  border-radius: 4px;
}

.section-chevron {
  width: 9px;
  height: 9px;
  border-right: 2px solid var(--secondary-text);
  border-bottom: 2px solid var(--secondary-text);
  transform: rotate(45deg);
  transition: transform 0.12s ease;
  margin-top: -3px;
  flex-shrink: 0;
}

.example-section.is-collapsed .section-chevron {
  transform: rotate(-45deg);
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--card-total-width), var(--card-total-width))
  );
  gap: var(--grid-gap);
  padding-left: var(--section-content-indent);
}

@media (max-width: 760px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
