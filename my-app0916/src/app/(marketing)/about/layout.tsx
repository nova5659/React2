import React from 'react';

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>About Layout Header</div>
      {children}
      <div>About Layout Footer</div>
    </div>
  );
}
