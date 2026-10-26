import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LabRow from '../features/labs/LabRow';
import { useLabs } from '../features/labs/LabsContext';
import { daysLeft } from '../features/labs/deadline';
import { STATUSES } from '../shared/ui/StatusPill';

export default function LabsPage() {
  const { labs, updateLab, removeLab } = useLabs();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(
    () =>
      labs
        .filter((l) => filter === 'all' || l.status === filter)
        .filter((l) =>
          `${l.subject} ${l.title}`.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) => daysLeft(a.deadline) - daysLeft(b.deadline)),
    [labs, filter, query],
  );

  const defended = labs.filter((l) => l.status === 'defended').length;
  const percent = labs.length ? Math.round((defended / labs.length) * 100) : 0;

  return (
    <>
      <div className="page-head">
        <h1>Мої лабораторні</h1>
        <Link className="btn primary" to="/labs/new" data-cy="add-lab">
          + Додати лабораторну
        </Link>
      </div>

      <section className="card pad">
        <div className="progress-head">
          <b>Прогрес семестру</b>
          <span className="muted" data-cy="progress-text">
            {defended} з {labs.length} захищено · {percent}%
          </span>
        </div>
        <div className="bar">
          <div style={{ width: `${percent}%` }} />
        </div>
      </section>

      <div className="filters">
        <input
          placeholder="Пошук за назвою…"
          aria-label="Пошук"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className={filter === 'all' ? 'chip on' : 'chip'}
          onClick={() => setFilter('all')}
        >
          Усі
        </button>
        {Object.entries(STATUSES).map(([value, label]) => (
          <button
            key={value}
            className={filter === value ? 'chip on' : 'chip'}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="card pad" data-cy="empty">
          Лабораторних не знайдено.
        </p>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Предмет</th>
                <th>Лабораторна</th>
                <th>Дедлайн</th>
                <th>Статус</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map((lab) => (
                <LabRow
                  key={lab.id}
                  lab={lab}
                  onStatusChange={(id, status) => updateLab(id, { status })}
                  onRemove={removeLab}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
