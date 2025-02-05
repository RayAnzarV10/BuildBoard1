import EditProjectForm from '@/components/forms/edit-project'
import NavBar from '@/components/site/navigation/navBar'
import { getProject } from '@/lib/queries';
import React from 'react'

export default async function EditProject({
  params
}: {
  params: { orgId: string; projectId: string }
}) {
  const { orgId, projectId } = await params;
  const project = await getProject(orgId, projectId);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <NavBar>
      <div className="mx-4">
        <EditProjectForm project={project} orgId={orgId} />
      </div>
    </NavBar>
  );
}