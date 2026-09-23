import "server-only";
import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";

/** The Payload Local API — direct database access, no HTTP round trip. */
export const getPayloadClient = cache(() => getPayload({ config }));
