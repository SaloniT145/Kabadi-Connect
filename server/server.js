import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const prices = [
  { category: 'PCB', rate: 420, unit: 'kg', trend: '+8%' },
  { category: 'Copper Cable', rate: 680, unit: 'kg', trend: '+4%' },
  { category: 'Battery', rate: 95, unit: 'kg', trend: '-2%' },
  { category: 'LCD', rate: 120, unit: 'unit', trend: '+12%' }
];

const recyclers = [
  { name: 'GreenLoop Recycling', area: 'Andheri East', distance: '3.2 km', materials: 'PCB, LCD, Cable', verified: true },
  { name: 'EcoCircuit Works', area: 'Bhandup West', distance: '6.8 km', materials: 'Battery, Motor', verified: true },
  { name: 'Narmada Recyclers', area: 'Vasai Road', distance: '12.4 km', materials: 'Mixed Plastic, CRT', verified: true }
];

let transactions = [
  { id: 'KC-1048', material: 'PCB', weight: 12.4, amount: 5208, recycler: 'GreenLoop Recycling', date: 'Today, 09:42' },
  { id: 'KC-1047', material: 'Copper Cable', weight: 8.1, amount: 5508, recycler: 'EcoCircuit Works', date: 'Yesterday, 16:18' },
  { id: 'KC-1046', material: 'Battery', weight: 21, amount: 1995, recycler: 'EcoCircuit Works', date: 'Yesterday, 11:03' }
];

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'kabadi-connect-api' }));
app.get('/api/prices', (_req, res) => res.json(prices));
app.get('/api/recyclers', (_req, res) => res.json(recyclers));
app.get('/api/transactions', (_req, res) => res.json(transactions));
app.get('/api/stats', (_req, res) => res.json({
  totalEarnings: 12840,
  itemsRecycled: 42,
  activeCollectors: 128,
  verifiedRecyclers: recyclers.length,
  monthlyChange: 18
}));

app.post('/api/classify', (req, res) => {
  const categories = ['PCB', 'Battery', 'Cable', 'CRT', 'LCD', 'Motor/Magnet Assembly', 'Mixed Plastic', 'Other'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const suggestedPrice = prices.find((item) => item.category === category)?.rate || 60;
  res.json({ category, confidence: 0.84, suggestedPrice, note: 'Mock classification for MVP. Replace with a model service later.' });
});

app.post('/api/transactions', (req, res) => {
  const { material, weight, recycler } = req.body;
  if (!material || !weight || !recycler) return res.status(400).json({ message: 'Material, weight and recycler are required.' });
  const price = prices.find((item) => item.category === material)?.rate || 60;
  const transaction = {
    id: `KC-${1049 + transactions.length}`,
    material,
    weight: Number(weight),
    amount: Math.round(Number(weight) * price),
    recycler,
    date: 'Just now'
  };
  transactions = [transaction, ...transactions];
  res.status(201).json(transaction);
});

app.listen(port, () => console.log(`Kabadi Connect API running on http://localhost:${port}`));
