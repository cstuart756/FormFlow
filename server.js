const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const FORMS_FILE = path.join(DATA_DIR, 'forms.json');
const RESPONSES_FILE = path.join(DATA_DIR, 'responses.json');

// Ensure data store exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(FORMS_FILE)) fs.writeFileSync(FORMS_FILE, '{}');
if (!fs.existsSync(RESPONSES_FILE)) fs.writeFileSync(RESPONSES_FILE, '{}');

const readJSON = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const writeJSON = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Home / Builder
app.get('/', (req, res) => res.render('index'));

// Create a new form
app.post('/api/forms', (req, res) => {
  const { title, description, fields } = req.body;
  if (!title || !Array.isArray(fields) || fields.length === 0) {
    return res.status(400).json({ error: 'Title and at least one field are required.' });
  }
  const id = crypto.randomBytes(4).toString('hex');
  const adminKey = crypto.randomBytes(16).toString('hex');
  const forms = readJSON(FORMS_FILE);
  forms[id] = {
    id,
    title,
    description: description || '',
    fields,
    adminKey,
    createdAt: new Date().toISOString()
  };
  writeJSON(FORMS_FILE, forms);
  res.json({ success: true, id, adminKey });
});

// Public form
app.get('/f/:id', (req, res) => {
  const forms = readJSON(FORMS_FILE);
  const form = forms[req.params.id];
  if (!form) return res.status(404).send('Form not found');
  res.render('form', { form });
});

// Submit a response
app.post('/f/:id', (req, res) => {
  const forms = readJSON(FORMS_FILE);
  const form = forms[req.params.id];
  if (!form) return res.status(404).send('Form not found');
  const responses = readJSON(RESPONSES_FILE);
  if (!responses[req.params.id]) responses[req.params.id] = [];
  responses[req.params.id].push({
    submittedAt: new Date().toISOString(),
    answers: req.body
  });
  writeJSON(RESPONSES_FILE, responses);
  res.render('success', { form });
});

// Admin: view responses
app.get('/f/:id/admin', (req, res) => {
  const forms = readJSON(FORMS_FILE);
  const form = forms[req.params.id];
  if (!form) return res.status(404).send('Form not found');
  if (req.query.key !== form.adminKey) return res.status(403).send('Invalid admin key');
  const responses = readJSON(RESPONSES_FILE)[req.params.id] || [];
  res.render('responses', { form, responses });
});

app.listen(PORT, () => console.log(`FormFlow running on http://localhost:${PORT}`));