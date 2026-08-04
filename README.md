# JEAD Research Portal — v0.1 (MVP)

Japan Enterprise AI Database の公式リサーチポータル、最小構成版。名刺のQRコードから
アクセスし、JEADを理解し、参加登録できることのみを目的とした v0.1 です。

## 技術構成

| 項目 | 内容 |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| フォント | システムフォント（Hiragino / Yu Gothic / Meiryo）— 外部フォント取得なし、ビルドがネットワーク非依存 |
| データ保存 | なし。登録フォームは `mailto:` リンクでメールアプリを起動する方式（DB・CRM・ログイン一切なし） |
| デプロイ想定 | Vercel（無料枠） |

## ページ構成

```
/                トップページ
/about           JEADとは
/participation   研究参加（3方法の案内。設問そのものは未実装）
/ethics          研究倫理
/contact         お問い合わせ
/register        参加登録フォーム（?type=interview で面談希望を明示）
/thank-you       登録完了
```

## ローカル開発

```bash
npm install
npm run dev
# http://localhost:3000
```

## ビルド確認

```bash
npm run build
npm run start
```

ローカル環境で `npm run build` が成功し、全8ルートが静的生成されることを確認済みです
（本セッションで実施済み）。

## 登録フォームの挙動（重要）

`/register` の送信ボタンは、サーバーやデータベースに送信するのではなく、
入力内容を件名・本文に埋め込んだ `mailto:` リンクを開きます。実際に運用する際は、
`components/RegisterForm.tsx` 内の `CONTACT_EMAIL` を実際の受信用メールアドレスに
書き換えてください（`app/contact/page.tsx` の `CONTACT_EMAIL` も同様）。

これはv0.1の意図的な制約です（Stop Rule：DB・CRM・ログインは後続フェーズ）。

## デプロイ手順（GitHub + Vercel）

このリポジトリの作成・デプロイには、あなた自身のGitHubアカウント・Vercelアカウントでの
認証が必要です（このエージェントセッションには認証情報がないため、ここから先はお手元で
実行してください。所要時間はおよそ5分です）。

### 1. GitHubにリポジトリを作成してpush

```bash
cd jead-portal
gh auth login          # 初回のみ。ブラウザでGitHubにログイン
gh repo create jead-portal --public --source=. --remote=origin --push
```

`gh` コマンドがない場合は `brew install gh`、またはGitHub上で手動リポジトリを作成し、
以下でpushしてください。

```bash
git remote add origin https://github.com/<あなたのユーザー名>/jead-portal.git
git branch -M main
git push -u origin main
```

### 2. Vercelにデプロイ

```bash
npx vercel login       # 初回のみ。メール認証
npx vercel --prod
```

コマンド実行後、Vercelが公開URL（例：`https://jead-portal-xxxx.vercel.app`）を
発行します。以降、GitHubにpushするたびに自動で再デプロイされます
（Vercel側でリポジトリと連携した場合）。

### 3. QRコードを生成

公開URLが確定したら、以下を実行してください。

```bash
npm run qr -- https://あなたの実際のURL.vercel.app
```

`qr/jead-qr.png`（1024×1024）と `qr/jead-qr.svg` が生成されます。名刺印刷には
SVGを推奨します（拡大しても劣化しません）。

## 完了確認チェックリスト

デプロイ後、以下を確認してください。

- [ ] 公開URLがブラウザで開く
- [ ] スマートフォンで公開URLが開く
- [ ] ナビゲーション（ホーム／JEADとは／研究参加／研究倫理／お問い合わせ）が機能する
- [ ] `/register` が開き、フォーム送信でメールアプリが起動する
- [ ] `/thank-you` が表示される
- [ ] QRコードをスマートフォンで読み取り、公開URLが開く

## 次フェーズ（本v0.1では着手しない）

Quick Assessment（設問実装）／Core40／スコアリングエンジン／AI診断／データベース／
管理ダッシュボード／Benchmark機能。いずれも後続フェーズの範囲。
