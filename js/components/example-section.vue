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

    <div class="example-grid" :id="gridId">
      <example-item-card
        v-for="item in section.items"
        :key="item.id"
        :item="item"
        :hidden="section.collapsed"
        :explorer-url="explorerUrl"
        :screenshot-dir="screenshotDir"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import ExampleItemCard from "./example-item-card.vue";

const props = defineProps({
  section: {
    type: Object,
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

const sectionDomId = computed(() => `section-${props.section.id}`);
const gridId = computed(() => `grid-${props.section.id}`);
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

  .example-grid {
    grid-template-columns: 1fr;
    padding-left: 0;
  }
}
</style>
