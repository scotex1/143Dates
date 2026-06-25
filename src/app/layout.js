export const metadata = {
  title: '💌 LoveDate — Date Proposal SaaS Platform',
  description: 'Apni girlfriend ke liye beautiful date proposal banao. Multi-user SaaS with food photos, activities, themes.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
