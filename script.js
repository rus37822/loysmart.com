const books = [
  { id: 1, name: 'Atomic Habits', author: 'James Clear', category: 'Segera', due: 'Besok, 14.00', days: '1 hari lagi', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=700&q=85', badge: 'Besok' },
  { id: 2, name: 'Laskar Pelangi', author: 'Andrea Hirata', category: 'Segera', due: '18 September 2026', days: '2 hari lagi', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=85', badge: 'Segera' },
  { id: 3, name: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', category: 'Aman', due: '25 September 2026', days: '9 hari lagi', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=85' },
  { id: 4, name: 'The Little Prince', author: 'Antoine de Saint-Exupery', category: 'Aman', due: '30 September 2026', days: '14 hari lagi', image: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&w=700&q=85' },
  { id: 5, name: 'Fisika Dasar', author: 'Halliday & Resnick', category: 'Aman', due: '4 Oktober 2026', days: '18 hari lagi', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=700&q=85' },
  { id: 6, name: 'Negeri 5 Menara', author: 'Ahmad Fuadi', category: 'Terlambat', due: 'Kemarin', days: '1 hari terlambat', image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=85', badge: 'Terlambat' }
];

const state = { category: 'Semua', query: '', reminders: [] };
const grid = document.getElementById('product-grid');
const productTotal = document.getElementById('product-total');
const emptyState = document.getElementById('empty-state');
const reminderDrawer = document.getElementById('cart-drawer');
const overlay = document.getElementById('overlay');
const toast = document.getElementById('toast');

function renderBooks() {
  const visibleBooks = books.filter((book) => {
    const matchesCategory = state.category === 'Semua' || book.category === state.category;
    const matchesQuery = `${book.name} ${book.author}`.toLowerCase().includes(state.query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  productTotal.textContent = `${visibleBooks.length} buku`;
  emptyState.hidden = visibleBooks.length !== 0;
  grid.innerHTML = visibleBooks.map((book, index) => `
    <article class="product-card" style="animation-delay:${index * 45}ms">
      <div class="product-image">
        <img src="${book.image}" alt="Sampul ${book.name}" loading="lazy">
        <span class="badge ${book.category === 'Terlambat' ? 'late-badge' : ''}">${book.badge || book.category}</span>
        <button class="quick-add" data-add="${book.id}" aria-label="Ingatkan pengembalian ${book.name}" title="Tambah pengingat"><i data-lucide="bell-plus"></i></button>
      </div>
      <div class="product-meta"><div><div class="product-name">${book.name}</div><div class="product-category">${book.author}</div></div><div class="product-price due-date">${book.due}</div></div>
      <div class="book-status ${book.category === 'Terlambat' ? 'late-text' : ''}"><i data-lucide="${book.category === 'Terlambat' ? 'triangle-alert' : 'calendar-clock'}"></i>${book.days}</div>
    </article>`).join('');
  lucide.createIcons();
}

function renderReminders() {
  const items = state.reminders.map((id) => books.find((book) => book.id === id));
  const reminderItems = document.getElementById('cart-items');
  document.querySelector('.cart-count').textContent = items.length;
  if (!items.length) {
    reminderItems.innerHTML = '<div class="cart-empty"><i data-lucide="bell"></i><p>Belum ada pengingat.</p><span>Tambahkan buku dari daftar kamu.</span></div>';
  } else {
    reminderItems.innerHTML = items.map((book) => `<div class="cart-item"><img src="${book.image}" alt="${book.name}"><div><p class="cart-item-name">${book.name}</p><span class="cart-item-price">Kembali ${book.due}</span><br><button class="remove-item" data-remove="${book.id}">Hapus pengingat</button></div><strong class="cart-item-price">${book.category === 'Terlambat' ? '!' : '✓'}</strong></div>`).join('');
  }
  document.getElementById('subtotal').textContent = `${items.length} buku`;
  lucide.createIcons();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function setReminderOpen(isOpen) {
  reminderDrawer.classList.toggle('open', isOpen);
  overlay.classList.toggle('visible', isOpen);
  reminderDrawer.setAttribute('aria-hidden', String(!isOpen));
}

document.getElementById('category-list').addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  state.category = button.dataset.category;
  document.querySelectorAll('.category').forEach((item) => item.classList.toggle('active', item === button));
  renderBooks();
});

grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const book = books.find((item) => item.id === Number(button.dataset.add));
  if (!state.reminders.includes(book.id)) {
    state.reminders.push(book.id);
    renderReminders();
    showToast(`Pengingat ${book.name} ditambahkan`);
  } else {
    showToast(`Pengingat ${book.name} sudah aktif`);
  }
});

document.getElementById('cart-items').addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove]');
  if (!button) return;
  state.reminders = state.reminders.filter((id) => id !== Number(button.dataset.remove));
  renderReminders();
});

document.getElementById('cart-toggle').addEventListener('click', () => setReminderOpen(true));
document.getElementById('cart-close').addEventListener('click', () => setReminderOpen(false));
overlay.addEventListener('click', () => setReminderOpen(false));
document.getElementById('checkout-button').addEventListener('click', () => {
  if (!state.reminders.length) return showToast('Belum ada pengingat aktif');
  state.reminders = [];
  renderReminders();
  showToast('Semua pengingat sudah ditandai selesai');
});

document.getElementById('search-toggle').addEventListener('click', () => {
  const bar = document.getElementById('search-bar');
  bar.classList.toggle('open');
  if (bar.classList.contains('open')) document.getElementById('search-input').focus();
});
document.getElementById('search-close').addEventListener('click', () => document.getElementById('search-bar').classList.remove('open'));
document.getElementById('search-input').addEventListener('input', (event) => { state.query = event.target.value; renderBooks(); });
document.getElementById('menu-toggle').addEventListener('click', () => showToast('Gunakan menu Buku saya untuk melihat pinjaman'));
document.getElementById('newsletter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('email').value.trim();
  event.target.reset();
  showToast(`Pengingat untuk “${title}” siap ditambahkan`);
});

renderBooks();
renderReminders();
lucide.createIcons();
