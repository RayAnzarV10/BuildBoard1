import CreateProject from '@/components/forms/new-project'
import NavBar from '@/components/site/navigation/navBar'
import React from 'react'

export default async function ProjectDetails({ 
  params 
}: { 
  params: { orgId: string; projectId: string } 
}) {
  // Esperar los params
  const { orgId, projectId } = await params;

  return (
    <NavBar>
      <main className="flex-1 m-4 mt-[-2] space-y-4 rounded-md">
        <CreateProject orgId={orgId} />
      </main>
    </NavBar>
  );
}