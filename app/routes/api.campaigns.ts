import type { Route } from "./+types/api.campaigns";
import { data } from "react-router";

export async function loader({ context }: Route.LoaderArgs) {
  const id = context.cloudflare.env.CAMPAIGN_DO.idFromName("global");
  const stub = context.cloudflare.env.CAMPAIGN_DO.get(id);
  const campaigns = await stub.listCampaigns();
  return data({ campaigns });
}
