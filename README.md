# 大耳狗雙人集點卡

1. 到 https://console.firebase.google.com/ 建立專案（可不啟用 Analytics）。
2. 專案總覽點網頁圖示 </>，註冊 Web App，不必啟用 Firebase Hosting。本版本已填入 Firebase 連線設定。
3. Build → Authentication → Get started → Sign-in method，啟用 Email/Password。到 Users → Add user 建立自己的管理員帳號，複製該使用者 UID。不要將密碼寫入程式碼或 GitHub。
4. Build → Firestore Database → Create database，選擇 Standard（如有選項）及適合的區域，使用 production mode。
5. Firestore 的 Rules 頁面貼上 firestore.rules 全文，管理員 UID 已填入，直接按 Publish。這是必要步驟：只有該 UID 能寫入，其他人即使登入也不能修改。不要使用測試模式的公開寫入規則。
6. 建立 GitHub public repository，將本資料夾內所有檔案上傳至根目錄。Settings → Pages → Deploy from a branch → main → /(root) → Save。
7. 開啟 https://你的帳號.github.io/你的repo/ 。若登入出現 unauthorized-domain，在 Firebase Authentication → Settings → Authorized domains 加入 你的帳號.github.io（不含 https 或路徑）。
8. 管理員登入後按蓋章，首次操作會自動建立 cards/main 文件。用無痕視窗或另一支手機打開相同網址，確認能同步查看且不能寫入。

每日限制：台灣日期由管理員裝置計算，正常介面每日只能蓋一次；管理員可撤銷後重蓋或重置。這不是伺服器強制每日限制，管理員若改時鐘或直接呼叫 API 可以繞過。訪客無法寫入的限制由 Firestore 規則強制。

隱私：任何知道網址的人均可讀取集點進度與日期，請勿存放姓名或敏感資訊。Firebase 網頁 config 可公開，密碼與服務帳戶私鑰不可公開。免費 Spark 方案有用量限制。本站未實際連接你的 Firebase 或 GitHub，需完成設定後測試。
