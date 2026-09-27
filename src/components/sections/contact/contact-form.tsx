"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useActionState, useState } from "react";
import { submitEnquiry } from "@/app/(site)/contact/actions";
import { Button } from "@/components/ui/button";
import { FileField, SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ATTACHMENT_LIMITS, contactContent, enquiryFieldDefinitions, enquiryForms, enquiryTypes } from "@/config/contact";
import { tradeDirections } from "@/config/products";
import { cn } from "@/lib/cn";
import {
  FORM_TOKEN_FIELD,
  HONEYPOT_FIELD,
  OTHER_PRODUCT_VALUE,
  SOURCE_FIELD,
  exceedsAttachmentLimits,
  fieldLabel,
  type EnquiryFormState,
} from "@/lib/enquiry/schema";
import { EASE_SMOOTH, SPRING_SNAPPY } from "@/lib/motion";
import type { EnquiryFieldConfig, EnquiryTypeId, Product, TradeDirection } from "@/types/content";

const INITIAL_STATE: EnquiryFormState = { status: "idle" };
const PRODUCT_GROUPS: TradeDirection[] = ["export", "import"];
const ALL_TYPES = enquiryTypes.map((type) => type.id);
const { form } = contactContent;

/** Text areas and uploads span both columns. */
function isWideField(field: EnquiryFieldConfig): boolean {
  const { kind } = enquiryFieldDefinitions[field.name];
  return kind === "textarea" || kind === "files";
}

/** Fields that span both grid columns: wide fields, and a field left alone on its row. */
function wideFieldNames(fields: EnquiryFieldConfig[]): Set<string> {
  const wide = new Set<string>();
  let column = 0;
  fields.forEach((field, index) => {
    const next = fields[index + 1];
    if (isWideField(field)) {
      wide.add(field.name);
      column = 0;
    } else if (column === 0 && (!next || isWideField(next))) {
      wide.add(field.name);
    } else {
      column = 1 - column;
    }
  });
  return wide;
}

interface ContactFormCardProps {
  initialType: EnquiryTypeId;
  initialProduct?: string;
  /** Offered in the product list. */
  products: Product[];
  /** Server-signed timestamp that lets the server spot bots (see form-token.ts). */
  formToken: string;
  /** The page hosting the form, recorded with each enquiry. */
  source: string;
  /** Enquiry types offered in the switcher; defaults to all four. */
  types?: EnquiryTypeId[];
}

/** Remounts the form (via `key`) when the visitor wants to send another enquiry. */
export function ContactFormCard(props: ContactFormCardProps) {
  const [submissionCount, setSubmissionCount] = useState(0);

  return (
    <div className="rounded-panel bg-surface p-6 ring-1 ring-inset ring-border sm:p-10">
      <ContactForm key={submissionCount} {...props} onReset={() => setSubmissionCount((count) => count + 1)} />
    </div>
  );
}

function ContactForm({
  initialType,
  initialProduct,
  products,
  formToken,
  source,
  types = ALL_TYPES,
  onReset,
}: ContactFormCardProps & { onReset: () => void }) {
  const [state, formAction, isPending] = useActionState(submitEnquiry, INITIAL_STATE);
  const [type, setType] = useState<EnquiryTypeId>(initialType);
  // React resets the form after each submit, and a <select> ignores a changed
  // defaultValue — so remount the fields per response to restore what was typed.
  const [answeredState, setAnsweredState] = useState(state);
  const [responseCount, setResponseCount] = useState(0);
  // Oversized uploads are stopped here: the server would refuse the whole request before our code sees it.
  const [attachmentError, setAttachmentError] = useState<string>();
  if (state !== answeredState) {
    setAnsweredState(state);
    setResponseCount((count) => count + 1);
  }

  if (state.status === "success") return <FormSuccess reference={state.reference} onReset={onReset} />;

  const errors = state.status === "error" ? state.errors : undefined;
  const values = state.status === "error" ? state.values : undefined;
  const typeOptions = enquiryTypes
    .filter((enquiryType) => types.includes(enquiryType.id))
    .map((enquiryType) => ({ value: enquiryType.id, label: enquiryType.shortLabel }));

  return (
    <form
      action={formAction}
      noValidate
      onSubmit={(event) => {
        const input = event.currentTarget.elements.namedItem("attachments");
        const files = input instanceof HTMLInputElement && input.files ? Array.from(input.files) : [];
        const tooLarge = exceedsAttachmentLimits(files);
        setAttachmentError(tooLarge ? form.errors.files : undefined);
        if (tooLarge) event.preventDefault();
      }}
      className="flex flex-col gap-8"
    >
      <div>
        <h2 className="type-h3">{form.title}</h2>
        {typeOptions.length > 1 && (
          <>
            <p className="mt-6 mb-3 text-sm font-medium">{form.typeLabel}</p>
            <SegmentedControl
              label={form.typeLabel}
              value={type}
              onChange={setType}
              options={typeOptions}
              // Phones get an even grid (2×2 or 3 across) instead of a ragged wrap.
              className={cn(
                "grid w-full sm:inline-flex sm:w-auto",
                typeOptions.length % 2 === 0 ? "grid-cols-2" : "grid-cols-3",
              )}
            />
          </>
        )}
        <input type="hidden" name="type" value={type} />
      </div>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          transition={{ duration: 0.26, ease: EASE_SMOOTH }}
          className="flex flex-col gap-10"
        >
          {enquiryForms[type].map((section) => {
            const wide = wideFieldNames(section.fields);
            return (
              <fieldset key={section.title} className="grid gap-5 sm:grid-cols-2">
                <legend className="type-eyebrow mb-5 text-fg-mute">{section.title}</legend>
                {section.fields.map((field) => (
                  <div key={`${field.name}:${responseCount}`} className={cn(wide.has(field.name) && "sm:col-span-2")}>
                    <EnquiryFieldControl
                      field={field}
                      error={(field.name === "attachments" && attachmentError) || errors?.[field.name]}
                      defaultValue={values?.[field.name] ?? (field.name === "product" ? initialProduct : undefined)}
                      products={products}
                    />
                  </div>
                ))}
              </fieldset>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name={FORM_TOKEN_FIELD} value={formToken} />
      <input type="hidden" name={SOURCE_FIELD} value={source} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <Button type="submit" size="lg" variant="brand" disabled={isPending} withArrow={!isPending}>
            {isPending && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
            {isPending ? form.submitting : form.submit}
          </Button>
          {state.status === "error" && (
            <p role="alert" className="min-w-0 flex-1 basis-60 text-sm text-danger">
              {state.message}
              {state.fallbackEmail && (
                <>
                  {" "}
                  {form.errors.emailFallback}{" "}
                  <a href={`mailto:${state.fallbackEmail}`} className="font-semibold underline underline-offset-2">
                    {state.fallbackEmail}
                  </a>
                  .
                </>
              )}
            </p>
          )}
        </div>
        <p className="text-xs text-fg-mute">{form.privacyNote}</p>
      </div>
    </form>
  );
}

interface EnquiryFieldControlProps {
  field: EnquiryFieldConfig;
  error?: string;
  defaultValue?: string;
  products: Product[];
}

function EnquiryFieldControl({ field, error, defaultValue, products }: EnquiryFieldControlProps) {
  const definition = enquiryFieldDefinitions[field.name];
  const placeholder = field.placeholder ?? definition.placeholder;
  const common = {
    name: field.name,
    label: fieldLabel(field),
    error,
    required: field.required,
    optionalLabel: field.required ? undefined : form.optional,
  };
  const initial = { defaultValue: defaultValue ?? "" };

  switch (definition.kind) {
    case "textarea":
      return <TextAreaField {...common} {...initial} placeholder={placeholder} />;
    case "files":
      return <FileField {...common} multiple accept={ATTACHMENT_LIMITS.accept} hint={definition.placeholder} />;
    case "select":
      return (
        <SelectField {...common} {...initial}>
          <option value="">{placeholder}</option>
          {definition.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </SelectField>
      );
    case "product":
      return (
        <SelectField {...common} {...initial}>
          <option value="">{placeholder}</option>
          {PRODUCT_GROUPS.map((direction) => (
            <optgroup key={direction} label={tradeDirections[direction].label}>
              {products
                .filter((product) => product.direction === direction)
                .map((product) => (
                  <option key={product.slug} value={product.slug}>
                    {product.name}
                  </option>
                ))}
            </optgroup>
          ))}
          <option value={OTHER_PRODUCT_VALUE}>{form.otherProduct}</option>
        </SelectField>
      );
    default:
      return (
        <TextField
          {...common}
          {...initial}
          type={definition.kind}
          autoComplete={definition.autoComplete}
          placeholder={placeholder}
        />
      );
  }
}

function FormSuccess({ reference, onReset }: { reference?: string; onReset: () => void }) {
  const { success } = form;

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING_SNAPPY}
      className="flex flex-col items-center py-16 text-center"
    >
      <span className="grid size-16 place-items-center rounded-full bg-success/10 text-success">
        <svg viewBox="0 0 24 24" aria-hidden className="size-8" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE_SMOOTH }}
          />
        </svg>
      </span>
      <h2 className="type-h3 mt-8">{success.title}</h2>
      <p className="type-body mt-3 max-w-sm text-fg-mute">{success.description}</p>
      {reference && (
        <p className="mt-6 rounded-full bg-canvas px-5 py-2 text-sm ring-1 ring-inset ring-border">
          {success.reference}: <strong className="font-semibold tracking-wide">{reference}</strong>
        </p>
      )}
      <Button variant="secondary" className="mt-8" onClick={onReset}>
        {success.again}
      </Button>
    </motion.div>
  );
}
