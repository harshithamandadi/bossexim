import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from "payload";

/**
 * CMS content appears across many pages (menus, footer, chatbot, stats), so any
 * change refreshes the whole site — cheap at this size, and never stale.
 * Pages rebuild on their next visit. The seed script opts out via context.
 */
function revalidateSite(req: PayloadRequest) {
  if (req.context.disableRevalidate) return;
  try {
    revalidatePath("/", "layout");
  } catch (error) {
    req.payload.logger.warn({ err: error, msg: "Site not revalidated: not running inside Next.js." });
  }
}

const afterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  revalidateSite(req);
  return doc;
};

const afterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  revalidateSite(req);
  return doc;
};

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req }) => {
  revalidateSite(req);
  return doc;
};

export const revalidateHooks = { afterChange: [afterChange], afterDelete: [afterDelete] };
