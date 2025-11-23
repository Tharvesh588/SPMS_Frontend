
'use client';

import { notFound, useSearchParams, useParams } from 'next/navigation';

import AdminDashboard from '@/app/admin/dashboard/page';
import ManageFacultyPage from '@/app/admin/faculty/page';
import ManageBatchesPage from '@/app/admin/batches/page';
import ManageProblemStatementsPage from '@/app/admin/problem-statements/page';

import FacultyDashboard from '@/app/faculty/dashboard/page';
import ManageFacultyProblemStatementsPage from '@/app/faculty/problem-statements/page';

import BatchDashboard from '@/app/batch/dashboard/page';
import BatchProfilePage from '@/app/batch/profile/page';


export default function RolePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const role = params.role as string;
  const page = searchParams.get('page') || 'dashboard';

  if (!role) {
    notFound();
  }

  const roleComponent = () => {
    switch (role) {
      case 'admin':
        switch(page) {
            case 'dashboard': return <AdminDashboard />;
            case 'faculty': return <ManageFacultyPage />;
            case 'batches': return <ManageBatchesPage />;
            case 'problem-statements': return <ManageProblemStatementsPage />;
            default: notFound();
        }
      case 'faculty':
        switch(page) {
            case 'dashboard': return <FacultyDashboard />;
            case 'problem-statements': return <ManageFacultyProblemStatementsPage />;
            default: notFound();
        }
      case 'batch':
         switch(page) {
            case 'dashboard': return <BatchDashboard />;
            case 'profile': return <BatchProfilePage />;
            default: notFound();
        }
      default:
        notFound();
    }
  }

  return roleComponent();
}
