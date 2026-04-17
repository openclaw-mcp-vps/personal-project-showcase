import { notFound } from "next/navigation";
import { getShowcase } from "@/lib/supabase";
import { RepoCard } from "@/components/RepoCard";
import { ProjectShowcase } from "@/components/ProjectShowcase";

export default async function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await getShowcase(username);

  if (!data || data.projects.length === 0) {
    notFound();
  }

  const leadProject = data.projects[0];

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 text-[#c9d1d9]">
      <header className="mb-8 rounded-2xl border border-[#30363d] bg-[#161b22] p-8">
        <p className="text-sm uppercase tracking-[0.12em] text-[#7d8590]">Developer Portfolio</p>
        <h1 className="mt-2 text-4xl font-bold text-white">{data.username}</h1>
        <p className="mt-3 max-w-2xl text-[#9aa4af]">
          Technical side projects presented with architecture context, engineering quality metrics, and business-facing impact summaries.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
        <div className="space-y-3">
          {data.projects.map((project) => (
            <RepoCard key={project.repo.id} project={project} />
          ))}
        </div>
        <ProjectShowcase project={leadProject} />
      </div>
    </main>
  );
}
