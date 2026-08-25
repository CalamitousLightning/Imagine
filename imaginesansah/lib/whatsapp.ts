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
}

export function fillProjectMessageTemplate({
  template,
  name,
  projectType,
  budget,
}: ProjectRequestMessageParams): string {
  return template
    .replaceAll("{name}", name)
    .replaceAll("{project_type}", projectType)
    .replaceAll("{budget}", budget || "Not specified");
}
