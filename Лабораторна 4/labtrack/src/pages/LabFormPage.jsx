import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLabs } from '../features/labs/LabsContext';
import { STATUSES } from '../shared/ui/StatusPill';

const EMPTY = {
  subject: '',
  number: '',
  title: '',
  deadline: '',
  status: 'todo',
  note: '',
};

export default function LabFormPage() {
  const { id } = useParams();
  const { labs, addLab, updateLab } = useLabs();
  const navigate = useNavigate();
  const editing = labs.find((l) => l.id === id);
  const [form, setForm] = useState(editing ?? EMPTY);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  function handleSubmit(e) {
    e.preventDefault();
    if (editing) updateLab(editing.id, form);
    else addLab(form);
    navigate('/labs');
  }

  return (
    <>
      <h1>{editing ? 'Редагувати лабораторну' : 'Додати лабораторну'}</h1>
      <form className="card pad form" onSubmit={handleSubmit} data-cy="lab-form">
        <label>
          Предмет
          <input
            data-cy="subject"
            required
            value={form.subject}
            onChange={update('subject')}
          />
        </label>
        <div className="two">
          <label>
            Номер
            <input
              data-cy="number"
              type="number"
              min="1"
              required
              value={form.number}
              onChange={update('number')}
            />
          </label>
          <label>
            Дедлайн
            <input
              data-cy="deadline"
              type="date"
              required
              value={form.deadline}
              onChange={update('deadline')}
            />
          </label>
        </div>
        <label>
          Назва роботи
          <input data-cy="title" required value={form.title} onChange={update('title')} />
        </label>
        <label>
          Статус
          <select data-cy="status" value={form.status} onChange={update('status')}>
            {Object.entries(STATUSES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <div className="buttons">
          <button className="btn primary" data-cy="save" type="submit">
            Зберегти
          </button>
          <button className="btn ghost" type="button" onClick={() => navigate('/labs')}>
            Скасувати
          </button>
        </div>
      </form>
    </>
  );
}
