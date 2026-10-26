import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STATUSES } from '../../shared/ui/StatusPill';
import { useCreateLab, useUpdateLab } from './useLabs';

const EMPTY = {
  subject: '',
  number: '',
  title: '',
  deadline: '',
  status: 'todo',
  note: '',
};

export default function LabForm({ lab }) {
  const navigate = useNavigate();
  const create = useCreateLab();
  const update = useUpdateLab();
  const [form, setForm] = useState(lab ?? EMPTY);
  const [error, setError] = useState('');

  const mutation = lab ? update : create;
  const field = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  function handleSubmit(e) {
    e.preventDefault();
    const payload = lab ? { ...form, id: lab.id } : form;
    mutation.mutate(payload, {
      onSuccess: () => navigate('/labs'),
      onError: (err) => setError(err.message),
    });
  }

  return (
    <form className="card pad form" onSubmit={handleSubmit} data-cy="lab-form">
      <label>
        Предмет
        <input
          data-cy="subject"
          required
          value={form.subject}
          onChange={field('subject')}
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
            onChange={field('number')}
          />
        </label>
        <label>
          Дедлайн
          <input
            data-cy="deadline"
            type="date"
            required
            value={form.deadline}
            onChange={field('deadline')}
          />
        </label>
      </div>
      <label>
        Назва роботи
        <input data-cy="title" required value={form.title} onChange={field('title')} />
      </label>
      <label>
        Статус
        <select data-cy="status" value={form.status} onChange={field('status')}>
          {Object.entries(STATUSES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {error && (
        <p className="error" data-cy="form-error">
          {error}
        </p>
      )}
      <div className="buttons">
        <button
          className="btn primary"
          data-cy="save"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Збереження…' : 'Зберегти'}
        </button>
        <button className="btn ghost" type="button" onClick={() => navigate('/labs')}>
          Скасувати
        </button>
      </div>
    </form>
  );
}
