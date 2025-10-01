# ビジネスシステム

業務効率化のためのビジネス管理システムです。Excelベースのデータ入力と自動計算機能を提供します。
<img width="1919" height="921" alt="image" src="https://github.com/user-attachments/assets/63822209-8d1d-4fdd-9b14-d14b1cea3094" />

## 機能

### 認証システム
- メール/パスワードログイン
- ロールベース権限管理（管理者、一般ユーザー）

### 管理者機能
- グローバルパラメータの管理
- システム全体の設定変更

### ユーザー機能
- Excelライクなデータ入力フォーム
- リアルタイム自動計算
- データの自動保存
- PDF出力機能

### シート一覧
- スタート
- MQ(現状)
- ①利益
- ②③MQ(未来)
- ③給料
- ④経費
- ⑤製造原価(人)
- ⑥製造(経費)
- ⑦原価詳細
- 損益分岐点
- 進捗実績値入力シート
- 部門別販売計画
- 利益計画表

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **バックエンド**: Node.js + Express (独立サーバー)
- **データベース**: PostgreSQL
- **ORM**: Prisma
- **認証**: JWT
- **PDF生成**: jsPDF
- **UIコンポーネント**: shadcn/ui
- **開発**: フロントエンドとバックエンドの分離アーキテクチャ

## セットアップ

### 前提条件
- Node.js 18以上
- PostgreSQL 12以上
- npm または yarn

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd business-system
```

2. 依存関係をインストール

**自動セットアップ（推奨）**
```bash
# Windows
setup.bat

# Linux/Mac
chmod +x setup.sh
./setup.sh
```

**手動セットアップ**
```bash
# すべての依存関係をインストール
npm run install:all

# または個別にインストール
npm install
cd server && npm install
cd ../client && npm install
```

3. 環境変数を設定

**サーバー側**
```bash
cp server/env.example server/.env
```

**クライアント側**
```bash
cp client/env.example client/.env.local
```

各`.env`ファイルを編集して、適切な設定を行ってください。

4. データベースをセットアップ
```bash
# Prismaクライアントを生成
npm run db:generate

# データベースマイグレーションを実行
npm run db:push

# サンプルデータを作成
npm run db:seed
```

5. 開発サーバーを起動

**オプション1: フロントエンドとバックエンドを同時に起動**
```bash
npm run dev
```

**オプション2: 個別に起動**
```bash
# バックエンドサーバー (ポート3001)
npm run dev:server

# フロントエンド (ポート3000) - 別のターミナルで
npm run dev:client
```

アプリケーションは以下でアクセスできます：
- フロントエンド: `http://localhost:3000`
- バックエンドAPI: `http://localhost:3001`

## プロジェクト構造

```
├── server/               # Express バックエンド
│   ├── index.ts          # メインサーバー
│   ├── routes/           # API ルート
│   │   ├── auth.ts       # 認証
│   │   ├── admin.ts      # 管理者機能
│   │   ├── user.ts       # ユーザー機能
│   │   ├── calculate.ts  # 計算
│   │   └── pdf.ts        # PDF生成
│   ├── middleware/       # ミドルウェア
│   ├── lib/             # ユーティリティ
│   ├── prisma/          # データベーススキーマ
│   └── package.json     # サーバー依存関係
├── client/              # Next.js フロントエンド
│   ├── app/             # Next.js App Router
│   ├── components/      # React コンポーネント
│   │   ├── ui/          # shadcn/ui コンポーネント
│   │   ├── auth/        # 認証コンポーネント
│   │   ├── layout/      # レイアウトコンポーネント
│   │   └── sheets/      # シートコンポーネント
│   ├── lib/             # フロントエンドユーティリティ
│   └── package.json     # クライアント依存関係
├── package.json         # ルート依存関係
└── README.md           # ドキュメント
```

## データベーススキーマ

### Users
- id: ユーザーID
- email: メールアドレス
- name: 名前
- password: ハッシュ化されたパスワード
- role: ロール（ADMIN/USER）

### GlobalParameters
- id: パラメータID
- key: パラメータキー
- value: パラメータ値
- description: 説明

### UserInputs
- id: 入力ID
- userId: ユーザーID
- sheet: シート名
- cellKey: セルキー
- value: 入力値

## API エンドポイント

すべてのAPIエンドポイントは `http://localhost:3001` で提供されます。

### 認証
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/me` - 現在のユーザー情報

### 管理者
- `GET /api/admin/parameters` - グローバルパラメータ取得
- `POST /api/admin/parameters` - グローバルパラメータ更新

### ユーザー
- `GET /api/user/inputs` - ユーザー入力データ取得
- `POST /api/user/inputs` - ユーザー入力データ保存
- `POST /api/calculate` - 計算実行
- `POST /api/pdf/generate` - PDF生成

### ヘルスチェック
- `GET /api/health` - サーバー状態確認

## 計算エンジン

TypeScriptで実装された純粋関数ベースの計算エンジンです。

### 主要機能
- 基本的な四則演算
- ビジネス固有の計算（利益率、損益分岐点など）
- リアルタイム計算
- 依存関係の自動解決

### 計算式例
- 利益計算: `売上 - コスト`
- 利益率: `(利益 / 売上) × 100`
- 損益分岐点: `固定費 / 貢献利益`

## デプロイ

### 本番環境でのセットアップ

1. 環境変数の設定
```bash
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-production-jwt-secret"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret"
```

2. データベースマイグレーション
```bash
npm run db:migrate
```

3. アプリケーションのビルド
```bash
npm run build
npm start
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## サポート

問題や質問がある場合は、GitHubのIssuesページで報告してください。
