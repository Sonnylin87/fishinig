# 釣魚對戰遊戲

這是一個多人在線釣魚對戰遊戲。玩家可以釣魚、升級裝備，並與其他玩家競爭。

## 安裝

1. 克隆此存儲庫
2. 運行 `npm install`

## 運行

1. 複製 `.env.example` 文件並重命名為 `.env.local`
2. 在 `.env.local` 文件中設置 `NEXT_PUBLIC_WEBSOCKET_URL` 和 `NEXT_PUBLIC_API_URL`
3. 運行 `npm run dev` 啟動開發服務器
4. 打開 http://localhost:3000 查看應用程序

## 部署

1. 運行 `npm run build` 構建應用程序
2. 運行 `npm start` 啟動生產服務器

你也可以將此應用程序部署到 Vercel 或其他支持 Next.js 的平台。

## 配置

你可以通過設置以下環境變量來配置應用程序：

- `NEXT_PUBLIC_WEBSOCKET_URL`: WebSocket 服務器的 URL
- `NEXT_PUBLIC_API_URL`: API 服務器的 URL

在開發中，你可以在 `.env.local` 文件中設置這些變量。在生產環境中，請使用你的部署平台提供的環境變量設置方法。

## 遊戲說明

1. 在遊戲大廳中，你可以加入隨機遊戲或創建/加入派對。
2. 在遊戲中，你可以選擇釣竿和魚餌進行釣魚。
3. 擲骰子決定你能否釣到魚。
4. 出售魚獲得金錢，用於購買更好的裝備。
5. 第一個釣到價值 50 或以上的魚的玩家獲勝！

祝你玩得開心！

