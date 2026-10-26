import { useParams } from 'react-router-dom';
import LabForm from '../features/labs/LabForm';
import { useLabs } from '../features/labs/useLabs';

export default function LabFormPage() {
  const { id } = useParams();
  const { data: labs = [], isLoading } = useLabs();
  const lab = id ? labs.find((l) => l.id === id) : null;

  if (id && isLoading) return <p className="state">Завантаження…</p>;
  if (id && !lab) {
    return (
      <p className="card pad" data-cy="not-found">
        Лабораторну не знайдено.
      </p>
    );
  }

  return (
    <>
      <h1>{lab ? 'Редагувати лабораторну' : 'Додати лабораторну'}</h1>
      {/* key змушує форму ініціалізуватися заново для іншої лабораторної */}
      <LabForm key={id ?? 'new'} lab={lab} />
    </>
  );
}
