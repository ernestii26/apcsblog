// 引入相關套件
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// 創建 Express 應用程式
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 假設我們的文章資料存儲在一個陣列中
let articles = [];

// 上傳文章
app.post('/api/articles', (req, res) => {
  const { title, content } = req.body;

  // 做一些驗證，確保標題和內容都存在
  if (!title || !content) {
    return res.status(400).json({ error: '標題和內容是必填的' });
  }

  // 創建一個新的文章物件，包含建立日期
  const article = {
    id: articles.length + 1,
    title,
    content,
    date: new Date().toLocaleDateString() // 使用當前日期作為建立日期
  };

  // 將文章存入資料庫
  articles.push(article);

  // 返回成功訊息和新增的文章
  res.status(200).json({ message: '文章已成功上傳', article });
});

// 瀏覽所有文章
app.get('/api/articles', (req, res) => {
  // 返回所有的文章
  res.status(200).json(articles);
});

// 瀏覽單篇文章
app.get('/articles/:id', (req, res) => {
  const { id } = req.params;
  const article = articles.find(article => article.id === parseInt(id));

  if (!article) {
    return res.status(404).json({ error: '文章不存在' });
  }

  const articleHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${article.title}</title>
      <style>
        body {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        h1 {
          text-align: center;
        }

        .articleTitle {
          font-size: 20px;
          font-weight: bold;
        }

        .articleContent {
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <h1>${article.title}</h1>
      <p class="articleDate">建立日期：${article.date}</p>
      <p class="articleContent">${article.content}</p>
    </body>
    </html>
  `;

  res.send(articleHtml);
});

// 提供靜態檔案
app.use(express.static(path.join(__dirname, 'public')));

// 監聽端口
const port = 3000;
app.listen(port, () => {
  console.log(`伺服器運行在 http://localhost:${port}`);
});
