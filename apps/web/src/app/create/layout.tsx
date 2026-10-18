import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Your Invitation',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
