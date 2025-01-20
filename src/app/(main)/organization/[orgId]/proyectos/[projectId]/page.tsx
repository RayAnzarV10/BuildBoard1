export default async function ProjectDetails({ 
  params 
}: { 
  params: { orgId: string; projectId: string } 
}) {
  // Esperar los params
  const { orgId, projectId } = await params;

  return (
    <div>
      <p>Organización ID: {orgId}</p>
      <p>Proyecto ID: {projectId}</p>
    </div>
  );
}