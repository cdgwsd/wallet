import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 初始化Express应用
const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 配置lowdb
const dbPath = join(__dirname, 'data', 'db.json');
const adapter = new JSONFile(dbPath);
const defaultData = { accounts: [], transactions: [] };
const db = new Low(adapter, defaultData);

// 初始化数据库
async function initDB() {
  try {
    await db.read();
    // 确保数据结构完整
    if (!db.data.accounts) db.data.accounts = [];
    if (!db.data.transactions) db.data.transactions = [];
    await db.write();
    console.log('数据库初始化成功');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    // 如果读取失败，使用默认数据
    db.data = defaultData;
    await db.write();
  }
}

// API路由 - 保存数据
app.post('/api/save-data', async (req, res) => {
  try {
    const { type, data } = req.body;
    if (!type || !data) {
      return res.status(400).json({ error: '缺少必要参数: type和data' });
    }

    await db.read();
    if (!db.data[type]) {
      db.data[type] = [];
    }
    db.data[type].push(data);
    await db.write();

    res.status(200).json({ success: true, message: '数据保存成功' });
  } catch (error) {
    res.status(500).json({ error: '数据保存失败', details: error.message });
  }
});

// API路由 - 删除数据
app.delete('/api/delete-data/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    await db.read();
    // 使用lowdb v7的update方法直接修改数据
    db.update(data => {
      data.accounts = data.accounts.filter(account => account.id != accountId);
    });
    await db.write();
    const data = db.data.accounts || [];
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: '数据删除失败', details: error.message });
  }
});

// API路由 - 获取数据
app.get('/api/get-data/:type', async (req, res) => {
  try {
    const { type } = req.params;
    await db.read();
    const data = db.data[type] || [];
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: '数据获取失败', details: error.message });
  }
});

// API路由 - 更新数据
app.put('/api/update-data', async (req, res) => {
  try {
    const { type, data } = req.body;
    if (!type || !data || !data.id) {
      return res.status(400).json({ error: '缺少必要参数: type、data或data.id' });
    }

    await db.read();
    if (!db.data[type]) {
      return res.status(404).json({ error: `找不到${type}类型的数据` });
    }

    // 查找并更新数据
    const index = db.data[type].findIndex(item => item.id == data.id);
    if (index === -1) {
      return res.status(404).json({ error: `找不到id为${data.id}的${type}数据` });
    }

    // 更新数据
    db.data[type][index] = data;
    await db.write();

    res.status(200).json({ success: true, message: '数据更新成功' });
  } catch (error) {
    res.status(500).json({ error: '数据更新失败', details: error.message });
  }
});

// 启动服务器 - 修改监听地址为0.0.0.0
app.listen(PORT, '0.0.0.0', async () => {
  await initDB();
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

