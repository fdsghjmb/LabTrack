import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { useLabs } from '../features/labs/LabsContext';
import { daysLeft, formatDate, getUrgency } from '../features/labs/deadline';
import StatusPill from '../shared/ui/StatusPill';

export default function HomePage() {
  const { user } = useAuth();
  const { labs } = useLabs();
  const upcoming = labs
    .filter((l) => l.status !== 'defended')
    .sort((a, b) => daysLeft(a.deadline) - daysLeft(b.deadline))
    .slice(0, 3);

  return (
    <>
      <h1>Вітаємо, {user.name}!</h1>
      <p className="muted">Найближчі дедлайни зібрані тут.</p>
      <section className="card pad">
        {upcoming.length === 0 && (
          <p data-cy="empty">Активних лабораторних поки немає.</p>
        )}
        {upcoming.map((lab) => (
          <div className="row" key={lab.id}>
            <div>
              <div className="strong">
                Лаб. №{lab.number} «{lab.title}»
              </div>
              <div className="muted">
                {lab.subject} · {formatDate(lab.deadline)}
              </div>
            </div>
            <div className="row-right">
              <span className={`pill urgency-${getUrgency(lab.deadline).level}`}>
                {getUrgency(lab.deadline).label}
              </span>
              <StatusPill status={lab.status} />
            </div>
          </div>
        ))}
      </section>
      <Link className="btn primary" to="/labs/new">
        + Додати лабораторну
      </Link>
    </>
  );
}
