"use client";

import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useActionState, useState } from "react";
import { submitEnquiry } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { contactContent, enquiryTypes } from "@/config/contact";
import { tradeDirections } from "@/config/products";
import { getProductsByDirection } from "@/lib/catalogue";
import { HONEYPOT_FIELD, OTHER_PRODUCT_VALUE, type EnquiryFormState } from "@/lib/enquiry/schema";
import { EASE_APPLE, SPRING_SNAPPY } from "@/lib/motion";
import type { EnquiryTypeId, TradeDirection } from "@/types/content";

const INITIAL_STATE: EnquiryFormState = { status: "idle" };
const PRODUCT_GROUPS: TradeDirection[] = ["export", "import"];
const { form } = contactContent;

interface ContactFormCardProps {
  initialType: EnquiryTypeId;
  initialProduct?: string;
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

function ContactForm({ initialType, initialProduct, onReset }: ContactFormCardProps & { onReset: () => void }) {
  const [state, formAction, isPending] = useActionState(submitEnquiry, INITIAL_STATE);
  const [type, setType] = useState<EnquiryTypeId>(initialType);

  if (state.status === "success") return <FormSuccess onReset={onReset} />;

  const errors = state.status === "error" ? state.errors : undefined;
  const values = state.status === "error" ? state.values : undefined;
  const { fields } = form;

  return (
    <form action={formAction} noValidate className="grid gap-5 sm:grid-cols-2">
      <h2 className="type-h3 sm:col-span-2">{form.title}</h2>

      <div className="sm:col-span-2">
        <p className="mb-3 text-sm font-medium">{form.typeLabel}</p>
        <SegmentedControl
          label={form.typeLabel}
          value={type}
          onChange={setType}
          options={enquiryTypes.map((enquiryType) => ({ value: enquiryType.id, label: enquiryType.shortLabel }))}
        />
        <input type="hidden" name="type" value={type} />
      </div>

      <TextField
        name="name"
        label={fields.name.label}
        placeholder={fields.name.placeholder}
        autoComplete="name"
        required
        defaultValue={values?.name}
        error={errors?.name}
      />
      <TextField
        name="company"
        label={fields.company.label}
        placeholder={fields.company.placeholder}
        autoComplete="organization"
        optionalLabel={form.optional}
        defaultValue={values?.company}
      />
      <TextField
        name="email"
        type="email"
        label={fields.email.label}
        placeholder={fields.email.placeholder}
        autoComplete="email"
        required
        defaultValue={values?.email}
        error={errors?.email}
      />
      <TextField
        name="phone"
        type="tel"
        label={fields.phone.label}
        placeholder={fields.phone.placeholder}
        autoComplete="tel"
        optionalLabel={form.optional}
        defaultValue={values?.phone}
      />
      <TextField
        name="country"
        label={fields.country.label}
        placeholder={fields.country.placeholder}
        autoComplete="country-name"
        optionalLabel={form.optional}
        defaultValue={values?.country}
      />
      <SelectField
        name="product"
        label={fields.product.label}
        optionalLabel={form.optional}
        defaultValue={values?.product ?? initialProduct ?? ""}
        error={errors?.product}
      >
        <option value="">{fields.product.placeholder}</option>
        {PRODUCT_GROUPS.map((direction) => (
          <optgroup key={direction} label={tradeDirections[direction].label}>
            {getProductsByDirection(direction).map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.name}
              </option>
            ))}
          </optgroup>
        ))}
        <option value={OTHER_PRODUCT_VALUE}>{fields.product.other}</option>
      </SelectField>
      <TextAreaField
        name="message"
        label={fields.message.label}
        placeholder={fields.message.placeholder}
        required
        defaultValue={values?.message}
        error={errors?.message}
        className="sm:col-span-2"
      />

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2 sm:col-span-2">
        <Button type="submit" size="lg" disabled={isPending} withArrow={!isPending}>
          {isPending && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
          {isPending ? form.submitting : form.submit}
        </Button>
        {state.status === "error" && (
          <p role="alert" className="text-sm text-danger">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
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
            transition={{ delay: 0.2, duration: 0.6, ease: EASE_APPLE }}
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
