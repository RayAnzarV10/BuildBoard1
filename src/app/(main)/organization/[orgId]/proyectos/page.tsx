import Projects from "@/components/dashboard/search-projects";

export default async function ProjectDetails({ 
  params 
}: { 
  params: { orgId: string; projectId: string } 
}) {
  // Esperar los params
  const { orgId, projectId } = await params;

  return (
    <Projects orgId={orgId} />
  );
}