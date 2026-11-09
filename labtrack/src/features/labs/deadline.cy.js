import { daysLeft, getUrgency, formatDate } from './deadline';

const today = new Date(2026, 8, 20); // 20.09.2026

describe('deadline', () => {
  it('рахує різницю в днях', () => {
    expect(daysLeft('2026-09-20', today)).to.equal(0);
    expect(daysLeft('2026-09-27', today)).to.equal(7);
    expect(daysLeft('2026-09-15', today)).to.equal(-5);
  });

  it('визначає рівень терміновості', () => {
    expect(getUrgency('2026-09-15', today).level).to.equal('overdue');
    expect(getUrgency('2026-09-20', today).level).to.equal('today');
    expect(getUrgency('2026-09-23', today).level).to.equal('soon');
    expect(getUrgency('2026-09-24', today).level).to.equal('ok');
  });

  it('форматує дату як ДД.ММ.РРРР', () => {
    expect(formatDate('2026-09-07')).to.equal('07.09.2026');
  });
});
