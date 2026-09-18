import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("..", import.meta.url);

test("package declares the Codex web-search extension", async () => {
  const manifest = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  const extension = await readFile(new URL("extensions/codex-web-search.ts", root), "utf8");

  assert.deepEqual(manifest.pi.extensions, ["./extensions/codex-web-search.ts"]);
  assert.match(extension, /"--search"/);
  assert.match(extension, /"read-only"/);
  assert.match(extension, /"--ephemeral"/);
});
