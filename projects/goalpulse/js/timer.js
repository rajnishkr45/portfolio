/**
 * Computes live countdown values, zero-padded strings, and timeline progress.
 */
export function getCountdownMetrics(startDateStr, targetDateStr) {
    const now = Date.now();
    const target = new Date(targetDateStr).getTime();
    const start = new Date(startDateStr).getTime();
  
    const validTarget = Number.isFinite(target) ? target : now;
    const diffMs = Math.max(0, validTarget - now);
    const isComplete = diffMs <= 0;
  
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    const pad = (n) => String(n).padStart(2, '0');
  
    // Progress percentage from startDate -> targetDate
    let progress = 0;
    if (Number.isFinite(start) && validTarget > start) {
      const raw = ((now - start) / (validTarget - start)) * 100;
      progress = Math.max(0, Math.min(100, Math.round(raw)));
    } else if (isComplete) {
      progress = 100;
    }
  
    const targetDateObj = new Date(validTarget);
    const targetFormatted = targetDateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).toUpperCase();
  
    return {
      isComplete,
      days,
      hours,
      minutes,
      seconds,
      dd: pad(days),
      hh: pad(hours),
      mm: pad(minutes),
      ss: pad(seconds),
      progress,
      targetFormatted,
    };
  }
  
  /**
   * Returns formatted current time & date for the preview-only OS lock screen overlay.
   */
  export function getLiveOsClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const date = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  
    return {
      time: `${hours}:${minutes}`,
      date,
    };
  }