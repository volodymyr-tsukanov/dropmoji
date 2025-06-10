/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'DropMoji',
  description: 'Share emoji and GIF messages that self-destruct after one view',
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
