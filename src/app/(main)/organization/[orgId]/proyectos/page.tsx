import Projects from "@/components/dashboard/search-projects";
import NavBar from "@/components/site/navigation/navBar";

export default async function ProjectDetails({ 
  params 
}: { 
  params: { orgId: string; projectId: string } 
}) {
  // Esperar los params
  const { orgId, projectId } = await params;

  return (
    <NavBar>
      <Projects orgId={orgId} />
    </NavBar>
  
  );
}