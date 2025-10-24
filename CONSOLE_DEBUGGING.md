# Console Error Debugging Guide

## Overview
This application includes comprehensive error handling to distinguish between application errors and external browser extension noise.

## Common Console Errors

### ✅ **Normal Development Messages**
These are expected and don't indicate problems:
- `[HMR] connected` - Next.js Hot Module Replacement working
- `Initializing Sublime highlighter` - Code syntax highlighting
- `Download the React DevTools` - Development tool suggestion

### 🔇 **Suppressed External Errors**
These errors are automatically suppressed as they come from browser extensions:
- `Unchecked runtime.lastError: The message port closed before a response was received`
- `forward-logs-shared.ts:95` - Extension logging
- `paywall-configuration-manager-K4boFMPo.js:8690` - Extension scripts
- `[AuthContext] Fetching auth state` - Extension authentication
- `chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUND` - Extension file errors
- `completion_list.html` - Extension completion scripts
- `URL changed, fetching new Sublime highlights` - Code highlighting extension
- `Unlisted TLDs in URLs are not supported` - TLD URL validation errors

## Error Handling Components

### 1. ErrorSuppression Component
- **Location**: `components/error-suppression.tsx`
- **Purpose**: Filters out browser extension errors from console
- **Usage**: Automatically loaded in root layout

### 2. ErrorBoundary Component
- **Location**: `components/error-boundary.tsx`
- **Purpose**: Catches React component errors
- **Features**: Handles TLD URL errors and suppresses extension errors

### 3. Console Configuration
- **Location**: `lib/console-config.ts`
- **Purpose**: Centralized console management
- **Features**: Development-only logging, configurable suppression

## Debugging Your Application

### ✅ **Real Application Errors**
Look for errors that:
- Don't match the suppressed patterns above
- Come from your application files (not extensions)
- Include stack traces pointing to your code

### 🔍 **Development Console**
Use the enhanced development console:
```typescript
import { devConsole } from '@/lib/console-config'

devConsole.log('Debug message')
devConsole.warn('Warning message')
devConsole.error('Error message')
```

### 🛠 **Troubleshooting Steps**

1. **Check if error is suppressed**:
   - Look for `[DEV] Suppressed external error:` messages
   - These indicate the error was caught and filtered

2. **Verify error source**:
   - Check the file path in the error
   - Extension errors typically have random filenames
   - Your app errors will show your file paths

3. **Enable verbose logging**:
   - Set `NODE_ENV=development` for detailed logs
   - Check browser DevTools Network tab for failed requests

4. **Test in incognito mode**:
   - Disable extensions to isolate application errors
   - Compare console output with/without extensions

## Configuration

### Environment Variables
- `NODE_ENV=development` - Enables detailed logging and error suppression
- `NODE_ENV=production` - Minimal logging, no error suppression

### Customizing Suppression
Edit `lib/console-config.ts` to modify suppressed patterns:
```typescript
suppressedPatterns: [
  'runtime.lastError',
  'message port closed',
  // Add your own patterns here
]
```

## Best Practices

1. **Always check the source** of console errors
2. **Use development console** for debugging
3. **Test in incognito mode** when troubleshooting
4. **Report real application errors** (not extension noise)
5. **Keep error suppression patterns updated**

## Need Help?

If you're seeing errors that aren't covered here:
1. Check if it matches any suppressed patterns
2. Verify the error comes from your application code
3. Test in incognito mode to isolate extension issues
4. Use the development console for enhanced debugging
