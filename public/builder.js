let fieldCounter = 0;

function addField() {
  fieldCounter++;
  const container = document.getElementById('fields');
  const row = document.createElement('div');
  row.className = 'field-row';
  row.dataset.id = fieldCounter;
  row.innerHTML = `
    <div class="field-header">
      <strong>Field ${fieldCounter}</strong>
      <button type="button" class="remove" onclick="this.closest('.field-row').remove(); refreshConditions();">✕</button>
    </div>
    <label>Label
      <input type="text" class="field-label" placeholder="e.g. Do you have pets?" oninput="refreshConditions()">
    </label>
    <label>Type
      <select class="field-type">
        <option value="text">Text</option>
        <option value="email">Email</option>
        <option value="number">Number</option>
        <option value="textarea">Long text</option>
      </select>
    </label>
    <label class="check">
      <input type="checkbox" onchange="this.closest('.field-row').querySelector('.condition-panel').style.display = this.checked ? 'block' : 'none'">
      Show only if a previous field equals a value
    </label>
    <div class="condition-panel" style="display:none;">
      Show if
      <select class="condition-field"></select>
      equals
      <input type="text" class="condition-value" placeholder="e.g. Yes">
    </div>
  `;
  container.appendChild(row);
  refreshConditions();
}

function refreshConditions() {
  const rows = Array.from(document.querySelectorAll('.field-row'));
  rows.forEach((row, idx) => {
    const select = row.querySelector('.condition-field');
    if (!select) return;
    select.innerHTML = '<option value="">-- select field --</option>';
    rows.slice(0, idx).forEach((prev, pIdx) => {
      const label = prev.querySelector('.field-label').value.trim() || `Field ${pIdx + 1}`;
      const opt = document.createElement('option');
      opt.value = pIdx;
      opt.textContent = label;
      select.appendChild(opt);
    });
  });
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'field';
}

async function createForm() {
  const title = document.getElementById('formTitle').value.trim();
  const description = document.getElementById('formDescription').value.trim();
  const rows = Array.from(document.querySelectorAll('.field-row'));

  if (!title) return alert('Please enter a form title.');
  if (rows.length === 0) return alert('Please add at least one field.');

  const fields = rows.map((row, idx) => {
    const label = row.querySelector('.field-label').value.trim();
    const type = row.querySelector('.field-type').value;
    const condPanelVisible = row.querySelector('.condition-panel').style.display === 'block';
    const condFieldIdx = row.querySelector('.condition-field').value;
    const condValue = row.querySelector('.condition-value').value.trim();

    let condition = null;
    if (condPanelVisible && condFieldIdx !== '' && condValue) {
      condition = { fieldIndex: parseInt(condFieldIdx), value: condValue };
    }

    return {
      name: slugify(label) + '_' + idx,
      label: label || `Field ${idx + 1}`,
      type,
      condition
    };
  });

  const res = await fetch('/api/forms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, fields })
  });

  const data = await res.json();
  if (!data.success) return alert(data.error || 'Failed to create form');

  const publicUrl = `${window.location.origin}/f/${data.id}`;
  const adminUrl = `${window.location.origin}/f/${data.id}/admin?key=${data.adminKey}`;

  document.getElementById('result').innerHTML = `
    <div class="success-box">
      <h3>✅ Form created!</h3>
      <p><strong>Public link:</strong> <a href="${publicUrl}" target="_blank">${publicUrl}</a></p>
      <p><strong>Admin link (keep private):</strong> <a href="${adminUrl}" target="_blank">${adminUrl}</a></p>
    </div>
  `;
}