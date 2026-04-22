"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Github, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const connectSchema = z.object({
  username: z.string().min(1, "GitHub username is required").regex(/^[a-zA-Z0-9-]+$/, "Use a valid GitHub username"),
  token: z.string().optional()
});

export type GithubConnectValues = z.infer<typeof connectSchema>;

type GithubConnectProps = {
  onConnect: (values: GithubConnectValues) => Promise<void>;
};

export function GithubConnect({ onConnect }: GithubConnectProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<GithubConnectValues>({
    resolver: zodResolver(connectSchema),
    defaultValues: {
      username: "",
      token: ""
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await onConnect(values);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not connect to GitHub.");
    }
  });

  return (
    <Card className="border-[#30363d] bg-[#161b22]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Github className="h-5 w-5 text-[#58a6ff]" />
          Connect GitHub
        </CardTitle>
        <CardDescription>
          Add your GitHub username to import repositories. Add a personal access token to avoid API rate limits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-[#c9d1d9]">
              GitHub Username
            </label>
            <Input id="username" placeholder="octocat" {...register("username")} />
            {errors.username ? <p className="text-xs text-[#f85149]">{errors.username.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="token" className="flex items-center gap-2 text-sm font-medium text-[#c9d1d9]">
              <KeyRound className="h-4 w-4" />
              Personal Access Token (Optional)
            </label>
            <Input id="token" placeholder="ghp_..." type="password" {...register("token")} />
            <p className="text-xs text-[#8b949e]">Token is sent only to your own backend API request and never persisted.</p>
          </div>

          {submitError ? <p className="text-sm text-[#f85149]">{submitError}</p> : null}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Importing repositories..." : "Import repositories"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
