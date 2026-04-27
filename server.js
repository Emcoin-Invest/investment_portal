const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global database instance
let db = null;
let SQL = null;

// Initialize SQL.js
async function initializeDatabase() {
  SQL = await initSqlJs();
  
  const dbPath = path.join(__dirname, 'investment_portal.db');
  let filebuffer = null;

  try {
    filebuffer = fs.readFileSync(dbPath);
  } catch (e) {
    console.log('Creating new database');
  }

  db = new SQL.Database(filebuffer);

  // Create tables if they don't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'client')) DEFAULT 'client',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      accountNumber TEXT UNIQUE NOT NULL,
      status TEXT CHECK(status IN ('active', 'inactive', 'pending')) DEFAULT 'active',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      riskLevel TEXT CHECK(riskLevel IN ('low', 'medium', 'high')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS portfolios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER NOT NULL,
      productId INTEGER NOT NULL,
      quantity REAL NOT NULL,
      purchasePrice REAL NOT NULL,
      purchaseDate DATE NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES products(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS holdings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      portfolioId INTEGER NOT NULL,
      symbol TEXT NOT NULL,
      quantity REAL NOT NULL,
      price REAL NOT NULL,
      value REAL NOT NULL,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (portfolioId) REFERENCES portfolios(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER NOT NULL,
      type TEXT CHECK(type IN ('withdrawal', 'transfer', 'rebalance', 'other')) NOT NULL,
      status TEXT CHECK(status IN ('pending', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
      amount REAL,
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS statements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER NOT NULL,
      fileName TEXT NOT NULL,
      fileUrl TEXT NOT NULL,
      uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT,
      read INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  seedDatabase();
  console.log('Database initialized');
}

// Save database to file
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(path.join(__dirname, 'investment_portal.db'), buffer);
  }
}

// Seed initial data
function seedDatabase() {
  try {
    // Check if admin exists
    const adminResult = db.exec('SELECT * FROM users WHERE email = ?', ['admin@investment.com']);
    
    if (!adminResult || adminResult.length === 0) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      db.run(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        ['admin@investment.com', hashedPassword, 'Admin User', 'admin']
      );
      console.log('Admin user created');
    }

    // Check if sample products exist
    const productResult = db.exec('SELECT COUNT(*) as count FROM products');
    const productCount = productResult && productResult[0] && productResult[0].values[0] ? productResult[0].values[0][0] : 0;
    
    if (productCount === 0) {
      const products = [
        { name: 'Growth Fund', description: 'High growth potential', category: 'Equity', riskLevel: 'high' },
        { name: 'Balanced Fund', description: 'Balanced approach', category: 'Mixed', riskLevel: 'medium' },
        { name: 'Conservative Fund', description: 'Low risk investment', category: 'Bonds', riskLevel: 'low' },
      ];

      products.forEach(p => {
        db.run(
          'INSERT INTO products (name, description, category, riskLevel) VALUES (?, ?, ?, ?)',
          [p.name, p.description, p.category, p.riskLevel]
        );
      });

      console.log('Sample products created');
    }

    saveDatabase();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Helper function to run SQL and return results
function dbGet(sql, params = []) {
  try {
    const result = db.exec(sql, params);
    if (result && result[0] && result[0].values && result[0].values[0]) {
      const columns = result[0].columns;
      const values = result[0].values[0];
      const row = {};
      columns.forEach((col, idx) => {
        row[col] = values[idx];
      });
      return row;
    }
    return null;
  } catch (error) {
    console.error('DB Error:', error);
    return null;
  }
}

function dbAll(sql, params = []) {
  try {
    const result = db.exec(sql, params);
    if (result && result[0] && result[0].values) {
      const columns = result[0].columns;
      return result[0].values.map(values => {
        const row = {};
        columns.forEach((col, idx) => {
          row[col] = values[idx];
        });
        return row;
      });
    }
    return [];
  } catch (error) {
    console.error('DB Error:', error);
    return [];
  }
}

function dbRun(sql, params = []) {
  try {
    db.run(sql, params);
    saveDatabase();
    return { success: true };
  } catch (error) {
    console.error('DB Error:', error);
    return { success: false, error };
  }
}

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    dbRun(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, 'client']
    );

    const user = dbGet('SELECT id, email, name, role FROM users WHERE email = ?', [email]);
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = dbGet('SELECT * FROM users WHERE email = ?', [email]);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: userData, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = dbGet('SELECT id, email, name, role FROM users WHERE id = ?', [req.user.id]);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Client Routes
app.get('/api/client/dashboard', authenticateToken, (req, res) => {
  try {
    const client = dbGet('SELECT * FROM clients WHERE userId = ?', [req.user.id]);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const portfolios = dbAll('SELECT * FROM portfolios WHERE clientId = ?', [client.id]);
    const totalValue = portfolios.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0);

    res.json({
      portfolios,
      totalValue,
      portfolioCount: portfolios.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/client/portfolio', authenticateToken, (req, res) => {
  try {
    const client = dbGet('SELECT * FROM clients WHERE userId = ?', [req.user.id]);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const portfolios = dbAll(`
      SELECT p.*, prod.name as productName
      FROM portfolios p
      JOIN products prod ON p.productId = prod.id
      WHERE p.clientId = ?
    `, [client.id]);

    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/client/requests', authenticateToken, (req, res) => {
  try {
    const client = dbGet('SELECT * FROM clients WHERE userId = ?', [req.user.id]);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const requests = dbAll('SELECT * FROM requests WHERE clientId = ? ORDER BY createdAt DESC', [client.id]);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/client/requests', authenticateToken, (req, res) => {
  try {
    const { type, amount, description } = req.body;
    const client = dbGet('SELECT * FROM clients WHERE userId = ?', [req.user.id]);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    dbRun(
      'INSERT INTO requests (clientId, type, amount, description) VALUES (?, ?, ?, ?)',
      [client.id, type, amount, description]
    );

    const request = dbGet('SELECT * FROM requests WHERE clientId = ? ORDER BY id DESC LIMIT 1', [client.id]);
    
    // Create notification for admin
    const admins = dbAll('SELECT id FROM users WHERE role = ?', ['admin']);
    admins.forEach(admin => {
      dbRun(
        'INSERT INTO notifications (userId, type, title, message) VALUES (?, ?, ?, ?)',
        [admin.id, 'new_request', 'New Request Submitted', `Client ${client.id} submitted a ${type} request`]
      );
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/client/notifications', authenticateToken, (req, res) => {
  try {
    const notifications = dbAll('SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC', [req.user.id]);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Routes
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const clientCountResult = dbGet('SELECT COUNT(*) as count FROM clients');
    const totalValueResult = dbGet('SELECT SUM(quantity * purchasePrice) as total FROM portfolios');
    const pendingResult = dbGet('SELECT COUNT(*) as count FROM requests WHERE status = ?', ['pending']);

    res.json({
      clientCount: clientCountResult?.count || 0,
      totalValue: totalValueResult?.total || 0,
      pendingRequests: pendingResult?.count || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/clients', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const clients = dbAll(`
      SELECT c.*, u.email, u.name
      FROM clients c
      JOIN users u ON c.userId = u.id
      ORDER BY c.createdAt DESC
    `);

    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/requests', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const requests = dbAll(`
      SELECT r.*, c.id as clientId
      FROM requests r
      JOIN clients c ON r.clientId = c.id
      ORDER BY r.createdAt DESC
    `);

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/requests/:id/approve', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    dbRun('UPDATE requests SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', ['approved', id]);

    const request = dbGet('SELECT * FROM requests WHERE id = ?', [id]);
    
    // Notify client
    const client = dbGet('SELECT userId FROM clients WHERE id = ?', [request.clientId]);
    if (client) {
      dbRun(
        'INSERT INTO notifications (userId, type, title, message) VALUES (?, ?, ?, ?)',
        [client.userId, 'request_approved', 'Request Approved', 'Your request has been approved']
      );
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/requests/:id/reject', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    dbRun('UPDATE requests SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', ['rejected', id]);

    const request = dbGet('SELECT * FROM requests WHERE id = ?', [id]);
    
    // Notify client
    const client = dbGet('SELECT userId FROM clients WHERE id = ?', [request.clientId]);
    if (client) {
      dbRun(
        'INSERT INTO notifications (userId, type, title, message) VALUES (?, ?, ?, ?)',
        [client.userId, 'request_rejected', 'Request Rejected', 'Your request has been rejected']
      );
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/products', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const products = dbAll('SELECT * FROM products ORDER BY createdAt DESC');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/products', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name, description, category, riskLevel } = req.body;
    dbRun(
      'INSERT INTO products (name, description, category, riskLevel) VALUES (?, ?, ?, ?)',
      [name, description, category, riskLevel]
    );

    const product = dbGet('SELECT * FROM products WHERE name = ? ORDER BY id DESC LIMIT 1', [name]);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/notifications', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const notifications = dbAll('SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC', [req.user.id]);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});
