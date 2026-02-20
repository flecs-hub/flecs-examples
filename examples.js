(function () {
  const sections = [
    {
      id: "c",
      title: "C examples",
      items: [
        { id: "city", title: "City", url: "https://flecs-hub.github.io/city/etc/" },
      ]
    },
    {
      id: "cpp",
      title: "C++ examples",
      items: [
        { id: "tower_defense", title: "Tower Defense", url: "https://www.flecs.dev/tower_defense/etc/" },
        { id: "traffic", title: "Traffic", url: "https://flecs-hub.github.io/traffic/etc/" },
      ]
    },
    {
      id: "query",
      title: "Query examples",
      items: [
      ]
    },
    {
      id: "script",
      title: "Flecs script examples",
      items: [
      ]
    }
  ];

  const byId = {};
  sections.forEach((section) => {
    section.items.forEach((item) => {
      byId[item.id] = {
        id: item.id,
        title: item.title,
        sectionId: section.id,
        sectionTitle: section.title
      };
    });
  });

  window.FLECS_EXAMPLES = { sections, byId };
})();
