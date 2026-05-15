import { Client } from "@opensearch-project/opensearch";

const node = process.env.OPENSEARCH_URL ?? "http://localhost:9200";

declare global {
  var _opensearchClient: Client | undefined;
}

export const opensearch: Client =
  global._opensearchClient ?? new Client({ node });

if (process.env.NODE_ENV !== "production") {
  global._opensearchClient = opensearch;
}
