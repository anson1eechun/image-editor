# Image Editor

純前端的圖片編輯器：HTML5 Canvas + 原生 JavaScript，不需要任何建置步驟或外部套件。由 Hermes Agent 產生，2026-06。

## 可以用的功能

- 上傳（按鈕或拖放）與下載圖片
- 畫筆：大小、顏色、透明度
- 形狀：圓形、矩形、三角形、直線
- 文字：內容、大小、顏色
- 裁剪
- 濾鏡：亮度、對比、飽和度、色相、模糊
- 復原 / 重做（`history.js` 保存畫布狀態）
- 縮放（1×～2×）、深色 / 淺色主題切換

鍵盤快捷鍵：`Ctrl/Cmd+Z` 復原、`Ctrl/Cmd+Y` 重做、`Ctrl/Cmd+S` 儲存、`+` / `-` 縮放、`Esc` 取消。

## 已知問題

讀程式碼時發現以下功能有介面、但實際上沒有作用：

| 功能 | 原因 |
|---|---|
| 旋轉 90° / 180° / 270° | `app.js` 的 `handleRotation` 在暫存畫布上旋轉後，最後把原本的 `imageData` 寫回主畫布，旋轉結果被丟掉 |
| 水平 / 垂直翻轉 | 按鈕的 `data-angle` 是 `flip-h` / `flip-v`，`parseFloat` 後變成 `NaN`，沒有翻轉邏輯 |
| 色溫、銳利度 | `filters.js` 有 `applyColorTemperatureFilter`、`applySharpnessFilter`，但 `handleSliderInput` 沒有處理這兩個滑桿 |
| 明度 | 使用了 `lightness()`，這不是有效的 CSS filter 函式，瀏覽器會忽略 |
| 橡皮擦 | 原本的說明有寫，程式中沒有實作 |

## 執行

```bash
python3 -m http.server 8082   # 開 http://localhost:8082
```

也可以直接用瀏覽器開 `index.html`。

## 結構

```
index.html
src/
├── css/   style、components、animations、responsive、dark-theme、light-theme
└── js/
    ├── app.js       # 主程式：事件綁定、快捷鍵、濾鏡套用、縮放、下載
    ├── ui.js        # 介面狀態
    ├── tools.js     # 工具狀態管理
    ├── history.js   # 復原 / 重做
    ├── utils.js     # 共用影像處理函式
    └── tools/       # brush、text、shapes、filters、crop
```
