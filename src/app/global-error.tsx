'use client';

import * as React from 'react';

export default function GlobalError({
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  return (
    <html lang="tr">
      <body className="flex min-h-screen flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-2xl font-bold">Kritik Bir Hata Oluştu</h2>
        <p className="mt-2 text-sm text-gray-500">
          Uygulama çalıştırılırken beklenmeyen bir hata meydana geldi.
        </p>
        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800"
        >
          Yeniden Dene
        </button>
      </body>
    </html>
  );
}

