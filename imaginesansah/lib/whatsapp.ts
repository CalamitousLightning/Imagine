/**
 * WhatsApp URL generation. The number and message templates always come from
 * site_settings (DB) — this file only formats them. Never hardcode a number here.
 */

export function buildWhatsAppUrl(rawNumber: string, message?: string): string {
  const digitsOnly = rawNumber.replace(/[^\d]/g, "");
  const base = `https://wa.me/${digitsOnly}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

interface ProjectRequestMessageParams {
  template: string;
  name: string;
  projectType: string;
  budget?: string | null;
  service?: string | null;
  description?: string | null;
  deadline?: string | null;
  referenceNotes?: string | null;
  fileCount?: number;
}

export function fillProjectMessageTemplate({
  template,
  name,
  projectType,
  budget,
  service,
  description,
  deadline,
  referenceNotes,
  fileCount = 0,
}: ProjectRequestMessageParams): string {
  // WhatsApp click-to-chat links only support pre-filled TEXT — there is no
  // way to attach a file via a wa.me URL on any platform. The files are
  // already safely saved with the request (visible in the admin dashboard),
  // so we just tell the recipient one exists instead of silently dropping it.
  const filesNote =
    fileCount > 0
      ? `📎 ${fileCount} reference file${fileCount === 1 ? "" : "s"} attached with this request (saved on the site).`
      : "";

  return template
    .replaceAll("{name}", name)
    .replaceAll("{project_type}", projectType)
    .replaceAll("{budget}", budget || "Not specified")
    .replaceAll("{service}", service || "Not specified")
    .replaceAll("{description}", description || "")
    .replaceAll("{deadline}", deadline || "Not specified")
    .replaceAll("{reference_notes}", referenceNotes || "None")
    .replaceAll("{files_note}", filesNote)
    .trim();
}
