# Skill: clean-kaisetu-asset-rebuilds（webpack ノイズ整理スキル）

<aside>
🧹

**clean-kaisetu-asset-rebuilds** は、`ibjap-design` リポジトリの `kaisetu-pack/` で `npm run dev:prod` を回した後、編集していない SCSS/JS から再ビルドされてしまった `kaisetu-pack/assets/` 配下の CSS/JS（= autoprefixer/minifier ノイズだけの差分）を検出し、確認のうえ `git checkout HEAD --` で元に戻す Cursor Agent Skill。

**clean-kaisetu-asset-rebuilds** is a Cursor Agent Skill that detects CSS/JS files in `kaisetu-pack/assets/` that were rebuilt by webpack (`npm run dev:prod`) without any actual source change in `kaisetu-pack/src/`, and reverts them with `git checkout HEAD --` after user confirmation.

</aside>

# 🌐 プロジェクト概要

## 🇯🇵 日本語（概要）

このスキルは、IBJ の `ibjap-design` プロジェクト（`kaisetu-pack/` のフロントエンドビルドと WordPress テーマ連携を含む）向けです。

- プロジェクト名: `ibjap-design`
- リポジトリURL: [https://gitlab.ibj.net/ibjs/ibjap-design](https://gitlab.ibj.net/ibjs/ibjap-design)

### webpack を実行する理由

`kaisetu-pack/` の SCSS/JS を本番・配信用の CSS/JS に変換し、抽出・変換・最適化を一貫して行うために webpack を実行します。

### webpack 実行時に起きること

`npm run dev:prod` 実行時、`kaisetu-pack/webpack.config.js` の entry が watch モードで再ビルドされます。その結果、ソースを編集していない場合でも `kaisetu-pack/assets/` の複数ファイルが再生成されることがあります。

### このスキルが必要な理由

再ビルドで生じる差分の中には、整形・圧縮由来の**実質ノイズ差分**が含まれます。これらがそのまま残ると PR が読みにくくなるため、このスキルでノイズ差分だけを検出し、ユーザー確認の上で安全に戻して、レビュー対象を実変更に絞ります。

---

# 🇯🇵 日本語

## このスキルの目的（なぜ使うのか）

`kaisetu-pack/` で `npm run dev:prod` を走らせると、webpack の `--watch` が `webpack.config.js` のすべての entry を再ビルドします。`kaisetu-pack/src/` 配下の SCSS/JS を**編集していなくても**、`kaisetu-pack/assets/` 配下の出力ファイルが autoprefixer や minifier の差分（実質的にノイズ）だけ更新され、`git status` に modified として並びます。

そのまま全部コミットしてしまうと、PR が「実は何も変えていない asset の diff」で埋め尽くされ、レビューしにくくなります。このスキルは、そうした「ノイズだけの差分」を自動で検出し、ユーザー確認の上で `git checkout HEAD --` で元に戻す、**コミット直前のクリーンアップ専用スキル**です。

## いつ呼び出すか

- コミット前に作業ツリーをきれいにしたいとき
- 「discard webpack noise」「clean kaisetu asset rebuilds」「revert unintended assets」「clean up webpack rebuilds」などとユーザーが言ったとき
- `npm run dev:prod` を回した直後に、意図していない asset が大量に modified になっているとき

## ハード制約（安全装置）

- ✅ `kaisetu-pack/assets/` 配下のファイルだけを操作する
- 🚫 `kaisetu-pack/src/`, `kaisetu-pack/webpack.config.js`, `kaisetu-pack/package.json`, `wp_core/` などは絶対に触らない
- 🚫 自動 revert は行わない。必ずプレビューを出してユーザーに確認を取る
- 🚫 untracked ファイルは削除しない。tracked かつ modified（`git status -- M`）だけが対象
- 🚫 cwd が `ibjap-design` リポジトリルート（= `kaisetu-pack/webpack.config.js` が存在する）でなければ実行拒否

## ファイル構成

```
~/.cursor/skills/clean-kaisetu-asset-rebuilds/
├── SKILL.md                          # スキル本体（フロントマター + 手順書）
└── scripts/
    ├── find-webpack-noise.js         # 検出スクリプト（Node.js）
    └── revert-noise.sh               # revert 実行スクリプト（Bash）
```

## ワークフロー

1. cwd が `ibjap-design` リポジトリルートか確認
2. 検出スクリプト `find-webpack-noise.js` を実行
3. プレビュー（`intended` / `unintended` / `unmapped`）をユーザーに表示
4. ユーザーに confirm を取る
5. 確認が取れたら `revert-noise.sh` 経由で `git checkout HEAD --` を実行
6. `git status --short` で残りの変更を表示

## 仕組み（ざっくり）

- `find-webpack-noise.js` は `kaisetu-pack/webpack.config.js` を `require()` し、各 entry の `output.filename`（JS）と `MiniCssExtractPlugin` の filename（CSS）から **「source ファイル → output ファイル」のマッピング**を構築する。
- そのうえで `git status --short` を読み、`kaisetu-pack/assets/` の modified ファイルを 3 つに分類する：
    - **intended**：source（`kaisetu-pack/src/...`）も modified → 本物の差分なので残す
    - **unintended**：source は無編集 → webpack ノイズなので revert 候補
    - **unmapped**：webpack の entry に紐づかない → 手動判断にする
- `revert-noise.sh` は引数を必ず `kaisetu-pack/assets/` 配下に限定する safety net 付きで `git checkout HEAD -- "$@"` を実行する。

## ファイル本体

### `SKILL.md`

- クリックして展開
    
    ```markdown
    ---
    name: clean-kaisetu-asset-rebuilds
    description: Detects webpack-only noise in kaisetu-pack/assets/ (CSS/JS files whose source SCSS/JS in kaisetu-pack/src/ was not edited) and reverts them with git checkout HEAD --. Use before committing in the ibjap-design repo, or when the user mentions "clean kaisetu asset rebuilds", "discard webpack noise", "revert unintended assets", "clean up webpack rebuilds", or accidentally committing webpack output files from running npm run dev:prod.
    ---
    
    # Clean Kaisetu Asset Rebuilds
    
    When `npm run dev:prod` runs in `kaisetu-pack/`, webpack `--watch` rebuilds every entry in `kaisetu-pack/webpack.config.js`. Most rebuilt files in `kaisetu-pack/assets/` get only autoprefixer/minifier noise even though the underlying SCSS/JS in `kaisetu-pack/src/` was not touched. This skill identifies those noisy outputs and reverts them with `git checkout HEAD --` after the user confirms.
    
    ## Hard constraints
    
    - **Only operates on files inside `kaisetu-pack/assets/`.** Never touches `kaisetu-pack/src/`, `kaisetu-pack/webpack.config.js`, `kaisetu-pack/package.json`, `wp_core/`, or anything else.
    - **Never auto-reverts.** Always shows a preview and asks the user to confirm.
    - **Never deletes untracked files.** Only modifies files that are tracked and modified (`git status -- M`).
    - Refuses to run if the cwd is not the `ibjap-design` repo root (must contain `kaisetu-pack/webpack.config.js`).
    
    ## Workflow
    
    Copy this checklist and track progress:
    
    ```
    
    - [ ]  Step 1: Verify cwd is ibjap-design repo root
    - [ ]  Step 2: Run the detector script
    - [ ]  Step 3: Show preview to user
    - [ ]  Step 4: Get user confirmation
    - [ ]  Step 5: Run the revert script (only if confirmed)
    - [ ]  Step 6: Show final git status
    
    ```
    
    ### Step 1: Verify cwd
    
    Confirm `kaisetu-pack/webpack.config.js` exists relative to the cwd. If not, abort and tell the user to `cd` into the `ibjap-design` repo root.
    
    ### Step 2: Run the detector
    
    From the repo root:
    
    ```
    
    node ~/.cursor/skills/clean-kaisetu-asset-rebuilds/scripts/find-webpack-noise.js
    
    ```
    
    This emits JSON to stdout:
    
    ```
    
    {
    
    "intended": ["kaisetu-pack/assets/<file>", ...],
    
    "unintended": ["kaisetu-pack/assets/<file>", ...],
    
    "unmapped": ["kaisetu-pack/assets/<file>", ...]
    
    }
    
    ```
    
    - `intended` — the source file (under `kaisetu-pack/src/`) for this output IS modified in `git status`. The asset diff is real. Keep.
    - `unintended` — none of the source files for this output are modified. The asset diff is webpack-only noise. Safe to revert.
    - `unmapped` — the modified asset is not produced by any webpack entry. Show to user; do NOT auto-revert.
    
    ### Step 5: Revert
    
    ```
    
    ~/.cursor/skills/clean-kaisetu-asset-rebuilds/scripts/[revert-noise.sh](http://revert-noise.sh) \
    
    kaisetu-pack/assets/file1.css \
    
    kaisetu-pack/assets/file2.js \
    
    ...
    
    ```jsx
    
    ```
    

### `scripts/find-webpack-noise.js`

- クリックして展開
    
    ```jsx
    #!/usr/bin/env node
    'use strict';
    
    /*
     * find-webpack-noise.js
     *
     * Detects webpack-only noise in kaisetu-pack/assets/ by comparing modified
     * asset files (per `git status`) against the source -> output mapping
     * derived from kaisetu-pack/webpack.config.js.
     *
     * Output (JSON to stdout):
     *   {
     *     "intended":  [...],
     *     "unintended":[...],
     *     "unmapped":  [...]
     *   }
     *
     * Run from the ibjap-design repo root.
     */
    
    const path = require('path');
    const fs = require('fs');
    const { execSync } = require('child_process');
    
    function fail(msg, code = 1) {
      process.stderr.write(`find-webpack-noise: ${msg}\n`);
      process.exit(code);
    }
    
    const repoRoot = process.cwd();
    const webpackConfigPath = path.join(repoRoot, 'kaisetu-pack', 'webpack.config.js');
    if (!fs.existsSync(webpackConfigPath)) {
      fail(`expected ${webpackConfigPath} to exist; cd into the ibjap-design repo root first.`);
    }
    
    const kaisetuPackDir = path.join(repoRoot, 'kaisetu-pack');
    process.chdir(kaisetuPackDir);
    let configs;
    try {
      configs = require(webpackConfigPath);
    } catch (e) {
      fail(`failed to load webpack.config.js: ${e.message}\nDid you run \`npm install\` in kaisetu-pack/?`);
    }
    process.chdir(repoRoot);
    
    if (!Array.isArray(configs)) {
      configs = [configs];
    }
    
    const outputToSources = new Map();
    
    function normalizeSource(entry) {
      const abs = path.resolve(kaisetuPackDir, entry);
      return path.relative(repoRoot, abs);
    }
    
    function addOutput(outputFilename, sources) {
      if (!outputFilename) return;
      const outputPath = path.posix.join('kaisetu-pack', 'assets', outputFilename);
      if (!outputToSources.has(outputPath)) {
        outputToSources.set(outputPath, new Set());
      }
      const set = outputToSources.get(outputPath);
      sources.forEach((s) => set.add(s));
    }
    
    for (const cfg of configs) {
      if (!cfg || !cfg.entry) continue;
      const entries = Array.isArray(cfg.entry) ? cfg.entry : [cfg.entry];
      const sources = entries.map(normalizeSource);
      if (cfg.output && cfg.output.filename) {
        addOutput(cfg.output.filename, sources);
      }
      if (Array.isArray(cfg.plugins)) {
        for (const plugin of cfg.plugins) {
          if (!plugin || typeof plugin !== 'object') continue;
          const ctorName = plugin.constructor && plugin.constructor.name;
          if (ctorName !== 'MiniCssExtractPlugin') continue;
          const cssFilename = plugin.options && plugin.options.filename;
          if (cssFilename) addOutput(cssFilename, sources);
        }
      }
    }
    
    let statusOut;
    try {
      statusOut = execSync('git status --short --untracked-files=no -- kaisetu-pack/', {
        cwd: repoRoot,
        encoding: 'utf8',
      });
    } catch (e) {
      fail(`git status failed: ${e.message}`);
    }
    
    const modifiedSources = new Set();
    const modifiedAssets = new Set();
    
    for (const rawLine of statusOut.split('\n')) {
      if (!rawLine.trim()) continue;
      const status = rawLine.slice(0, 2);
      const file = rawLine.slice(3).trim();
      if (status.includes('?')) continue;
      if (file.startsWith('kaisetu-pack/src/')) {
        modifiedSources.add(file);
      } else if (file.startsWith('kaisetu-pack/assets/')) {
        modifiedAssets.add(file);
      }
    }
    
    const intended = [];
    const unintended = [];
    const unmapped = [];
    
    for (const asset of [...modifiedAssets].sort()) {
      const sources = outputToSources.get(asset);
      if (!sources) {
        unmapped.push(asset);
        continue;
      }
      let anySourceModified = false;
      for (const src of sources) {
        if (modifiedSources.has(src)) {
          anySourceModified = true;
          break;
        }
      }
      if (anySourceModified) {
        intended.push(asset);
      } else {
        unintended.push(asset);
      }
    }
    
    process.stdout.write(JSON.stringify({ intended, unintended, unmapped }, null, 2) + '\n');
    ```
    

### `scripts/revert-noise.sh`

- クリックして展開
    
    ```bash
    #!/usr/bin/env bash
    #
    # revert-noise.sh
    #
    # Reverts the given files via `git checkout HEAD --`.
    # Refuses any path that is not under kaisetu-pack/assets/ as a safety net,
    # even if the agent's detector script slipped up.
    #
    # Usage:
    #   revert-noise.sh kaisetu-pack/assets/foo.css kaisetu-pack/assets/bar.js ...
    
    set -euo pipefail
    
    if [[ $# -eq 0 ]]; then
      echo "revert-noise: no files given, nothing to do." >&2
      exit 0
    fi
    
    if [[ ! -f kaisetu-pack/webpack.config.js ]]; then
      echo "revert-noise: must be run from the ibjap-design repo root (kaisetu-pack/webpack.config.js not found)." >&2
      exit 2
    fi
    
    for arg in "$@"; do
      case "$arg" in
        kaisetu-pack/assets/*) ;;
        *)
          echo "revert-noise: refusing to revert '$arg' — only paths under kaisetu-pack/assets/ are allowed." >&2
          exit 3
          ;;
      esac
      if [[ "$arg" == *".."* ]]; then
        echo "revert-noise: refusing path containing '..': '$arg'" >&2
        exit 3
      fi
    done
    
    git checkout HEAD -- "$@"
    
    echo "Reverted ${#} file(s):"
    for arg in "$@"; do
      echo "  - $arg"
    done
    ```
    

## 注意点

- `find-webpack-noise.js` は `kaisetu-pack/webpack.config.js` を `require()` するため、`kaisetu-pack/` で `npm install` 済みである必要がある（`npm run dev:prod` を回しているなら満たされている）
- このスキルは webpack config を**読むだけ**で書き換えない
- `wp_core/wp-content/ai1wm-backups/index.php` のような webpack と無関係なノイズは対象外（手動で対応する）

---

# 🇬🇧 English

Project Context / プロジェクト概要

## 🇬🇧 English (Overview First)

This skill pertains to the IBJ project `ibjap-design`, which contains the front-end build pipeline for `kaisetu-pack/` and related WordPress theme integration.

- Project: `ibjap-design`
- Repository URL: [https://gitlab.ibj.net/ibjs/ibjap-design](https://gitlab.ibj.net/ibjs/ibjap-design)

### Why webpack is run

Webpack is run to compile and bundle source assets (SCSS/JS) into deployable CSS/JS for pages managed under `kaisetu-pack/`. It applies transformations such as extraction, transpilation, and optimization so browser-ready files are generated consistently.

### What happens when webpack runs

When `npm run dev:prod` runs, webpack watch mode rebuilds entries defined in `kaisetu-pack/webpack.config.js`. This can regenerate many files in `kaisetu-pack/assets/`, including files whose original source files were not edited.

### Reason behind this skill

Because rebuilds can produce formatting/minification-only diffs (noise), `git status` may show many modified asset files that do not represent intentional functional changes. This skill detects those noise-only outputs and reverts only the safe candidates (with user confirmation), so PR diffs stay focused on real changes.

## Purpose (Why this skill exists)

When you run `npm run dev:prod` inside `kaisetu-pack/`, webpack's `--watch` rebuilds every entry defined in `webpack.config.js`. Even if you haven't touched any SCSS/JS under `kaisetu-pack/src/`, the corresponding output files in `kaisetu-pack/assets/` get rewritten with autoprefixer/minifier-level differences — essentially noise — and show up as modified in `git status`.

If you commit them as-is, your PR ends up cluttered with diffs of asset files you didn't actually change, making review harder. This skill is a **pre-commit cleanup tool** that automatically detects those noise-only diffs and reverts them with `git checkout HEAD --` after user confirmation.

## When to invoke

- Before committing, to keep the working tree clean
- When the user says things like "discard webpack noise", "clean kaisetu asset rebuilds", "revert unintended assets", "clean up webpack rebuilds"
- Right after running `npm run dev:prod`, when a bunch of unintended assets show up as modified

## Hard constraints (safety guards)

- ✅ Only operates on files inside `kaisetu-pack/assets/`
- 🚫 Never touches `kaisetu-pack/src/`, `kaisetu-pack/webpack.config.js`, `kaisetu-pack/package.json`, `wp_core/`, etc.
- 🚫 Never auto-reverts — always shows a preview and asks for confirmation
- 🚫 Never deletes untracked files — only tracked & modified files (`git status -- M`)
- 🚫 Refuses to run if the cwd is not the `ibjap-design` repo root

## File layout

```
~/.cursor/skills/clean-kaisetu-asset-rebuilds/
├── SKILL.md                          # Skill body (frontmatter + workflow)
└── scripts/
    ├── find-webpack-noise.js         # Detector (Node.js)
    └── revert-noise.sh               # Revert executor (Bash)
```

## Workflow

1. Verify cwd is the `ibjap-design` repo root
2. Run the detector script `find-webpack-noise.js`
3. Show the preview (`intended` / `unintended` / `unmapped`) to the user
4. Get user confirmation
5. On confirm, run `revert-noise.sh` to execute `git checkout HEAD --`
6. Show `git status --short` to display remaining changes

## How it works

- `find-webpack-noise.js` `require()`s `kaisetu-pack/webpack.config.js`, then builds a **source-file → output-file** map from each entry's `output.filename` (JS) and `MiniCssExtractPlugin` filename (CSS).
- It then reads `git status --short` and classifies modified files under `kaisetu-pack/assets/` into three buckets:
    - **intended**: the source file (under `kaisetu-pack/src/...`) is also modified → real change, keep
    - **unintended**: the source is untouched → webpack noise, candidate for revert
    - **unmapped**: not tied to any webpack entry → leave to manual judgment
- `revert-noise.sh` runs `git checkout HEAD -- "$@"` with a safety net that rejects any argument outside `kaisetu-pack/assets/`.

## Notes

- `find-webpack-noise.js` uses `require()` on `kaisetu-pack/webpack.config.js`, so `npm install` must have been run in `kaisetu-pack/` (always satisfied if you're running `npm run dev:prod`)
- This skill **only reads** the webpack config — it never modifies it
- Unrelated noise like `wp_core/wp-content/ai1wm-backups/index.php` is out of scope and handled manually

## Source files

The full content of `SKILL.md`, `scripts/find-webpack-noise.js`, and `scripts/revert-noise.sh` is shown in the Japanese section above (in the toggle blocks). The code is identical regardless of language — only the surrounding explanation differs.

[Skill Source Files - clean-kaisetu-asset-rebuilds](Skill%20clean-kaisetu-asset-rebuilds%EF%BC%88webpack%20%E3%83%8E%E3%82%A4%E3%82%BA%E6%95%B4%E7%90%86%E3%82%B9%E3%82%AD/Skill%20Source%20Files%20-%20clean-kaisetu-asset-rebuilds%20359c16915849818b8f95ce178624f82c.md)