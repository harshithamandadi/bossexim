"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useActionState, useState } from "react";
import { submitEnquiry } from "@/app/(site)/contact/actions";
import { Button } from "@/components/ui/button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { contactContent, enquiryFormFields, enquiryTypes, partnershipAreas } from "@/config/contact";
import { tradeDirections } from "@/config/products";
import { cn } from "@/lib/cn";
import {
  FORM_TOKEN_FIELD,
  HONEYPOT_FIELD,
  OTHER_PRODUCT_VALUE,
  SOURCE_FIELD,
  type EnquiryFormState,
} from "@/lib/enquiry/schema";
import { EASE_SMOOTH, SPRING_SNAPPY } from "@/lib/motion";
import type { EnquiryField, EnquiryFieldConfig, EnquiryTypeId, Product, TradeDirection } from "@/types/content";

const INITIAL_STATE: EnquiryFormState = { status: "idle" };
const PRODUCT_GROUPS: TradeDirection[] = ["export", "import"];
const ALL_TYPES = enquiryTypes.map((type) => type.id);
const { form } = contactContent;

/** Browser hints: keyboard type and autofill. */
const INPUT_HINTS: Partial<Record<EnquiryField, { type?: string; autoComplete?: string }>> = {
  name: { autoComplete: "name" },
  company: { autoComplete: "organization" },
  email: { type: "email", autoComplete: "email" },
  phone: { type: "tel", autoComplete: "tel" },
};

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

  if (state.status === "success") return <FormSuccess onReset={onReset} />;

  const errors = state.status === "error" ? state.errors : undefined;
  const values = state.status === "error" ? state.values : undefined;
  const fields = enquiryFormFields[type];
  const gridFields = fields.filter((field) => field.name !== "message");
  const typeOptions = enquiryTypes
    .filter((enquiryType) => types.includes(enquiryType.id))
    .map((enquiryType) => ({ value: enquiryType.id, label: enquiryType.shortLabel }));

  return (
    <form action={formAction} noValidate className="grid gap-5 sm:grid-cols-2">
      <h2 className="type-h3 sm:col-span-2">{form.title}</h2>

      <div className="sm:col-span-2">
        <p className="mb-3 text-sm font-medium">{form.typeLabel}</p>
        <SegmentedControl
          label={form.typeLabel}
          value={type}
          onChange={setType}
          options={typeOptions}
          // Phones get an even grid (2×2 or 3 across) instead of a ragged wrap.
          className={cn("grid w-full sm:inline-flex sm:w-auto", typeOptions.length % 2 === 0 ? "grid-cols-2" : "grid-cols-3")}
        />
        <input type="hidden" name="type" value={type} />
      </div>

      <AnimatePresence initial={false} mode="popLayout">
        {fields.map((field) => {
          // A field left alone on the last grid row spans both columns; the message always does.
          const isWide =
            field.name === "message" || (gridFields.length % 2 === 1 && gridFields.at(-1)?.name === field.name);
          return (
            <motion.div
              key={field.name}
              layout="position"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.24, ease: EASE_SMOOTH }}
              className={cn(isWide && "sm:col-span-2")}
            >
              <EnquiryFieldControl
                field={field}
                error={errors?.[field.name]}
                defaultValue={values?.[field.name] ?? (field.name === "product" ? initialProduct : undefined)}
                products={products}
              />
            </motion.div>
          );
        })}
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

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-2 sm:col-span-2">
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
      <p className="text-xs text-fg-mute sm:col-span-2">{form.privacyNote}</p>
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
  const defaults = form.fields[field.name];
  const placeholder = field.placeholder ?? defaults.placeholder;
  const common = {
    name: field.name,
    label: field.label ?? defaults.label,
    error,
    required: field.required,
    optionalLabel: field.required ? undefined : form.optional,
    defaultValue: defaultValue ?? "",
  };

  switch (field.name) {
    case "message":
      return <TextAreaField {...common} placeholder={placeholder} />;
    case "product":
      return (
        <SelectField {...common}>
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
          <option value={OTHER_PRODUCT_VALUE}>{form.fields.product.other}</option>
        </SelectField>
      );
    case "partnershipArea":
      return (
        <SelectField {...common}>
          <option value="">{placeholder}</option>
          {partnershipAreas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </SelectField>
      );
    default:
      return <TextField {...common} {...INPUT_HINTS[field.name]} placeholder={placeholder} />;
  }
}

function FormSuccess({ onReset }: { onReset: () => void }) {
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
      <Button variant="secondary" className="mt-8" onClick={onReset}>
        {success.again}
      </Button>
    </motion.div>
  );
}
