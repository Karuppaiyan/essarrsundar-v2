// app/admin/layout.tsx
import './lib/amplify-config';   
// side-effect import, runs Amplify.configure()
import AdminLayout from '@/components/admin/AdminLayout';
import { signIn, getCurrentUser } from 'aws-amplify/auth';
import "../[locale]/globals.css";

export const metadata = { title: 'Admin — ESS ARR ENTERPRISES' };

export default function Layout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en">
      <body>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}