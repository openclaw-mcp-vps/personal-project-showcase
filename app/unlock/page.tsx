import { UnlockForm } from "@/components/unlock-form";

type UnlockPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function UnlockPage({ searchParams }: UnlockPageProps) {
  const params = await searchParams;
  const initialSessionId = params.session_id ?? "";

  return <UnlockForm initialSessionId={initialSessionId} />;
}
