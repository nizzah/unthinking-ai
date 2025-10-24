/**
 * Test script to verify error suppression is working
 * Run this in browser console to test
 */

// Test function to verify error suppression
function testErrorSuppression() {
  console.log('Testing error suppression...');
  
  // These should be suppressed
  console.error('Unchecked runtime.lastError: The message port closed before a response was received.');
  console.warn('forward-logs-shared.ts:95 Download the React DevTools');
  console.log('paywall-configuration-manager-K4boFMPo.js:8690 [AuthContext] Fetching auth state');
  
  // These should NOT be suppressed
  console.error('This is a real application error');
  console.warn('This is a real application warning');
  console.log('This is a real application log');
  
  console.log('Error suppression test complete. Check if external errors show [SUPPRESSED] prefix.');
}

// Auto-run test if in browser
if (typeof window !== 'undefined') {
  console.log('Error suppression test available. Run testErrorSuppression() to test.');
}
