"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadClientReferenceFile, MediaUploadError } from "@/lib/supabase/upload";
import { clientRequestSchema, type ClientRequestInput } from "@/lib/validation/client-request";
import { buildWhatsAppUrl, fillProjectMessageTemplate } from "@/lib/whatsapp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Service } from "@/types/domain";

interface StartAProjectFormProps {
  services: Service[];
  preselectedServiceId?: string;
  whatsappNumber: string | null;
  whatsappTemplate: string;
}

const PROJECT_TYPES = [
  "Logo & Brand Identity",
  "Flyer & Poster Design",
  "Social Media Design",
  "Business Cards",
  "Event Graphics",
  "Promotional Designs",
  "Custom Graphic Design",
  "Something else",
];

export function StartAProjectForm({
  services,
  preselectedServiceId,
  whatsappNumber,
  whatsappTemplate,
}: StartAProjectFormProps) {
  const supabase = createClient();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ name: string; projectType: string; budget?: string } | null>(
    null
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClientRequestInput>({
    resolver: zodResolver(clientRequestSchema),
    defaultValues: { service_id: preselectedServiceId ?? null, project_type: PROJECT_TYPES[0] },
  });

  function addFiles(list: FileList) {
    setUploadError(null);
    setFiles((prev) => [...prev, ...Array.from(list)]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(values: ClientRequestInput) {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const requestId = crypto.randomUUID();

      const { error: insertError } = await supabase.from("client_requests").insert({
        id: requestId,
        full_name: values.full_name,
        whatsapp_number: values.whatsapp_number,
        email: values.email || null,
        project_type: values.project_type,
        service_id: values.service_id || null,
        description: values.description,
        preferred_deadline: values.preferred_deadline || null,
        budget_range: values.budget_range || null,
        reference_notes: values.reference_notes || null,
      });
      if (insertError) throw new Error(insertError.message);

      for (const file of files) {
        const media = await uploadClientReferenceFile(supabase, file);
        const { error: linkError } = await supabase
          .from("client_request_files")
          .insert({ request_id: requestId, media_id: media.id });
        if (linkError) throw new Error(linkError.message);
      }

      setSuccess({ name: values.full_name, projectType: values.project_type, budget: values.budget_range });
    } catch (err) {
      setSubmitError(
        err instanceof MediaUploadError || err instanceof Error
          ? err.message
          : "Something went wrong submitting your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    const message = whatsappNumber
      ? fillProjectMessageTemplate({
          template: whatsappTemplate,
          name: success.name,
          projectType: success.projectType,
          budget: success.budget,
        })
      : null;

    return (
      <div className="rounded-md border border-public-black/10 bg-public-white p-10 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-public-violet" />
        <h2 className="mt-4 font-display text-2xl text-public-black">Request received.</h2>
        <p className="mt-2 font-body text-public-black/60">
          Thanks, {success.name} — I&apos;ll review your project and get back to you soon.
        </p>
        {whatsappNumber && message && (
          <a
            href={buildWhatsAppUrl(whatsappNumber, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-public-black px-6 py-3 font-body text-sm font-medium text-public-white hover:bg-public-violet"
          >
            Continue on WhatsApp →
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <p className="rounded-md border border-red-500/20 bg-red-500/5 p-3 font-body text-sm text-red-600">
          {submitError}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input id="full_name" {...register("full_name")} className="mt-1.5" />
          {errors.full_name && <p className="mt-1 text-xs text-red-600">{errors.full_name.message}</p>}
        </div>
        <div>
          <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
          <Input id="whatsapp_number" placeholder="233XXXXXXXXX" {...register("whatsapp_number")} className="mt-1.5" />
          {errors.whatsapp_number && (
            <p className="mt-1 text-xs text-red-600">{errors.whatsapp_number.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email (optional)</Label>
        <Input id="email" type="email" {...register("email")} className="mt-1.5" />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="project_type">Project Type</Label>
          <Controller
            control={control}
            name="project_type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {services.length > 0 && (
          <div>
            <Label htmlFor="service_id">Related Service (optional)</Label>
            <select
              id="service_id"
              defaultValue={preselectedServiceId ?? ""}
              {...register("service_id")}
              className="mt-1.5 flex h-10 w-full rounded-md border border-public-black/20 bg-public-white px-3 py-2 text-sm"
            >
              <option value="">None</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="description">Tell me about the project</Label>
        <Textarea id="description" rows={5} {...register("description")} className="mt-1.5" />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="preferred_deadline">Preferred Deadline</Label>
          <Input id="preferred_deadline" type="date" {...register("preferred_deadline")} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="budget_range">Budget Range</Label>
          <Input id="budget_range" placeholder="e.g. GHS 500 – 1,500" {...register("budget_range")} className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor="reference_notes">Reference / Inspiration Notes</Label>
        <Textarea id="reference_notes" rows={3} {...register("reference_notes")} className="mt-1.5" />
      </div>

      <div>
        <Label>Reference Files (optional)</Label>
        <div className="mt-1.5 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border border-public-black/10 px-3 py-2">
              <span className="truncate font-body text-sm text-public-black/70">{file.name}</span>
              <button type="button" onClick={() => removeFile(i)} aria-label="Remove file">
                <X className="h-4 w-4 text-public-black/40 hover:text-public-black" />
              </button>
            </div>
          ))}
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-public-black/20 py-4 font-body text-sm text-public-black/50 hover:border-public-black/40">
            <Upload className="h-4 w-4" />
            Add files (images or PDF)
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
          </label>
          {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-public-black py-3.5 font-body text-sm font-medium text-public-white transition-colors hover:bg-public-violet disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Submitting..." : "Submit Project Request"}
      </button>
    </form>
  );
}
