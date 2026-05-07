# GitHub Repository Search

GitHub のリポジトリを検索する Web アプリケーションです。

## デモ

<!-- Vercel デプロイ後に URL を記載 -->

## セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/sla10132000/github-repository-search.git
cd github-repository-search

# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

http://localhost:3000 でアプリケーションが起動します。

### 環境変数（任意）

GitHub API のレート制限を緩和したい場合は `.env.local` を作成してください。

```bash
cp .env.example .env.local
```

`.env.local` に GitHub Personal Access Token を設定すると、レート制限が 60回/時 → 5,000回/時 に緩和されます。トークンがなくても動作します。

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js v16（App Router） |
| 言語 | TypeScript（strict モード） |
| UI | shadcn/ui + Tailwind CSS v4 |
| リンター / フォーマッター | Biome |
| テスト | Vitest + React Testing Library + Playwright |
| CI/CD | GitHub Actions |
| ホスティング | Vercel |

## ディレクトリ構成

```
src/
├── app/                          # ページ（App Router）
│   ├── page.tsx                  # 検索一覧
│   ├── loading.tsx               # スケルトン UI
│   ├── error.tsx                 # エラーバウンダリ
│   └── repositories/[owner]/[repo]/
│       └── page.tsx              # リポジトリ詳細
├── components/
│   ├── layout/                   # レイアウト（Header）
│   ├── search/                   # 検索フォーム・結果一覧
│   ├── repository/               # リポジトリカード・統計
│   ├── pagination/               # ページネーション
│   └── ui/                       # shadcn/ui ベースコンポーネント
├── lib/
│   ├── github.ts                 # GitHub API クライアント
│   └── constants.ts              # 定数定義
├── types/
│   └── github.ts                 # 型定義
└── __tests__/
    ├── lib/                      # Unit テスト
    ├── components/               # コンポーネントテスト
    └── e2e/                      # E2E テスト
```

### なぜこの構成にしたか

- **`lib/` に API クライアントを分離**: ページコンポーネントから API の詳細を隠蔽し、テスタビリティを確保するため。API クライアントを単体でモック・テストできる。
- **`types/` を独立ディレクトリに**: 型定義を一箇所に集約することで、API レスポンスの構造変更時に影響範囲を限定できる。
- **`components/` を機能単位で分割**: `search/`, `repository/`, `pagination/` と責務ごとに分けることで、各コンポーネントの役割が明確になる。

## 設計判断

### Server Component と Client Component の使い分け

| コンポーネント | 種別 | 理由 |
|--------------|------|------|
| 検索一覧ページ | Server | API 呼び出しをサーバーで行い、クライアントへの JS 配信量を削減 |
| 詳細ページ | Server | 同上 |
| 検索フォーム | Client | ユーザー入力の状態管理が必要 |
| ページネーション | Client | URL 遷移のインタラクションが必要 |

**原則**: デフォルトは Server Component とし、ユーザー操作が必要な部分のみ Client Component にする。

### 状態管理

状態管理ライブラリ（Redux, Zustand 等）は使用せず、**URL の searchParams を Single Source of Truth** としている。

- 検索キーワード → `?q=keyword`
- ページ番号 → `?page=2`

理由:
- ブラウザの戻る/進むで検索状態が復元される
- URL を共有すれば同じ検索結果が再現される
- Server Component で `searchParams` を直接参照でき、シンプルな実装になる

### エラーハンドリング

API クライアントで以下の3層でエラーを処理している:

1. **ネットワークエラー**: `fetch` の失敗をキャッチし、ユーザー向けメッセージに変換
2. **API エラー**: ステータスコード別のメッセージ（403 → レート制限、404 → 未発見、422 → 不正なクエリ）
3. **レスポンス検証**: 型ガードで API レスポンスの形式を検証し、想定外のデータ構造を防ぐ

### テスト戦略

テストピラミッドの考え方に基づき、下層ほど厚く、上層は薄く設計している。

```
        /  E2E  \          ← 1シナリオ（クリティカルパス）
       /----------\
      / Integration \       ← コンポーネント描画・操作
     /----------------\
    /      Unit        \    ← API クライアント・ロジック
   /--------------------\
  /  Static (TS + Biome) \  ← 型チェック・lint
```

- **Static**: TypeScript `strict` + Biome で、コード記述時点でバグを防ぐ（Shift-left）
- **Unit**: API クライアントのレスポンス処理、エラーハンドリング、ページネーション計算
- **Integration**: SearchForm の描画・入力・送信
- **E2E**: 検索 → 結果表示 → 詳細遷移 → 戻る のクリティカルパスのみ

### テスト選定の軸

「壊れたとき気づきにくい」「手動再現が難しい」「ロジックが分岐する」箇所を優先してテストを書いた。これは *Software Engineering at Google*（SWE Book ch.11）が示す考え方 — **「障害は避けられない。実際の障害を待たずにエッジケースやエラーをシミュレートせよ」** — に基づくリスクベーステストの実践である。

| 軸 | 対象 | 具体例 |
|---|---|---|
| **ロジックの複雑さ** | 純粋関数・境界値・エッジケースが多い箇所 | `calcVisiblePages`（先頭・中央・末尾のウィンドウ計算）、`isValidRepository`（型ガード） |
| **外部依存のエラーハンドリング** | 本番で再現しにくいエラー系 | `fetch` をモックして 403/404/422/ネットワークエラーを網羅 |
| **ユーザー操作フロー** | 入力→状態変化→URL 遷移の一連の流れ | `SearchForm`・`SortSelect` の入力→送信→`router.push` 呼び出し確認 |
| **条件による表示切り替え** | 分岐が多く目視確認が漏れやすい UI | `description: null` 時の非表示、0件時の「該当なし」メッセージ |
| **アクセシビリティ属性** | スクリーンリーダー対応など手動確認しにくい属性 | `aria-current="page"`、`aria-label="ページネーション"` の検証 |

## 工夫した点・拘ったポイント

<!-- TODO: ここはあなた自身の言葉で加筆・修正してください -->

- **アクセシビリティ**: 検索フォームに `aria-label` を設定、ページネーションに `nav` + `aria-label` を使用し、スクリーンリーダーでの操作を考慮した。
- **レスポンシブ対応**: モバイルではページネーションを「前へ/次へ + 現在ページ表示」に簡略化、統計情報を 2×2 グリッドに変更するなど、画面幅に応じた最適な表示にした。
- **スケルトン UI**: `loading.tsx` で実際のコンテンツと同じレイアウトのスケルトンを表示し、コンテンツシフトを防止。
- **セキュリティ**: `GITHUB_TOKEN` を Server Component でのみ使用しクライアントに露出させない。`X-Content-Type-Options`, `X-Frame-Options` 等のセキュリティヘッダーを設定。

## コマンド一覧

```bash
pnpm dev            # 開発サーバー起動
pnpm build          # プロダクションビルド
pnpm check          # Biome lint + format チェック
pnpm type-check     # TypeScript 型チェック
pnpm test           # Unit + Integration テスト
pnpm test:e2e       # E2E テスト（Playwright）
```

## AI 利用レポート

本プロジェクトの開発において、Claude Code（Claude Opus 4.6）を活用しました。

### 利用した場面

- **設計ドキュメントの作成支援**: 課題仕様書、基本設計案、詳細設計のドキュメント構成・内容の壁打ち
- **コード生成**: 詳細設計に基づいたコンポーネント・API クライアント・テストコードの生成
- **設定ファイルの作成**: Biome, Vitest, Playwright, GitHub Actions 等の設定
- **レビュー・修正**: 型エラーの修正、shadcn/ui v4 の API 差分への対応

### AI に任せなかった部分

<!-- TODO: ここもあなた自身の言葉で記載してください -->
- 設計判断の最終決定
- 工夫した点の言語化
