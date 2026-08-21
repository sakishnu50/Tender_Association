import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';

export default function SettingsView({ darkMode, toggleTheme }) {
  const [highPriority, setHighPriority] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [dailyReports, setDailyReports] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [threshold, setThreshold] = useState('8.0');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
        {savedSuccess && (
          <div className="badge badge-new" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', gap: '0.4rem', display: 'flex', alignItems: 'center' }}>
            <CheckCircle2 size={16} /> Settings Saved Successfully!
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>User Profile</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Name</label>
            <input
              type="text"
              defaultValue="XYZ"
              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-main)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Email</label>
            <input
              type="email"
              defaultValue="xyz10@gmail.com"
              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-main)' }}
            />
          </div>

          {/* Theme Preference Toggle */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Dark Theme Mode</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Switch between Light and Dark interface</div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={!!darkMode}
                onChange={toggleTheme}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <button className="btn btn-primary" onClick={handleSave} style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
            <Save size={16} /> Save Profile
          </button>
        </div>

        {/* Notifications & AI Threshold */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Notifications & AI Score Alert</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Toggle 1 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block' }}>High-Priority Alerts</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Notify instantly for urgent tenders</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={highPriority}
                  onChange={(e) => setHighPriority(e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* Toggle 2 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block' }}>Deadline Alerts</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Warn 5 days before closing</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={deadlineAlerts}
                  onChange={(e) => setDeadlineAlerts(e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* Toggle 3 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block' }}>Daily Digest Reports</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Receive email digest every morning</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={dailyReports}
                  onChange={(e) => setDailyReports(e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* Toggle 4 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block' }}>Weekly Analytics Reports</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Summary of tenders & win-loss stats</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={weeklyReports}
                  onChange={(e) => setWeeklyReports(e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>AI Score Alert Threshold</label>
            <input
              type="text"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', width: '100px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-main)' }}
            />
          </div>

          <button className="btn btn-primary" onClick={handleSave} style={{ alignSelf: 'flex-start' }}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

