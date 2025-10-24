import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ErrorSuppression } from "@/components/error-suppression"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "Unthinking",
  description: "Trust yourself again. One spark of clarity, one small step of courage, one moment of meaning.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Immediate error suppression script
              (function() {
                const originalError = console.error;
                const originalWarn = console.warn;
                const originalLog = console.log;
                
                const suppressPatterns = [
                  'runtime.lastError',
                  'message port closed',
                  'forward-logs-shared',
                  'paywall-configuration-manager',
                  'AuthContext',
                  'Unchecked runtime.lastError',
                  'chrome-extension://',
                  'net::ERR_FILE_NOT_FOUND',
                  'completion_list.html',
                  'utils.js',
                  'heuristicsRedefinitions.js',
                  'extensionState.js',
                  'URL changed, fetching new Sublime highlights',
                  'Unlisted TLDs in URLs are not supported'
                ];
                
                function shouldSuppress(message) {
                  return suppressPatterns.some(pattern => message.includes(pattern));
                }
                
                function suppressExternalErrors(args) {
                  const message = args.join(' ');
                  if (shouldSuppress(message)) {
                    console.log('[SUPPRESSED]', message);
                    return true;
                  }
                  return false;
                }
                
                console.error = function(...args) {
                  if (!suppressExternalErrors(args)) {
                    originalError.apply(console, args);
                  }
                };
                
                console.warn = function(...args) {
                  if (!suppressExternalErrors(args)) {
                    originalWarn.apply(console, args);
                  }
                };
                
                console.log = function(...args) {
                  if (!suppressExternalErrors(args)) {
                    originalLog.apply(console, args);
                  }
                };
                
                // Handle global errors
                window.addEventListener('error', function(event) {
                  const message = event.message || '';
                  const filename = event.filename || '';
                  const fullMessage = message + ' ' + filename;
                  
                  if (shouldSuppress(fullMessage)) {
                    event.preventDefault();
                    console.log('[SUPPRESSED] Global error:', fullMessage);
                    return false;
                  }
                });
                
                window.addEventListener('unhandledrejection', function(event) {
                  const reason = event.reason?.toString() || '';
                  if (shouldSuppress(reason)) {
                    event.preventDefault();
                    console.log('[SUPPRESSED] Unhandled rejection:', reason);
                    return false;
                  }
                });
                
                // Handle network errors (chrome-extension file not found)
                const originalFetch = window.fetch;
                window.fetch = function(...args) {
                  const url = args[0]?.toString() || '';
                  if (shouldSuppress(url)) {
                    console.log('[SUPPRESSED] Network request:', url);
                    return Promise.reject(new Error('Suppressed external request'));
                  }
                  return originalFetch.apply(this, args);
                };
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <ErrorSuppression />
        {children}
      </body>
    </html>
  )
}
