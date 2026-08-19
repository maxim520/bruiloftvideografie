"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import type { ContactFormBlock } from "@/types/blocks";

type ContactFormProps = {
  block: ContactFormBlock;
};

const SERVICE_OPTIONS = [
  "Fotografie",
  "Videografie",
  "Fotografie & videografie",
  "Destination wedding",
  "Nog niet zeker",
] as const;

const contactFormSchema = z.object({
  names: z.string().trim().min(2, "Vul jullie namen in."),
  email: z.string().trim().min(1, "Vul een geldig e-mailadres in.").email("Vul een geldig e-mailadres in."),
  phone: z.string().trim().optional(),
  weddingDate: z.string().min(1, "Kies jullie trouwdatum."),
  weddingLocation: z.string().trim().min(2, "Vul de trouwlocatie in."),
  service: z.string().min(1, "Kies een gewenste dienst."),
  message: z.string().trim().min(20, "Vertel iets meer over jullie plannen."),
  privacy: z.boolean().refine((value) => value === true, {
    message: "Accepteer de privacyverklaring.",
  }),
  // Honeypot: onzichtbaar voor mensen, blijft leeg. Gevuld = waarschijnlijk bot.
  website: z.string().optional(),
  // Vastgelegd bij het renderen van het formulier, voor server-side timing-checks.
  renderedAt: z.string(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const CONTACT_ENDPOINT = "/api/contact.php";

class ContactSubmissionError extends Error {}

/**
 * Stuurt het complete formulier (dus ook website/renderedAt) naar
 * public/api/contact.php. Dat endpoint doet zijn eigen, onafhankelijke
 * honeypot- en timing-check — de client-side kortsluiting in onSubmit
 * hieronder is alleen een snelle UX-optimalisatie, geen vervanging
 * daarvan. Bij een netwerkfout of een non-200-status gooit dit een
 * ContactSubmissionError; de aanroeper toont dan de generieke
 * foutmelding in de status==="error"-tak.
 */
async function submitContactForm(data: ContactFormValues): Promise<void> {
  let response: Response;
  try {
    response = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    throw new ContactSubmissionError("Netwerkfout bij het versturen van de aanvraag.");
  }

  if (!response.ok) {
    throw new ContactSubmissionError(`Onverwachte serverstatus: ${response.status}`);
  }
}

function ErrorMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span
      id={id}
      className="mt-2 flex items-start gap-[7px] text-[12.5px] leading-[1.5] text-[#9b3b26]"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        className="mt-0.5 flex-none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5M12 16.2v.3" />
      </svg>
      <span>{message}</span>
    </span>
  );
}

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

function Field({ id, label, required, error, children }: FieldProps) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.16em] text-charcoal-muted"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-copper" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      <ErrorMessage id={`${id}-error`} message={error} />
    </div>
  );
}

function controlClass(invalid: boolean, extra = ""): string {
  return `min-h-[52px] w-full rounded-lg border bg-white/55 px-4 text-base text-text transition-colors placeholder:text-[#a2988f] focus:border-copper focus:bg-white focus:shadow-[0_0_0_3px_rgba(166,110,74,0.14)] focus:outline-none ${
    invalid ? "border-[#9b3b26]" : "border-border"
  } ${extra}`;
}

/**
 * In tegenstelling tot de andere blokken rendert dit blok nooit `null`:
 * het formulier zelf (velden, validatie, verzending) is vaste code, geen
 * content, dus er is geen ontbrekend veld dat het onbruikbaar maakt. Wel
 * krijgen `heading` en de succesmelding elk hun eigen val: de sectie mag
 * nooit stil verdwijnen (dan kan niemand meer contact opnemen), en het
 * successcherm — het enige moment vlak na een actie van de bezoeker — mag
 * al helemaal nooit leeg ogen.
 */
export default function ContactForm({ block }: ContactFormProps) {
  const {
    eyebrow,
    heading,
    intro,
    submitLabel,
    perks,
    directHeading,
    phone,
    email,
    location,
    successHeading,
    successText,
    successCta,
  } = block;

  const formId = useId();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  // Eenmalig bepaald via een lazy initializer, niet bij elke render opnieuw.
  const [renderedAt] = useState(() => String(Date.now()));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    shouldFocusError: true,
    defaultValues: {
      names: "",
      email: "",
      phone: "",
      weddingDate: "",
      weddingLocation: "",
      service: "",
      message: "",
      privacy: false,
      website: "",
      renderedAt,
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    if (data.website) {
      // Honeypot geraakt: waarschijnlijk een bot. Stil negeren, geen fout tonen.
      setStatus("success");
      return;
    }

    setStatus("submitting");
    try {
      await submitContactForm(data);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section id="aanvraag" className="bg-surface-light py-[68px] md:py-20 lg:py-[112px]">
        <Container>
          <Reveal>
            <div
              role="status"
              className="max-w-[640px] rounded-lg border border-border bg-white p-9 shadow-[0_1px_2px_rgba(36,27,23,0.04)] md:p-10"
            >
              <span className="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-copper/[0.12] text-copper">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6.5 9.5 17 4.5 12" />
                </svg>
              </span>
              <h3 className="mb-3.5 text-[30px]">
                {successHeading || "Bedankt voor je aanvraag."}
              </h3>
              <p className="mb-7 max-w-[44ch] text-base leading-[1.8] text-text-muted">
                {successText ||
                  "We hebben je bericht ontvangen en nemen zo snel mogelijk contact met je op."}
              </p>
              {successCta && (
                <Button href={successCta.href} variant="dark-outline">
                  {successCta.label}
                </Button>
              )}
            </div>
          </Reveal>
        </Container>
      </section>
    );
  }

  return (
    <section id="aanvraag" className="bg-surface-light py-[68px] md:py-20 lg:py-[112px]">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(0,7fr)_1px_minmax(0,4fr)] lg:gap-14">
            <div>
              {eyebrow && (
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-[.22em] text-copper-text">
                  {eyebrow}
                </p>
              )}
              {heading && (
                <h2 className="mb-5 max-w-[15ch] text-[clamp(1.875rem,3vw,2.75rem)]">{heading}</h2>
              )}
              {intro && (
                <p className="mb-10 max-w-[46ch] text-base leading-[1.8] text-text-muted">
                  {intro}
                </p>
              )}

              {status === "error" && (
                <div
                  role="alert"
                  className="mb-[26px] flex items-start gap-3.5 rounded-lg border border-[rgba(155,59,38,0.35)] bg-[rgba(155,59,38,0.06)] px-6 py-[22px] text-[#9b3b26]"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    className="mt-0.5 flex-none"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.5v5M12 16.2v.3" />
                  </svg>
                  <p className="text-base leading-[1.6]">
                    Er ging iets mis bij het versturen. Probeer het opnieuw of neem
                    rechtstreeks contact met ons op.
                  </p>
                </div>
              )}

              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                {/* Honeypot: onzichtbaar en buiten de taborde, alleen bots vullen dit in. */}
                <div aria-hidden="true" className="fixed left-[-9999px] top-0 h-px w-px overflow-hidden">
                  <label htmlFor={`${formId}-website`}>Website</label>
                  <input
                    id={`${formId}-website`}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("website")}
                  />
                </div>
                <input type="hidden" {...register("renderedAt")} />

                <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                  <Field id={`${formId}-names`} label="Jullie namen" required error={errors.names?.message}>
                    <input
                      id={`${formId}-names`}
                      type="text"
                      placeholder="Voor- en achternaam"
                      autoComplete="name"
                      aria-invalid={errors.names ? "true" : "false"}
                      aria-describedby={errors.names ? `${formId}-names-error` : undefined}
                      className={controlClass(Boolean(errors.names))}
                      {...register("names")}
                    />
                  </Field>

                  <Field id={`${formId}-email`} label="E-mailadres" required error={errors.email?.message}>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      placeholder="voorbeeld@email.nl"
                      autoComplete="email"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                      className={controlClass(Boolean(errors.email))}
                      {...register("email")}
                    />
                  </Field>
                </div>

                <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                  <Field id={`${formId}-phone`} label="Telefoonnummer">
                    <input
                      id={`${formId}-phone`}
                      type="tel"
                      placeholder="06 12 34 56 78"
                      autoComplete="tel"
                      className={controlClass(false)}
                      {...register("phone")}
                    />
                  </Field>

                  <Field
                    id={`${formId}-weddingDate`}
                    label="Trouwdatum"
                    required
                    error={errors.weddingDate?.message}
                  >
                    <input
                      id={`${formId}-weddingDate`}
                      type="date"
                      aria-invalid={errors.weddingDate ? "true" : "false"}
                      aria-describedby={errors.weddingDate ? `${formId}-weddingDate-error` : undefined}
                      className={controlClass(Boolean(errors.weddingDate))}
                      {...register("weddingDate")}
                    />
                  </Field>
                </div>

                <div className="mb-5">
                  <Field
                    id={`${formId}-weddingLocation`}
                    label="Trouwlocatie"
                    required
                    error={errors.weddingLocation?.message}
                  >
                    <input
                      id={`${formId}-weddingLocation`}
                      type="text"
                      placeholder="Waar gaan jullie trouwen?"
                      aria-invalid={errors.weddingLocation ? "true" : "false"}
                      aria-describedby={
                        errors.weddingLocation ? `${formId}-weddingLocation-error` : undefined
                      }
                      className={controlClass(Boolean(errors.weddingLocation))}
                      {...register("weddingLocation")}
                    />
                  </Field>
                </div>

                <div className="mb-5">
                  <Field
                    id={`${formId}-service`}
                    label="Gewenste dienst"
                    required
                    error={errors.service?.message}
                  >
                    <select
                      id={`${formId}-service`}
                      aria-invalid={errors.service ? "true" : "false"}
                      aria-describedby={errors.service ? `${formId}-service-error` : undefined}
                      className={controlClass(
                        Boolean(errors.service),
                        "appearance-none bg-no-repeat pr-11"
                      )}
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2371675f' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                        backgroundPosition: "right 16px center",
                      }}
                      {...register("service")}
                    >
                      <option value="">Kies een optie</option>
                      {SERVICE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="mb-5">
                  <Field
                    id={`${formId}-message`}
                    label="Bericht"
                    required
                    error={errors.message?.message}
                  >
                    <textarea
                      id={`${formId}-message`}
                      rows={5}
                      placeholder="Vertel mij meer over jullie plannen, wensen of vragen..."
                      aria-invalid={errors.message ? "true" : "false"}
                      aria-describedby={errors.message ? `${formId}-message-error` : undefined}
                      className={controlClass(
                        Boolean(errors.message),
                        "min-h-[120px] resize-y py-4 leading-[1.65]"
                      )}
                      {...register("message")}
                    />
                  </Field>
                </div>

                <div className="my-[26px] flex items-start gap-3">
                  <input
                    id={`${formId}-privacy`}
                    type="checkbox"
                    className="mt-0.5 h-5 w-5 flex-none accent-copper"
                    aria-invalid={errors.privacy ? "true" : "false"}
                    aria-describedby={errors.privacy ? `${formId}-privacy-error` : undefined}
                    {...register("privacy")}
                  />
                  <label htmlFor={`${formId}-privacy`} className="text-base leading-[1.55] text-text">
                    {/* Redesign-regel (Fase 2, sectie 8/45): geen "#"-link — er
                        bestaat nog geen privacyverklaring-pagina. Zodra die
                        er is (samen met footer.legalLinks, ook nu leeg),
                        hier weer een echte <Link> van maken. */}
                    Ik ga akkoord met de privacyverklaring.{" "}
                    <span className="text-copper" aria-hidden="true">*</span>
                  </label>
                </div>
                <ErrorMessage id={`${formId}-privacy-error`} message={errors.privacy?.message} />

                <Button
                  type="submit"
                  variant="primary"
                  disabled={status === "submitting"}
                  className="mt-6 w-full md:w-auto"
                >
                  {status === "submitting" ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="h-[15px] w-[15px] animate-spin rounded-full border-2 border-white/40 border-t-white"
                      />
                      Aanvraag versturen...
                    </>
                  ) : (
                    submitLabel ?? "Versturen"
                  )}
                </Button>
              </form>
            </div>

            <div aria-hidden="true" className="hidden self-stretch bg-border lg:block" />

            <aside
              aria-label="Wat jullie kunnen verwachten"
              className="border-t border-border pt-11 lg:border-t-0 lg:pt-0"
            >
              {perks && perks.length > 0 && (
                <div className="mb-11 grid grid-cols-1 gap-[34px] md:grid-cols-2 md:gap-x-9 md:gap-y-8 lg:grid-cols-1">
                  {perks.map((perk) => (
                    <div key={perk.title} className="grid grid-cols-[44px_1fr] gap-x-5">
                      <Icon name={perk.icon} size={30} className="row-span-2 text-copper" />
                      <h3 className="mb-[7px] font-body text-[15px] font-semibold">{perk.title}</h3>
                      <p className="text-[13.5px] leading-[1.7] text-text-muted">{perk.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {(directHeading || phone || email || location) && (
                <div className="rounded-lg border border-border bg-surface p-7 shadow-[0_1px_2px_rgba(36,27,23,0.04)]">
                  {directHeading && <h3 className="mb-[22px] text-2xl">{directHeading}</h3>}
                  <ul className="flex flex-col gap-4">
                    {phone && (
                      <li className="flex items-center gap-3.5 text-[15px]">
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.4}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="flex-none text-copper"
                          aria-hidden="true"
                        >
                          <path d="M6.2 3.5h3l1.5 3.8-1.9 1.4a12 12 0 0 0 5.5 5.5l1.4-1.9 3.8 1.5v3a1.7 1.7 0 0 1-1.9 1.7A16.5 16.5 0 0 1 4.5 5.4a1.7 1.7 0 0 1 1.7-1.9z" />
                        </svg>
                        <a
                          href={`tel:${phone.replace(/\s+/g, "")}`}
                          className="transition-colors hover:text-copper"
                        >
                          {phone}
                        </a>
                      </li>
                    )}
                    {email && (
                      <li className="flex items-center gap-3.5 text-[15px]">
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.4}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="flex-none text-copper"
                          aria-hidden="true"
                        >
                          <rect x="3" y="5.5" width="18" height="13" rx="2" />
                          <path d="m3.6 6.7 8.4 6 8.4-6" />
                        </svg>
                        <a href={`mailto:${email}`} className="transition-colors hover:text-copper">
                          {email}
                        </a>
                      </li>
                    )}
                    {location && (
                      <li className="flex items-center gap-3.5 text-[15px]">
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.4}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="flex-none text-copper"
                          aria-hidden="true"
                        >
                          <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" />
                          <circle cx="12" cy="10" r="2.6" />
                        </svg>
                        <span>{location}</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
