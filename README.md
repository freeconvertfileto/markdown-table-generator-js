# Markdown Table Generator

Generate GitHub-flavored Markdown tables from an interactive grid with configurable column alignment and live preview, entirely in the browser.

**Live Demo:** https://file-converter-free.com/en/text-tools/markdown-table-generator-online

## How It Works

A dynamic grid of `<input>` cells is rendered for up to 20 rows and 10 columns. `generateMarkdown()` iterates all columns to compute the maximum cell content width per column. Each cell value is padded with spaces to match the column width. The separator row uses alignment-aware patterns: `---` for left, `:---:` for center, `---:` for right, with padding to match the column width. All rows (header, separator, and data) are assembled as `| cell | cell |` strings separated by `\n`. Toggle preview renders the Markdown table string as an HTML `<table>` by splitting lines, detecting the separator row, and building `<th>` or `<td>` elements.

## Features

- Dynamic grid up to 20 rows × 10 columns
- Per-column alignment selector (left / center / right)
- Per-column width auto-calculated from content for padded, readable Markdown output
- Live toggle preview renders HTML table
- Copy Markdown to clipboard

## Browser APIs Used

- Clipboard API (`navigator.clipboard.writeText`)

## Code Structure

| File | Description |
|------|-------------|
| `markdown-table-generator.js` | Dynamic input grid, `generateMarkdown` per-column width padding, `:---`/`:---:`/`---:` alignment separators, HTML table preview |

## Usage

| Element ID / Selector | Purpose |
|----------------------|---------|
| Table grid inputs | Cell content inputs |
| Column alignment selectors | Per-column alignment (left/center/right) |
| Add Row / Add Column buttons | Expand the grid |
| Generate button | Produce Markdown output |
| Toggle Preview button | Show/hide rendered HTML table |
| Copy button | Copy Markdown to clipboard |

## License

MIT
