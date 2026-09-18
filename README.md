# @devinat1/pi-codex-web-search

A [Pi](https://github.com/badlogic/pi-mono) extension that searches the web through your authenticated [Codex CLI](https://developers.openai.com/codex/cli/).

## Install

```bash
pi install npm:@devinat1/pi-codex-web-search
```

Or install directly from GitHub:

```bash
pi install git:github.com/devinat1/pi-codex-web-search
```

## Prerequisites

- Pi with its bundled `@earendil-works/pi-coding-agent` and `typebox` packages.
- Codex CLI installed and authenticated (`codex login`).
- A Codex account with web-search access and available usage quota.

## Tool

The extension adds `codex_web_search` with one argument:

```json
{ "query": "What is the current U.S. constitutional minimum age for President?" }
```

Each call runs:

```bash
codex --search exec --sandbox read-only --skip-git-repo-check --ephemeral -C <project-directory> <prompt>
```

The tool asks Codex to use live web search, cite source URLs, avoids reading or modifying local files, times out after 120 seconds, and truncates output to Pi's standard 50 KB / 2,000-line limit.

## Notes

- This is separate from Pi's native `web_search`; it does not replace it.
- The Codex CLI may still use your account quota. A quota error is returned to Pi as a tool error.

## Development

```bash
npm test
pi -e . --no-tools -p "Reply with exactly: loaded"
```

## License

MIT
