<template>
  <nav id="section-links" class="section-menu" aria-label="Example sections">
    <section-menu-item
      v-for="section in sections"
      :key="section.id"
      :section="section"
      @select="onSelect"
    />
  </nav>
</template>

<script setup>
import SectionMenuItem from "./section-menu-item.vue";

defineProps({
  sections: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["select"]);

function onSelect(sectionId) {
  emit("select", sectionId);
}
</script>

<style scoped>
.section-menu {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

@media (max-width: 980px) {
  .section-menu {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
