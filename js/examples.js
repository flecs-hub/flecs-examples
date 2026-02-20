(function () {
  const sections = [
    {
      id: "c",
      title: "C examples",
      items: [
        { id: "city", title: "City", url: "https://flecs-hub.github.io/city/etc/", github: "https://github.com/flecs-hub/city" },
      ]
    },
    {
      id: "cpp",
      title: "C++ examples",
      items: [
        { id: "tower_defense", title: "Tower Defense", url: "https://www.flecs.dev/tower_defense/etc/", github: "https://github.com/SanderMertens/tower_defense" },
        { id: "traffic", title: "Traffic", url: "https://flecs-hub.github.io/traffic/etc/", github: "https://github.com/SanderMertens/traffic" },
      ]
    },
    {
      id: "script",
      title: "Script examples",
      items: [
        {
          id: "basics",
          title: "Basics",
          url: "https://flecs.dev/explorer/?sidebar=false&code_url=https://raw.githubusercontent.com/flecs-hub/flecs-examples/refs/heads/main/examples/scripts/basics.flecs",
          capture_canvas: true
        },
        {
          id: "for",
          title: "For loops",
          url: "https://flecs.dev/explorer/?sidebar=false&code_url=https://raw.githubusercontent.com/flecs-hub/flecs-examples/refs/heads/main/examples/scripts/for.flecs",
          capture_canvas: true
        },
        {
          id: "math",
          title: "Math functions",
          url: "https://flecs.dev/explorer/?sidebar=false&code_url=https://raw.githubusercontent.com/flecs-hub/flecs-examples/refs/heads/main/examples/scripts/math.flecs",
          capture_canvas: true
        },
        {
          id: "traffic_light",
          title: "Traffic light",
          url: "https://flecs.dev/explorer/?sidebar=false&code_url=https://raw.githubusercontent.com/flecs-hub/flecs-examples/refs/heads/main/examples/scripts/traffic_light.flecs",
          capture_canvas: true
        },
        {
          id: "procedural_city",
          title: "Procedural City",
          url: "https://flecs.dev/explorer/?sidebar=false&code_url=https://raw.githubusercontent.com/flecs-hub/flecs-examples/refs/heads/main/examples/scripts/city.flecs",
          capture_canvas: true
        },
        {
          id: "procedural_building",
          title: "Procedural Buildings",
          url: "https://flecs.dev/explorer/?sidebar=false&code_url=https://raw.githubusercontent.com/flecs-hub/flecs-examples/refs/heads/main/examples/scripts/buildings.flecs",
          capture_canvas: true
        },
        {
          id: "perlin_1",
          title: "Perlin Noise 1",
          url: "https://flecs.dev/explorer/?sidebar=false&code_url=https://raw.githubusercontent.com/flecs-hub/flecs-examples/refs/heads/main/examples/scripts/perlin_1.flecs",
          capture_canvas: true
        },
        {
          id: "perlin_2",
          title: "Perlin Noise 2",
          url: "https://flecs.dev/explorer/?sidebar=false&code_url=https://raw.githubusercontent.com/flecs-hub/flecs-examples/refs/heads/main/examples/scripts/perlin_2.flecs",
          capture_canvas: true
        },
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
