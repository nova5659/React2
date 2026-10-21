import React from 'react';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="p-4 font-sans text-gray-900 bg-white min-h-screen">
        <header className="mb-6 pb-3 border-b border-gray-200">
          <nav className="flex flex-wrap gap-3 text-sm font-medium text-blue-600">
            <Link href="/" className="hover:underline">Home</Link>
            <span>|</span>
            <Link href="/blog" className="hover:underline">Blog</Link>
            <span>|</span>
            <Link href="/blog2/nextjs" className="hover:underline">Blog2</Link>
            <span>|</span>
            <Link href="/blog3" className="hover:underline">Blog3</Link>
            <span>|</span>
            <Link href="/products?id=202230114&name=박현준" className="hover:underline">Products</Link>
            <span>|</span>
            <Link href="/counter" className="hover:underline">Counter</Link>
            <span>|</span>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

