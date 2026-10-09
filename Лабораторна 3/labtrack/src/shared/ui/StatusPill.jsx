export const STATUSES = {
  todo: 'Не розпочато',
  work: 'В роботі',
  done: 'Здано',
  defended: 'Захищено',
};

export default function StatusPill({ status }) {
  return (
    <span className={`pill status-${status}`} data-cy="status-pill">
      {STATUSES[status]}
    </span>
  );
}
