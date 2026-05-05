import { Client } from "@opensearch-project/opensearch";

const node = process.env.OPENSEARCH_URL;
if (!node) throw new Error("OPENSEARCH_URL not set");

declare global {
  var _opensearchClient: Client | undefined;
}

export const opensearch: Client =
  global._opensearchClient ?? new Client({ node });

if (process.env.NODE_ENV !== "production") {
  global._opensearchClient = opensearch;
}
