import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './Auth.css';

const api = '/api';
const som = value => `${new Intl.NumberFormat('ru-RU').format(value)} сом`;

export default function App() {
  const [destinations, setDestinations] = useState([]);
  const [filter, setFilter] = useState('Все');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('catalog');
  const [token, setToken] = useState(localStorage.getItem('bookingkg-token') || '');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('bookingkg-user') || 'null'));
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('register');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ startDate: '', endDate: '', guests: 1, extras: [], promoCode: '' });

  useEffect(() => { fetch(`${api}/destinations`).then(r => r.json()).then(setDestinations).catch(() => setMessage('Не удалось загрузить каталог')); }, []);
  useEffect(() => { if (token) fetch(`${api}/favorites`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setFavorites).catch(() => {}); }, [token]);
  useEffect(() => { if (selected && form.startDate && form.endDate && new Date(form.endDate) > new Date(form.startDate)) fetch(`${api}/destinations/${selected.id}/availability?startDate=${form.startDate}&endDate=${form.endDate}`).then(r => r.json()).then(data => setAvailability(data.available)); else setAvailability(null); }, [selected, form.startDate, form.endDate]);
  const locations = ['Все', ...new Set(destinations.map(item => item.location))];
  const visible = destinations.filter(item => (filter === 'Все' || item.location === filter) && `${item.title} ${item.location} ${item.description}`.toLowerCase().includes(search.toLowerCase()));
  const nights = useMemo(() => form.startDate && form.endDate ? Math.max(0, Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000)) : 0, [form.startDate, form.endDate]);
  const extraPrices = { transfer: 1200, guide: 1800, meals: 900 };
  const subtotal = selected ? Number(selected.price) * Number(form.guests || 0) * nights + form.extras.reduce((sum, x) => sum + extraPrices[x] * Number(form.guests || 0), 0) : 0;
  const discount = form.promoCode.trim().toUpperCase() === 'NOMAD10' ? Math.round(subtotal * .1) : 0;
  const total = subtotal - discount;

  const loadBookings = async () => {
    if (!token) return;
    const response = await fetch(`${api}/bookings`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error);
    setBookings(data); setMessage('');
  };
  const openTrips = () => { if (!user) return setAuthOpen(true); setView('trips'); loadBookings(); };
  const authenticate = async event => {
    event.preventDefault();
    const response = await fetch(`${api}/auth/${authMode === 'register' ? 'register' : 'login'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(authForm) });
    const data = await response.json(); if (!response.ok) return setMessage(data.error);
    setToken(data.token); setUser(data.user); localStorage.setItem('bookingkg-token', data.token); localStorage.setItem('bookingkg-user', JSON.stringify(data.user)); setAuthOpen(false); setMessage(authMode === 'register' ? 'Аккаунт создан' : 'Вы вошли в аккаунт');
  };
  const logout = () => { setToken(''); setUser(null); setBookings([]); setView('catalog'); localStorage.removeItem('bookingkg-token'); localStorage.removeItem('bookingkg-user'); };
  const toggleFavorite = async (event, id) => { event.stopPropagation(); if (!token) return setAuthOpen(true); const saved = favorites.includes(id); await fetch(`${api}/favorites/${id}`, { method: saved ? 'DELETE' : 'POST', headers: { Authorization: `Bearer ${token}` } }); setFavorites(saved ? favorites.filter(x => x !== id) : [...favorites, id]); };
  const toggleExtra = value => setForm({ ...form, extras: form.extras.includes(value) ? form.extras.filter(x => x !== value) : [...form.extras, value] });
  const book = async event => {
    event.preventDefault();
    if (!token) { setSelected(null); setAuthOpen(true); return; }
    const response = await fetch(`${api}/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...form, destinationId: selected.id }) });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error);
    setSelected(null); setMessage(`Бронирование №${data.id} подтверждено`);
  };
  const cancel = async id => { await fetch(`${api}/bookings/${id}/cancel`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } }); await loadBookings(); };

  return <div className="app">
    <header className="topbar"><button className="logo" onClick={() => setView('catalog')}>Booking<span>KG</span></button><nav><button onClick={() => setView('catalog')} className={view === 'catalog' ? 'active' : ''}>Направления</button><button onClick={openTrips} className={view === 'trips' ? 'active' : ''}>Мои поездки</button>{user ? <><span className="user-name">{user.name}</span><button onClick={logout}>Выйти</button></> : <button className="login-button" onClick={() => setAuthOpen(true)}>Войти</button>}</nav></header>
    {view === 'catalog' ? <>
      <section className="hero"><div className="hero-layout"><div className="hero-copy"><div className="hero-badge"><span>✦</span> Откройте Кыргызстан по-новому</div><h1>Места, в которые<br/><em>хочется вернуться</em></h1><p>Горные озёра, древние маршруты и культура кочевников. Выберите своё путешествие — об остальном позаботимся мы.</p><div className="hero-actions"><a href="#catalog" className="primary">Найти путешествие <b>→</b></a><span><i>●</i> 12 маршрутов доступны сейчас</span></div></div><aside className="hero-note"><span className="note-icon">❝</span><p>Кыргызстан — это место, где дорога становится частью истории.</p><div><strong>4,9</strong><small>оценка путешественников</small></div></aside></div></section>
      <section className="quick-search"><div><small>КУДА ПОЕДЕМ?</small><select value={filter} onChange={e => setFilter(e.target.value)}>{locations.map(x => <option key={x}>{x}</option>)}</select></div><div><small>ЧТО ИЩЕМ?</small><input placeholder="Озеро, горы, город…" value={search} onChange={e => setSearch(e.target.value)}/></div><a href="#catalog">Показать варианты <span>→</span></a></section>
      <section className="advantages"><div><strong>12</strong><span>уникальных направлений</span></div><div><strong>4,8</strong><span>средняя оценка гостей</span></div><div><strong>24/7</strong><span>доступ к бронированию</span></div><div><strong>100%</strong><span>прозрачный расчёт цены</span></div></section>
      <main id="catalog"><div className="heading"><div><p className="eyebrow">ПОПУЛЯРНЫЕ НАПРАВЛЕНИЯ</p><h2>Куда отправимся?</h2></div><label className="search"><span>⌕</span><input placeholder="Найти место или область" value={search} onChange={e => setSearch(e.target.value)}/></label></div><div className="filters">{locations.map(x => <button key={x} className={filter === x ? 'active' : ''} onClick={() => setFilter(x)}>{x}</button>)}</div>
        <div className="catalog-count">Найдено направлений: <strong>{visible.length}</strong></div><div className="cards">{visible.map((item,index) => <article className="card" key={item.id}><div className="photo" style={{ backgroundImage: `url(${item.image})` }}><span>★ {item.rating}</span><button className={`favorite ${favorites.includes(item.id) ? 'saved' : ''}`} onClick={e => toggleFavorite(e,item.id)} aria-label="Добавить в избранное">{favorites.includes(item.id) ? '♥' : '♡'}</button>{index < 3 && <b className="popular">Популярное</b>}<i>{item.location}</i></div><div className="card-body"><h3>{item.title}</h3><p>{item.description}</p><footer><div><b>{som(item.price)}</b><small>за гостя / ночь</small></div><button onClick={() => { setSelected(item); setMessage(''); }}>Подробнее <span>→</span></button></footer></div></article>)}</div>
        <section className="story"><div className="story-image"><span>Сделано в Кыргызстане</span></div><div className="story-copy"><p className="eyebrow">ПОЧЕМУ BOOKINGKG</p><h2>Не просто поездка.<br/>Ваша новая история.</h2><p>Мы собрали направления, в которых природа, культура и гостеприимство Кыргызстана раскрываются по-настоящему.</p><ul><li><b>✓</b><span><strong>Понятная стоимость</strong><small>Итоговая цена известна до бронирования</small></span></li><li><b>✓</b><span><strong>Личный кабинет</strong><small>Все поездки и статусы всегда под рукой</small></span></li><li><b>✓</b><span><strong>Безопасная отмена</strong><small>Управляйте планами самостоятельно</small></span></li></ul><a href="#catalog" className="dark-link">Начать путешествие →</a></div></section>
      </main>
    </> : <main className="trips"><p className="eyebrow">ЛИЧНЫЙ КАБИНЕТ</p><h1>Мои поездки</h1><p className="welcome">Путешественник: <strong>{user?.name}</strong></p>{bookings.length ? <div className="booking-list">{bookings.map(b => <article className="booking" key={b.id}><img src={b.image} alt=""/><div><small>Бронирование №{b.id}</small><h3>{b.title}</h3><p>{new Date(b.start_date).toLocaleDateString('ru-RU')} — {new Date(b.end_date).toLocaleDateString('ru-RU')} · {b.guests} гост.</p><strong>{som(b.total_price)}</strong>{b.extras && <small className="booking-extras">Услуги: {b.extras}</small>}</div><div><span className={`status ${b.status}`}>{b.status === 'confirmed' ? 'Подтверждено' : 'Отменено'}</span>{b.status === 'confirmed' && <button className="voucher" onClick={() => window.print()}>Ваучер</button>}{b.status === 'confirmed' && <button className="cancel" onClick={() => cancel(b.id)}>Отменить</button>}</div></article>)}</div> : <div className="empty">У вас пока нет бронирований</div>}</main>}
    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><form className="modal tour-modal" onSubmit={book} onClick={e => e.stopPropagation()}><button type="button" className="close" onClick={() => setSelected(null)}>×</button><div className="modal-cover" style={{backgroundImage:`url(${selected.image})`}}><span>★ {selected.rating}</span></div><p className="eyebrow">{selected.location}</p><h2>{selected.title}</h2><p className="tour-description">{selected.description}</p><div className="tour-program"><strong>Программа</strong><span>День 1 · Встреча и знакомство с маршрутом</span><span>День 2 · Основная экскурсия и свободное время</span><span>День 3 · Завтрак и возвращение</span></div>{user && <p className="booking-for">Бронирование для: <strong>{user.name}</strong></p>}<div className="form-row"><label>Заезд<input type="date" required value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}/></label><label>Выезд<input type="date" required value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}/></label></div>{availability !== null && <div className={`availability ${availability < Number(form.guests) ? 'low' : ''}`}>{availability > 0 ? `Свободно мест: ${availability}` : 'На эти даты мест нет'}</div>}<label>Гостей<input type="number" min="1" max="10" required value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}/></label><div className="extras"><strong>Дополнительные услуги</strong><label><input type="checkbox" checked={form.extras.includes('transfer')} onChange={() => toggleExtra('transfer')}/><span>Трансфер</span><b>+1 200 сом</b></label><label><input type="checkbox" checked={form.extras.includes('guide')} onChange={() => toggleExtra('guide')}/><span>Персональный гид</span><b>+1 800 сом</b></label><label><input type="checkbox" checked={form.extras.includes('meals')} onChange={() => toggleExtra('meals')}/><span>Питание</span><b>+900 сом</b></label></div><label>Промокод<input placeholder="Например, NOMAD10" value={form.promoCode} onChange={e => setForm({ ...form, promoCode: e.target.value })}/></label><div className="total"><span>{nights} ноч. · {form.guests} гост.{discount > 0 && <small>Скидка: −{som(discount)}</small>}</span><strong>{som(total)}</strong></div><button className="submit" disabled={availability !== null && availability < Number(form.guests)}>{user ? 'Подтвердить бронирование' : 'Войти и забронировать'}</button></form></div>}
    {authOpen && <div className="modal-backdrop" onClick={() => setAuthOpen(false)}><form className="modal auth-modal" onSubmit={authenticate} onClick={e => e.stopPropagation()}><button type="button" className="close" onClick={() => setAuthOpen(false)}>×</button><p className="eyebrow">{authMode === 'register' ? 'НОВЫЙ АККАУНТ' : 'ЛИЧНЫЙ КАБИНЕТ'}</p><h2>{authMode === 'register' ? 'Регистрация' : 'Вход'}</h2>{authMode === 'register' && <label>Имя<input required minLength="2" value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })}/></label>}<label>Email<input type="email" required value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })}/></label><label>Пароль<input type="password" required minLength="6" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })}/></label><button className="submit">{authMode === 'register' ? 'Зарегистрироваться' : 'Войти'}</button><button type="button" className="auth-switch" onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}>{authMode === 'register' ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}</button></form></div>}
    {message && <div className="toast" onClick={() => setMessage('')}>{message}</div>}
    <footer className="site-footer"><b>BookingKG</b><span>Учебный проект · Реальные платежи не выполняются</span></footer>
  </div>;
}
