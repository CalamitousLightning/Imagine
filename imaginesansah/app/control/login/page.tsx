"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const next = searchParams.get("next") || "/control";
    router.push(next);
    router.refresh();
  }

  return (
    <Card className="w-full max-w-sm border-admin-border bg-admin-panel">
      <CardHeader>
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-admin-muted">
          ImagineSansah_OS
        </p>
        <CardTitle className="text-admin-text">Creative Control</CardTitle>
        <CardDescription className="text-admin-muted">
          Authorized access only.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {urlError === "not_authorized" && (
          <p className="mb-4 rounded-md border border-admin-amber/30 bg-admin-amber/10 p-3 font-mono text-xs text-admin-amber">
            That account isn&apos;t authorized for the control room.
          </p>
        )}
        {error && (
          <p className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 font-mono text-xs text-red-400">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-admin-text">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-admin-border bg-admin-bg text-admin-text"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-admin-text">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-admin-border bg-admin-bg text-admin-text"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-admin-green text-admin-bg hover:bg-admin-green/90"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="theme-admin admin-scope flex min-h-screen items-center justify-center bg-admin-bg p-4">
      <Suspense fallback={<Card className="w-full max-w-sm border-admin-border bg-admin-panel" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
