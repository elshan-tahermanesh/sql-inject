/**
 * Saves a dynamic SQL injection simulation run to the user's local logs.
 * @param {string} category - Injection category (e.g. 'Classic SQLi', 'Login Bypass')
 * @param {string} payload - Raw payload string tested
 * @param {string} status - Exploit status ('EXPLOITED' | 'BLOCKED' | 'INTERCEPTED')
 * @param {string} query - Computed query execution template
 */
export function saveTestLog(category, payload, status, query = '') {
  try {
    const existingLogs = JSON.parse(localStorage.getItem('sql_sandbox_test_logs') || '[]');
    
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0]; // HH:MM:SS
    
    const newLog = {
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      timestamp,
      date: now.toLocaleDateString(),
      category,
      payload,
      status,
      query: query || `SELECT * FROM data WHERE name = '${payload}'`
    };
    
    // Limit to keeping the 100 most recent logs
    const updatedLogs = [newLog, ...existingLogs].slice(0, 100);
    localStorage.setItem('sql_sandbox_test_logs', JSON.stringify(updatedLogs));
  } catch (e) {
    console.error('Error saving test log to localStorage', e);
  }
}
