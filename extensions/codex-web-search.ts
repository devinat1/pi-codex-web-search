import {
  DEFAULT_MAX_BYTES,
  DEFAULT_MAX_LINES,
  truncateHead,
  type ExtensionAPI,
} from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "codex_web_search",
    label: "Codex Web Search",
    description: "Search the web through the authenticated Codex CLI in a read-only, ephemeral run.",
    promptSnippet: "Search the web through the authenticated Codex CLI",
    promptGuidelines: [
      "Use codex_web_search when the user explicitly asks to search through Codex or native web search is unavailable.",
    ],
    parameters: Type.Object({
      query: Type.String({ description: "The web research question" }),
    }),
    async execute(_toolCallId, { query }, signal, onUpdate, ctx) {
      onUpdate?.({ content: [{ type: "text", text: "Searching through Codex..." }] });

      const result = await pi.exec(
        "codex",
        [
          "--search",
          "exec",
          "--sandbox", "read-only",
          "--skip-git-repo-check",
          "--ephemeral",
          "-C", ctx.cwd,
          "Use live web search to answer this question. Do not read or modify local files. Cite source URLs in the answer.\n\n" + query,
        ],
        { signal, timeout: 120_000 },
      );
      const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();

      if (result.killed) throw new Error("Codex web search timed out or was cancelled");
      if (result.code !== 0) throw new Error(output || `Codex exited with status ${result.code}`);

      const truncated = truncateHead(output, {
        maxBytes: DEFAULT_MAX_BYTES,
        maxLines: DEFAULT_MAX_LINES,
      });
      return {
        content: [{ type: "text", text: truncated.content }],
        details: { exitCode: result.code, truncated: truncated.truncated },
      };
    },
  });
}
