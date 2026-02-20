<template>
  <a
    class="section-menu-item"
    :href="`#section-${section.id}`"
    @click="onClick"
  >
    {{ section.title }}
  </a>
</template>

<script setup>
const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["select"]);

function onClick() {
  emit("select", props.section.id);
}
</script>

<style scoped>
.section-menu-item {
  color: var(--primary-text);
  text-decoration: none;
  padding: 0.45rem 0.65rem;
  font-size: 0.9rem;
}

.section-menu-item:hover,
.section-menu-item:focus-visible {
  color: var(--green);
  background: var(--bg-content-hover);
}

@media (max-width: 980px) {
  .section-menu-item {
    border-radius: 999px;
    border: 1px solid var(--border);
  }
}
</style>
