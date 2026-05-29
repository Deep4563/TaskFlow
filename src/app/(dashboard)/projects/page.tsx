import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { projectService } from "@/services/project.service";
import Card from "@/components/ui/card";
import { FolderKanban, Plus, Users, Calendar } from "lucide-react";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  const projects = await projectService.getUserProjects(
    session?.user?.id ?? ""
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Empty state */}
      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 font-medium">No projects yet</h3>
          <p className="text-gray-400 text-sm mt-1">
            Create your first project to get started
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card
              key={project._id.toString()}
              className="p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Color bar */}
              <div
                className="w-full h-1.5 rounded-full mb-4"
                style={{ backgroundColor: project.color }}
              />

              {/* Project name */}
              <h3 className="font-semibold text-gray-800 truncate">
                {project.name}
              </h3>

              {/* Description */}
              {project.description && (
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {project.description}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Users className="w-3.5 h-3.5" />
                  {project.members.length} member
                  {project.members.length !== 1 ? "s" : ""}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}