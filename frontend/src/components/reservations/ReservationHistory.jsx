import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

export function reservationHistoryLoader() {
  return { API_BASE: import.meta.env.VITE_API_URL || 'http://localhost:3000' };
}

function formatDate(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatRelative(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d)) return '';
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

  const diff = d.getTime() - Date.now(); //just a quick note guys, future = positive, past = negative
  const abs = Math.abs(diff);

  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;

  let value, unit;
  if (abs >= YEAR) {
    value = Math.round(diff / YEAR);
    unit = 'year';
  } else if (abs >= MONTH) {
    value = Math.round(diff / MONTH);
    unit = 'month';
  } else if (abs >= WEEK) {
    value = Math.round(diff / WEEK);
    unit = 'week';
  } else if (abs >= DAY) {
    value = Math.round(diff / DAY);
    unit = 'day';
  } else if (abs >= HOUR) {
    value = Math.round(diff / HOUR);
    unit = 'hour';
  } else if (abs >= MINUTE) {
    value = Math.round(diff / MINUTE);
    unit = 'minute';
  } else {
    value = Math.round(diff / 1000);
    unit = 'second';
  }

  return rtf.format(value, unit);
}

function activeDuration(checkIn) {
  if (!checkIn) return '';
  const d = new Date(checkIn);
  if (isNaN(d)) return '';

  const diffMs = Date.now() - d.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days >= 1) {
    return `Out for ${days} day${days !== 1 ? 's' : ''}`;
  } else {
    const safeHours = Math.max(1, hours);
    return `Out for ${safeHours} hour${safeHours !== 1 ? 's' : ''}`;
  }
}

export default function ReservationHistory() {
  const { API_BASE } = useLoaderData();
  const { token } = useAuth();

  const [rows, setRows] = React.useState(null);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (!token) {
          setError('You must be logged in to view reservation history.');
          return;
        }
        const res = await fetch(`${API_BASE}/api/reservations/history`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const t = await res.text().catch(() => '');
          throw new Error(t || `Request failed (${res.status})`);
        }
        const data = await res.json();
        if (!cancelled) setRows(data);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Error loading history.');
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [API_BASE, token]);

  if (error)
    return (
      <div className='container my-4'>
        <div className='alert alert-danger'>{error}</div>
      </div>
    );

  if (!rows)
    return (
      <div className='container my-4'>
        <div className='text-muted'>Loading…</div>
      </div>
    );

  if (rows.length === 0)
    return (
      <div className='container my-4'>
        <div className='alert alert-info'>No reservations yet.</div>
      </div>
    );

  // Group by reservation_id and listing all associated books
  const grouped = rows.reduce((acc, r) => {
    (acc[r.reservation_id] ||= { meta: r, items: [] }).items.push(r);
    return acc;
  }, {});

  return (
    <div className='container my-4'>
      <h2 className='mb-4'>Your Reservation History</h2>

      {Object.values(grouped).map(({ meta, items }) => {
        const active = !!meta.active;

        // I need other eyes on this, it looks like as of now checkin and checkout are swapped.
        const checkedOutDate = meta.check_in;
        const checkedInDate = meta.check_out;

        const checkoutLabel = formatDate(checkedOutDate);
        const checkinLabel = formatDate(checkedInDate);
        const checkoutRel = formatRelative(checkedOutDate);
        const checkinRel = formatRelative(checkedInDate);
        const durationLabel = active ? activeDuration(checkedOutDate) : '';

        return (
          <div key={meta.reservation_id} className='card mb-4 shadow-sm'>
            <div className='card-header d-flex justify-content-between align-items-center'>
              <div>
                <strong>Reservation #{meta.reservation_id}</strong>
                <div className='small text-muted'>
                  <span className='me-3'>
                    <strong>Checked out:</strong> {checkoutLabel}
                    {checkoutRel && (
                      <span className='ms-1 text-secondary'>
                        ({checkoutRel})
                      </span>
                    )}
                  </span>
                  <span>
                    <strong>Checked in:</strong> {checkinLabel}
                    {checkinRel && (
                      <span className='ms-1 text-secondary'>
                        ({checkinRel})
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className='text-end'>
                <span
                  className={`badge rounded-pill ${active ? 'bg-warning text-dark' : 'bg-success'}`}
                >
                  {active ? 'Active' : 'Completed'}
                </span>
                {durationLabel && (
                  <div className='small text-muted mt-1'>{durationLabel}</div>
                )}
              </div>
            </div>

            <ul className='list-group list-group-flush'>
              {items.map((it) => {
                const cover = it.cover_image || it.coverimage || '';
                return (
                  <li
                    key={it.reservation_item_id}
                    className='list-group-item d-flex align-items-center'
                  >
                    {cover && (
                      <img
                        src={cover}
                        alt={it.title}
                        className='me-3'
                        style={{
                          width: '56px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    )}
                    <div>
                      <div className='fw-semibold'>{it.title}</div>
                      <div className='text-muted small'>{it.author}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
