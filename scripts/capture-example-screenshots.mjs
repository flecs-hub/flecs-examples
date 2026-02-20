#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import process from "node:process";

const DEFAULT_EXAMPLES_PATH = "examples.js";
const DEFAULT_OUTPUT_DIR = "examples/screenshots";
const DEFAULT_EXPLORER_URL = "https://www.flecs.dev/explorer/";
const DEFAULT_BROWSER_CHANNEL = "chromium";

function printUsage() {
  console.log(`Usage: node scripts/capture-example-screenshots.mjs [options]\n\nOptions:\n  --examples <path>       Path to examples.js (default: ${DEFAULT_EXAMPLES_PATH})\n  --out <dir>             Output directory for screenshots (default: ${DEFAULT_OUTPUT_DIR})\n  --default-url <url>     Fallback URL when an item has no url (default: ${DEFAULT_EXPLORER_URL})\n  --skip-default          Skip items that do not define item.url\n  --width <px>            Viewport width (default: 1440)\n  --height <px>           Viewport height (default: 900)\n  --timeout <ms>          Navigation timeout (default: 30000)\n  --delay <ms>            Extra delay before screenshot (default: 1000)\n  --channel <name|none>   Browser channel for Playwright launch (default: ${DEFAULT_BROWSER_CHANNEL})\n  --help                  Show this help\n`);
}

function parseArgs(argv) {
  const options = {
    examplesPath: DEFAULT_EXAMPLES_PATH,
    outDir: DEFAULT_OUTPUT_DIR,
    defaultUrl: DEFAULT_EXPLORER_URL,
    skipDefault: false,
    width: 1440,
    height: 900,
    timeout: 30000,
    delay: 1000,
    channel: DEFAULT_BROWSER_CHANNEL
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help") {
      options.help = true;
      continue;
    }

    if (arg === "--skip-default") {
      options.skipDefault = true;
      continue;
    }

    const next = argv[i + 1];
    if (!next) {
      throw new Error(`Missing value for ${arg}`);
    }

    if (arg === "--examples") {
      options.examplesPath = next;
      i += 1;
      continue;
    }

    if (arg === "--out") {
      options.outDir = next;
      i += 1;
      continue;
    }

    if (arg === "--default-url") {
      options.defaultUrl = next;
      i += 1;
      continue;
    }

    if (arg === "--width") {
      options.width = Number(next);
      i += 1;
      continue;
    }

    if (arg === "--height") {
      options.height = Number(next);
      i += 1;
      continue;
    }

    if (arg === "--timeout") {
      options.timeout = Number(next);
      i += 1;
      continue;
    }

    if (arg === "--delay") {
      options.delay = Number(next);
      i += 1;
      continue;
    }

    if (arg === "--channel") {
      options.channel = next;
      i += 1;
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  const numericKeys = ["width", "height", "timeout", "delay"];
  numericKeys.forEach((key) => {
    if (!Number.isFinite(options[key]) || options[key] < 0) {
      throw new Error(`Invalid value for ${key}: ${options[key]}`);
    }
  });

  return options;
}

function normalizeFileName(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function loadExamples(examplesPath) {
  const source = await fs.readFile(examplesPath, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: examplesPath });

  const data = sandbox.window.FLECS_EXAMPLES;
  if (!data || !Array.isArray(data.sections)) {
    throw new Error(`Could not read window.FLECS_EXAMPLES.sections from ${examplesPath}`);
  }

  return data;
}

function collectTargets(data, options) {
  const targets = [];

  data.sections.forEach((section) => {
    (section.items || []).forEach((item) => {
      const rawUrl = typeof item.url === "string" ? item.url.trim() : "";
      const url = rawUrl || (!options.skipDefault ? options.defaultUrl : "");
      if (!url) {
        return;
      }

      targets.push({
        sectionId: section.id || "section",
        sectionTitle: section.title || "Section",
        id: item.id || item.title || "example",
        title: item.title || item.id || "Example",
        url,
        captureCanvas: item["capture-canvas"] === true || item.captureCanvas === true
      });
    });
  });

  return targets;
}

async function findCanvasForScreenshot(page) {
  const canvasHandle = await page.evaluateHandle(() => {
    function isVisible(node) {
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0"
      );
    }

    const canvases = Array.from(document.querySelectorAll("canvas")).filter(isVisible);

    const webglCanvas = canvases.find((canvas) => {
      try {
        return (
          canvas.getContext("webgl2") ||
          canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl")
        );
      } catch (e) {
        return false;
      }
    });

    return webglCanvas || canvases[0] || null;
  });

  const canvasElement = canvasHandle.asElement();
  if (!canvasElement) {
    await canvasHandle.dispose();
    return null;
  }

  return canvasElement;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }

  const examplesPath = path.resolve(options.examplesPath);
  const outDir = path.resolve(options.outDir);

  const data = await loadExamples(examplesPath);
  const targets = collectTargets(data, options);

  if (targets.length === 0) {
    console.error("No targets found. Add item.url values or omit --skip-default.");
    process.exitCode = 1;
    return;
  }

  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch (error) {
    console.error("playwright is required. Install it with: npm i -D playwright");
    process.exitCode = 1;
    return;
  }

  await fs.mkdir(outDir, { recursive: true });

  const launchOptions = { headless: true };
  if (options.channel !== "none") {
    launchOptions.channel = options.channel;
  }

  const browser = await chromium.launch(launchOptions);
  const context = await browser.newContext({
    viewport: {
      width: options.width,
      height: options.height
    }
  });

  const results = [];

  for (const target of targets) {
    const slug = normalizeFileName(target.id) || "example";
    const screenshotPath = path.join(outDir, `${slug}.png`);

    const page = await context.newPage();

    try {
      console.log(`Capturing ${target.title}: ${target.url}`);
      await page.goto(target.url, {
        waitUntil: "networkidle",
        timeout: options.timeout
      });

      if (options.delay > 0) {
        await page.waitForTimeout(options.delay);
      }

      if (target.captureCanvas) {
        const canvas = await findCanvasForScreenshot(page);
        if (!canvas) {
          throw new Error("capture-canvas is enabled, but no visible canvas element was found");
        }

        try {
          await canvas.scrollIntoViewIfNeeded();
          await page.waitForTimeout(100);
          await canvas.screenshot({ path: screenshotPath });
        } finally {
          await canvas.dispose();
        }
      } else {
        await page.screenshot({
          path: screenshotPath,
          fullPage: true
        });
      }

      results.push({ ...target, screenshot: screenshotPath, ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed ${target.title}: ${message}`);
      results.push({ ...target, screenshot: screenshotPath, ok: false, error: message });
    } finally {
      await page.close();
    }
  }

  await context.close();
  await browser.close();

  const manifestPath = path.join(outDir, "manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify(results, null, 2));

  const successCount = results.filter((r) => r.ok).length;
  const failureCount = results.length - successCount;

  console.log(`\nSaved ${successCount}/${results.length} screenshots to ${outDir}`);
  console.log(`Manifest: ${manifestPath}`);

  if (failureCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
