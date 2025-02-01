import NavBar from "@/components/site/navigation/navBar";
import ProjectPage from "./project-page";
import { Project } from "@prisma/client";
import { getClient, getProject } from "@/lib/queries";

export default async function ProjectDetails({
  params
}: {
  params: { orgId: string; projectId: string }
}) {
  const { orgId, projectId } = await params;
  const project = await getProject(orgId, projectId);

  if (!project) {
    return (
      <NavBar>
        <div>Proyecto no encontrado!</div>
      </NavBar>
    );
  }

  // Si no hay clientId, pasamos null como cliente
  let client = null;
  if (project.clientId) {
    client = await getClient(orgId, project.clientId);
  }

  return (
    <NavBar>
      <div className="mx-4">
        <ProjectPage orgId={orgId} projectId={projectId} project={project} client={client} />
      </div>
    </NavBar>
  );
}