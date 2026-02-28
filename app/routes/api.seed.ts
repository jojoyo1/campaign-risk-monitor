import type { Route } from "./+types/api.seed";
import { data } from "react-router";

export async function action({ context }: Route.ActionArgs) {
  const id = context.cloudflare.env.CAMPAIGN_DO.idFromName("global");
  const stub = context.cloudflare.env.CAMPAIGN_DO.get(id);
  await stub.seedData();
  return data({ success: true });
}
