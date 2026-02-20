<template>
  <article
    class="example-card"
    :class="{ 'is-hidden': hidden }"
  >
    <a
      class="example-card-main"
      :href="item.url || explorerUrl"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`Open ${item.title} in Flecs Explorer`"
    >
      <img
        :src="`${screenshotDir}${item.id}.png`"
        :alt="`Screenshot for ${item.title}`"
      />
      <h3 :class="{ 'has-github': item.github }">{{ item.title }}</h3>
    </a>
    <a
      v-if="item.github"
      class="github-link"
      :href="item.github"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`Open ${item.title} on GitHub`"
      title="Open on GitHub"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38
          0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
          -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
          .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
          -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.62 7.62 0 0 1 8 4.66c.68 0
          1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82
          1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01
          1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z"
        />
      </svg>
    </a>
  </article>
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
  position: relative;
  display: block;
  width: var(--card-total-width);
  margin: 0;
  padding: 0 0 0.75rem;
  overflow: hidden;
  background: var(--bg-content);
  border: 1px solid hsl(240, 4%, 23%);
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
}

.example-card.is-hidden {
  display: none;
}

.example-card-main {
  display: block;
  color: inherit;
  text-decoration: none;
}

.example-card img {
  display: block;
  width: 100%;
  height: var(--card-height);
  object-fit: cover;
  transform: scale(1.08);
  transform-origin: center;
  background: var(--steel-800);
}

.example-card h3 {
  margin: 1rem 0 0;
  padding: 0 0.75rem;
  font-size: 1rem;
  line-height: 1.35;
  color: var(--primary-text);
  font-weight: 600;
  transition: color 0.12s ease;
}

.example-card h3.has-github {
  padding-right: 2.75rem;
}

.github-link {
  position: absolute;
  right: 0.65rem;
  bottom: 0.55rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  color: var(--secondary-text);
  border-radius: 4px;
}

.github-link svg {
  width: 1rem;
  height: 1rem;
  fill: currentColor;
}

.github-link:hover,
.github-link:focus-visible {
  color: var(--green);
  background: var(--bg-content-hover);
}

.github-link:focus-visible {
  outline: 1px solid var(--blue);
}

.example-card:hover,
.example-card:focus-within {
  background: var(--bg-content-hover);
  border-color: var(--bg-content-hover);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
}

.example-card-main:hover h3,
.example-card-main:focus-visible h3 {
  color: var(--green);
  text-decoration: none;
}

.example-card-main:focus-visible {
  outline: 1px solid var(--blue);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
}
</style>
