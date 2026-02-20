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
      id: "script",
      title: "Script examples",
      items: [
        {
          id: "procedural_city",
          title: "Procedural City",
          url: "https://flecs.dev/explorer/?sidebar=false&code_url=https://raw.githubusercontent.com/flecs-hub/flecs-examples/refs/heads/main/examples/scripts/city.flecs?token=GHSAT0AAAAAAC2RGZF4IZYBJQWTOXMBRX5W2MXZVZQ",
          capture_canvas: true
        },
        {
          id: "perlin_1",
          title: "Perlin Noise 1",
          url: "https://flecs.dev/explorer/?sidebar=false&code_url=https://raw.githubusercontent.com/flecs-hub/flecs-examples/refs/heads/main/examples/scripts/perlin_1.flecs?token=GHSAT0AAAAAAC2RGZF4V46QZXEGJDZCONDQ2MXZWSA",
          capture_canvas: true
        },
        {
          id: "perlin_2",
          title: "Perlin Noise 2",
          url: "https://flecs.dev/explorer/?sidebar=false&code_url=https://raw.githubusercontent.com/flecs-hub/flecs-examples/refs/heads/main/examples/scripts/perlin_2.flecs?token=GHSAT0AAAAAAC2RGZF5PPD63M5ABERRU6EK2MXZXCA",
          capture_canvas: true
        }
      ]
    },
    {
      id: "query",
      title: "Query examples",
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
