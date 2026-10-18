import { Link } from 'react-router-dom';
import StatusPill, { STATUSES } from '../../shared/ui/StatusPill';
import { formatDate, getUrgency } from './deadline';

export default function LabRow({ lab, onStatusChange, onRemove }) {
  const finished = lab.status === 'defended';
  const urgency = finished ? null : getUrgency(lab.deadline);

  return (
    <tr data-cy="lab-row">
      <td className="strong">{lab.subject}</td>
      <td>
        Лаб. №{lab.number} «{lab.title}»
      </td>
      <td>
        <div className="strong">{formatDate(lab.deadline)}</div>
        {urgency && (
          <span className={`pill urgency-${urgency.level}`}>{urgency.label}</span>
        )}
      </td>
      <td>
        <StatusPill status={lab.status} />
        <select
          aria-label="Змінити статус"
          data-cy="status-select"
          value={lab.status}
          onChange={(e) => onStatusChange(lab.id, e.target.value)}
        >
          {Object.entries(STATUSES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </td>
      <td className="actions">
        <Link to={`/labs/${lab.id}/edit`} data-cy="edit-lab">
          Змінити
        </Link>
        <button
          className="link-btn"
          data-cy="remove-lab"
          onClick={() => onRemove(lab.id)}
        >
          Видалити
        </button>
      </td>
    </tr>
  );
}
