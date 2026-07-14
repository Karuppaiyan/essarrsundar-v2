import AdminLayout from '@/components/admin/AdminLayout';
import { Amplify } from "aws-amplify";

export const metadata = { title: 'Admin — ESS ARR ENTERPRISES' };

import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs, { ssr: true });


export default function Layout({ children }: { children: React.ReactNode }) {
 return (
<html lang="en">
      <body>
       <AdminLayout>
      {children}
    </AdminLayout>
      </body>
    </html>

    
  );
  
}
