let records = [];

window.onload = function() {
    const saved = localStorage.getItem('financas_db');
    if (saved) records = JSON.parse(saved);
    renderNotebook();
};

function renderNotebook() {
    const notebook = document.getElementById('notebook');
    notebook.innerHTML = '';

    if (records.length === 0) {
        notebook.innerHTML = `<div class="page"><div class="spiral"></div><div class="empty-state">Caderno Novo.<br>Toque no +</div></div>`;
        return;
    }

    records.forEach((rec, index) => {
        const total = (parseFloat(rec.salary)||0) + (parseFloat(rec.advance)||0) + (parseFloat(rec.food)||0);
        
        const div = document.createElement('div');
        div.className = 'page';
        div.innerHTML = `
            <div class="spiral"></div>
            <h2>${rec.month}</h2>
            <div class="data-row"><span>Salário</span><span>${format(rec.salary)}</span></div>
            <div class="data-row"><span>Vale</span><span>${format(rec.advance)}</span></div>
            <div class="data-row"><span>Refeição</span><span>${format(rec.food)}</span></div>
            <br>
            <div class="data-row" style="color: #d33682"><span>TOTAL</span><span>${format(total)}</span></div>
            ${rec.photo ? `<div class="photo-area" style="background-image: url('${rec.photo}')"></div>` : ''}
            <div class="actions">
                <button class="icon-btn" onclick="edit(${index})">✏️</button>
                <button class="icon-btn" onclick="del(${index})">🗑️</button>
            </div>
        `;
        notebook.appendChild(div);
    });
}

function format(v) { return parseFloat(v||0).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}); }

function openModal(index = null) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('editIndex').value = index !== null ? index : '';
    if (index !== null) {
        const r = records[index];
        document.getElementById('inputMonth').value = r.month;
        document.getElementById('inputSalary').value = r.salary;
        document.getElementById('inputAdvance').value = r.advance;
        document.getElementById('inputFood').value = r.food;
    } else {
        document.querySelectorAll('input:not([type=hidden])').forEach(i => i.value = '');
    }
}

function closeModal() { document.getElementById('modal').style.display = 'none'; }

function saveData() {
    const idx = document.getElementById('editIndex').value;
    const file = document.getElementById('inputPhoto').files[0];
    
    const data = {
        month: document.getElementById('inputMonth').value,
        salary: document.getElementById('inputSalary').value,
        advance: document.getElementById('inputAdvance').value,
        food: document.getElementById('inputFood').value,
        photo: idx !== '' ? records[idx].photo : null
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            data.photo = e.target.result;
            finishSave(data, idx);
        };
        reader.readAsDataURL(file);
    } else {
        finishSave(data, idx);
    }
}

function finishSave(data, idx) {
    if (idx !== '') records[idx] = data;
    else records.push(data);
    
    localStorage.setItem('financas_db', JSON.stringify(records));
    renderNotebook();
    closeModal();
}

function del(idx) {
    if(confirm('Arrancar folha?')) {
        records.splice(idx, 1);
        localStorage.setItem('financas_db', JSON.stringify(records));
        renderNotebook();
    }
}

function edit(idx) { openModal(idx); }
