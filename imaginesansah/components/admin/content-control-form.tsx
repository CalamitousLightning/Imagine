"use client";

import { useState, useTransition } from "react";
import { Loader2, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CONTENT_FIELDS } from "@/lib/content-keys";
import { saveSiteContent } from "@/lib/actions/content";

interface ContentControlFormProps {
  initialValues: Record<string, string>;
}

export function ContentControlForm({ initialValues }: ContentControlFormProps) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const sections = Array.from(new Set(CONTENT_FIELDS.map((f) => f.section)));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await saveSiteContent(values);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-10">
      {error && <p className="font-mono text-xs text-red-400">{error}</p>}

      {sections.map((section) => (
        <div key={section}>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-admin-cyan">{section}</p>
          <div className="space-y-5">
            {CONTENT_FIELDS.filter((f) => f.section === section).map((field) => (
              <div key={field.key}>
                <Label htmlFor={field.key} className="text-admin-text">{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.key}
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={3}
                    className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
                  />
                ) : (
                  <Input
                    id={field.key}
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="sticky bottom-6 flex items-center gap-3">
        <Button type="submit" disabled={pending} className="bg-admin-green text-admin-bg hover:bg-admin-green/90">
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {pending ? "Saving..." : "Save Changes"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 font-mono text-xs text-admin-green">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}
