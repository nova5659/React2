import React from 'react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>Marketing Layout Header</div>
      {children}
      <div>Marketing Layout Footer</div>
    </div>
  );
}
