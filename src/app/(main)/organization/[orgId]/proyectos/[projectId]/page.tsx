import NavBar from "@/components/site/navigation/navBar";
import ProjectPage from "./project-page";
import { getClient, getClients, getProject, getProjectExpenses, getProjectIncome } from "@/lib/queries";

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

  let client = null;
  if (project.clientId) {
    client = await getClient(orgId, project.clientId);
  }

  let incomes = null;
  incomes = await getProjectIncome(orgId, projectId);

  let expenses = null;
  expenses = await getProjectExpenses(orgId, projectId);

  const clients = await getClients(orgId);

  return (
    <NavBar>
      <div className="mx-4">
        <ProjectPage orgId={orgId} projectId={projectId} project={project} client={client} clients={clients} incomes={incomes || []} expenses={expenses || []} />
      </div>
    </NavBar>
  );
}