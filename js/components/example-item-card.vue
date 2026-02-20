<template>
  <a
    class="example-card"
    :class="{ 'is-hidden': hidden }"
    :href="item.url || explorerUrl"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="`Open ${item.title} in Flecs Explorer`"
  >
    <img
      :src="`${screenshotDir}${item.id}.png`"
      :alt="`Screenshot for ${item.title}`"
    />
    <h3>{{ item.title }}</h3>
  </a>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
  hidden: {
    type: Boolean,
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
</script>

<style scoped>
.example-card {
  display: block;
  width: var(--card-total-width);
  margin: 0;
  padding: 0.75rem;
  background: var(--bg-content);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--light-green);
  text-decoration: none;
  transition: background-color 0.12s ease, box-shadow 0.12s ease;
}

.example-card.is-hidden {
  display: none;
}

.example-card img {
  display: block;
  width: var(--card-width);
  height: var(--card-height);
  object-fit: cover;
  border-radius: 6px;
  background: var(--steel-800);
}

.example-card h3 {
  margin: 0.75rem 0 0;
  font-size: 1rem;
  line-height: 1.35;
  font-weight: 600;
}

.example-card:hover {
  background: var(--bg-content-hover);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
}

.example-card:hover h3,
.example-card:focus-visible h3 {
  color: var(--green);
  text-decoration: underline;
}

.example-card:focus-visible {
  outline: 1px solid var(--blue);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
}
</style>
