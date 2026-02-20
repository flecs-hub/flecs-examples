const components = [loadModule("js/components/app-root.vue", options)];

Promise.all(components).then(([AppRoot]) => {
  const app = Vue.createApp({});
  app.component("app-root", AppRoot);
  app.mount("#app");
});
