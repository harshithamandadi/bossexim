import type { CollectionConfig, PayloadRequest } from "payload";
import { isAdmin, isSignedIn } from "../access";
import { ADMIN_GROUPS } from "../fields";
import { beaconDone, countryName, readBeacon, sitePath, visitorCountry } from "../visitor";

export const QUESTION_RESULTS = [
  { label: "Answered", value: "answered" },
  { label: "Suggested FAQs", value: "suggested" },
  { label: "Not answered", value: "unanswered" },
] as const;

type QuestionResult = (typeof QUESTION_RESULTS)[number]["value"];

const MAX_QUESTION_LENGTH = 500;
const isResult = (value: unknown): value is QuestionResult => QUESTION_RESULTS.some((result) => result.value === value);

/**
 * POST /api/assistant-questions/log — Aira reports each question a visitor asks
 * and whether an FAQ answered it. Contact details typed into the buying or
 * call-back steps are never sent here (those are saved as enquiries).
 */
async function log(req: PayloadRequest): Promise<Response> {
  const body = await readBeacon<{ question: string; result: string; answer: string; page: string }>(req, "aira");
  const question = typeof body?.question === "string" ? body.question.trim().slice(0, MAX_QUESTION_LENGTH) : "";
  if (!body || !question || !isResult(body.result)) return beaconDone();

  const country = visitorCountry(req.headers);
  await req.payload.create({
    collection: "assistant-questions",
    overrideAccess: true,
    data: {
      question,
      result: body.result,
      answer: typeof body.answer === "string" ? body.answer.slice(0, MAX_QUESTION_LENGTH) : undefined,
      page: sitePath(body.page),
      country,
      countryName: countryName(country),
    },
  });
  return beaconDone();
}

/** What visitors ask Aira — shows which questions the FAQs don't cover yet. */
export const AssistantQuestions: CollectionConfig = {
  slug: "assistant-questions",
  labels: { singular: "Aira question", plural: "Aira questions" },
  access: {
    read: isSignedIn,
    create: () => false,
    update: () => false,
    delete: isAdmin,
  },
  admin: {
    group: ADMIN_GROUPS.insights,
    useAsTitle: "question",
    defaultColumns: ["question", "result", "answer", "countryName", "page", "createdAt"],
    listSearchableFields: ["question"],
    description:
      "Every question visitors ask Aira, and whether an FAQ answered it. Filter by “Not answered” to see which FAQs to add. Enquiries and call-back requests made through Aira are under Inbox → Enquiries.",
  },
  defaultSort: "-createdAt",
  endpoints: [{ path: "/log", method: "post", handler: log }],
  fields: [
    { name: "question", type: "text", required: true },
    { name: "result", label: "Result", type: "select", required: true, index: true, options: [...QUESTION_RESULTS] },
    { name: "answer", label: "Answered with FAQ", type: "text" },
    { name: "page", label: "Asked on page", type: "text" },
    { name: "country", label: "Country code", type: "text", index: true },
    { name: "countryName", label: "Country", type: "text" },
  ],
};
