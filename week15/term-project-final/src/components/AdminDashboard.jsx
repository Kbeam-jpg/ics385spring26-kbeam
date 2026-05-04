/*
Name: Kendall Beam
Assignment: Term Project 3
Description: admin dashboard component, displays property information
Filename: AdminDashboard.jsx
Date: May 3 2026
*/

import { useEffect, useState } from 'react';

/**
 * **Generated**
 * @param {*} value date
 * @returns {string} numeric date, short month
 */
function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * **Generated** with specific instructions
 * @param {Function} onAuthError callback function on what to do if protected /admin/dashboard/data call fails
 * , e.g. () => window.location.reload()
 * @returns {JSX.Element} admin-dashboard-shell
 */
export default function AdminDashboard({ onAuthError }) {
  const [dashboard, setDashboard] = useState({
    adminEmail: '',
    propertyName: '',
    properties: []
  });
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      try {
        setStatus('loading');
        setError('');

        const response = await fetch('/admin/dashboard/data', {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json'
          },
          signal: controller.signal
        });

        const data = await response.json();

        if (response.status === 401) {
          // User is not authenticated, notify parent
          if (onAuthError) onAuthError();
          return;
        }

        if (response.status === 403) {
          setError(data.error || 'Admin access required');
          setStatus('forbidden');
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load the admin dashboard');
        }

        setDashboard({
          adminEmail: data.adminEmail || '',
          propertyName: data.propertyName || '',
          properties: data.properties || []
        });
        setStatus('ready');
      } catch (err) {
        if (err.name === 'AbortError') return;

        setError(err.message || 'Unable to load the admin dashboard');
        setStatus('error');
      }
    }

    loadDashboard();

    return () => controller.abort();
  }, [onAuthError]);

  const totalProperties = dashboard.properties.length;
  const totalReviews = dashboard.properties.reduce((count, property) => {
    return count + (property.reviews?.length || 0);
  }, 0);

  return (
    <main className="admin-dashboard-shell">
      <section className="admin-dashboard-hero">
        <div>
          <p className="admin-dashboard-kicker">Admin dashboard</p>
          <h1>
            Welcome back to {dashboard.propertyName || 'your property'}
          </h1>
          <p className="admin-dashboard-subtitle">
            Signed in as {dashboard.adminEmail || 'loading...'}
          </p>
        </div>

        <button
          type="button"
          className="admin-dashboard-logout"
          onClick={async () => {
            try {
              const res = await fetch('/admin/logout', {
                method: 'POST',
                credentials: 'include'
              });
              // log status for debugging
              // eslint-disable-next-line no-console
              console.log('logout response status', res.status);
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error('logout error', err);
            } finally {
              // Ensure navigation happens even if the request fails
              window.location.assign('/');
            }
          }}
        >Log out</button>
      </section>

      {status === 'loading' && (
        <div className="admin-dashboard-state">Loading dashboard data...</div>
      )}

      {status === 'error' && (
        <div className="admin-dashboard-state admin-dashboard-state--error">
          <p>{error}</p>
          <button type="button" onClick={() => window.location.assign('/')}>Go back home</button>
        </div>
      )}

      {status === 'forbidden' && (
        <div className="admin-dashboard-state admin-dashboard-state--forbidden">
          <p>{error}</p>
          <p>This account is logged in but does not have admin permissions.</p>
          <button type="button" onClick={async () => {
            try {
              const res = await fetch('/admin/logout', {
                method: 'POST',
                credentials: 'include'
              });
              // eslint-disable-next-line no-console
              console.log('forbidden logout response', res.status);
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error('forbidden logout error', err);
            } finally {
              window.location.assign('/');
            }
          }}>
            Log out
          </button>
        </div>
      )}

      {status === 'ready' && (
        <>
          <section className="admin-dashboard-metrics">
            <article className="admin-dashboard-metric-card">
              <span className="admin-dashboard-metric-label">Properties</span>
              <strong>{totalProperties}</strong>
            </article>
            <article className="admin-dashboard-metric-card">
              <span className="admin-dashboard-metric-label">Reviews</span>
              <strong>{totalReviews}</strong>
            </article>
            <article className="admin-dashboard-metric-card">
              <span className="admin-dashboard-metric-label">Admin email</span>
              <strong>{dashboard.adminEmail || '—'}</strong>
            </article>
          </section>

          <section className="admin-dashboard-table-card">
            <div className="admin-dashboard-table-header">
              <div>
                <p className="admin-dashboard-kicker">MongoDB records</p>
                <h2>Property documents</h2>
              </div>
              <p className="admin-dashboard-table-note">
                Showing {totalProperties} document{totalProperties === 1 ? '' : 's'}
              </p>
            </div>

            <div className="admin-dashboard-table-wrap">
              <table className="admin-dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Island</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Amenities</th>
                    <th>Reviews</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.properties.map((property) => (
                    <tr key={property._id}>
                      <td>{property.name || '—'}</td>
                      <td>{property.island || '—'}</td>
                      <td>{property.type || '—'}</td>
                      <td className="admin-dashboard-table-description">
                        {property.description || '—'}
                      </td>
                      <td>{Array.isArray(property.amenities) ? property.amenities.length : 0}</td>
                      <td>{property.reviews?.length || 0}</td>
                      <td>{formatDate(property.updatedAt || property.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}