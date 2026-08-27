import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Authentication endpoint
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Enterprise JWT token generation simulation
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiWFlaIiwicm9sZSI6IkFkbWluIn0.signature';
  return res.json({
    message: 'Login successful',
    token,
    user: {
      name: 'XYZ',
      email: email || 'xyz10@gmail.com',
      role: 'Admin',
      office: 'Chennai'
    }
  });
});

// Opportunities endpoints
router.get('/opportunities', (req, res) => {
  const { source, sector, location, status } = req.query;
  let items = db.getOpportunities();

  if (source) items = items.filter(i => i.source === source);
  if (sector) items = items.filter(i => i.sector === sector);
  if (location) items = items.filter(i => i.location === location);
  if (status) items = items.filter(i => i.status === status);

  res.json({ success: true, count: items.length, data: items });
});

router.get('/opportunities/:id', (req, res) => {
  const opp = db.getOpportunityById(req.params.id);
  if (!opp) return res.status(404).json({ error: 'Opportunity not found' });
  res.json({ success: true, data: opp });
});

router.post('/opportunities/:id/pursue', (req, res) => {
  const { owner, priority } = req.body;
  const opp = db.updateOpportunityStatus(req.params.id, 'Pursued');

  db.addAuditLog({
    user: owner || 'Ravi Kumar',
    action: 'Pursued Opportunity',
    details: `${opp ? opp.name : req.params.id} (${priority || 'High'})`
  });

  res.json({ success: true, message: 'Opportunity marked as PURSUED!', data: opp });
});

router.post('/opportunities/:id/decline', (req, res) => {
  const { reason } = req.body;
  const opp = db.updateOpportunityStatus(req.params.id, 'Declined');

  db.addAuditLog({
    user: 'Ravi Kumar',
    action: 'Declined Opportunity',
    details: `${opp ? opp.name : req.params.id} (${reason || 'Budget Constraints'})`
  });

  res.json({ success: true, message: 'Opportunity marked as DECLINED.', data: opp });
});

// Alerts endpoint
router.get('/alerts', (req, res) => {
  res.json({ success: true, data: db.getAlerts() });
});

// Calendar endpoint
router.get('/calendar', (req, res) => {
  res.json({ success: true, data: db.getCalendarEvents() });
});

// Consortium recommendations endpoint
router.get('/consortium', (req, res) => {
  res.json({ success: true, data: db.getConsortium() });
});

// Reports & analytics endpoint
router.get('/reports', (req, res) => {
  res.json({
    success: true,
    data: {
      totalOpportunities: 150,
      highPriority: 14,
      avgAiScore: 8.4,
      pursued: 35,
      declined: 12,
      scoreDistribution: [
        { range: '9-10', percentage: 40, color: '#10B981' },
        { range: '7-8', percentage: 28, color: '#0284C7' },
        { range: '5-6', percentage: 18, color: '#F59E0B' },
        { range: '1-4', percentage: 14, color: '#CBD5E1' }
      ]
    }
  });
});

// Sources endpoint
router.get('/sources', (req, res) => {
  res.json({ success: true, data: db.getSources() });
});

// Offices endpoint
router.get('/offices', (req, res) => {
  res.json({ success: true, data: db.getOffices() });
});

// Users & Roles endpoints
router.get('/users', (req, res) => {
  res.json({ success: true, data: db.getUsers() });
});

router.post('/users', (req, res) => {
  const newUser = db.addUser(req.body);
  res.json({ success: true, message: 'User added successfully', data: newUser });
});

// Audit Trail endpoints
router.get('/audit', (req, res) => {
  res.json({ success: true, data: db.getAuditTrail() });
});

// Settings endpoints
router.get('/settings', (req, res) => {
  res.json({ success: true, data: db.getSettings() });
});

router.post('/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, message: 'Settings saved successfully', data: updated });
});

// AI Opportunity Scoring & Ingestion Triggers
router.post('/ai/score', (req, res) => {
  const calculatedScore = (7.5 + Math.random() * 2.3).toFixed(1);
  res.json({
    success: true,
    score: parseFloat(calculatedScore),
    matchLevel: calculatedScore >= 8.5 ? 'Strong Match' : 'High Match'
  });
});

router.post('/ingestion/trigger', (req, res) => {
  res.json({
    success: true,
    message: 'Tender scraper batch ingestion initiated successfully across Monitored Sources.',
    timestamp: new Date().toISOString()
  });
});

export default router;
