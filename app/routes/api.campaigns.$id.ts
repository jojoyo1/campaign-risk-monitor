import type { Route } from "./+types/api.campaigns.$id";
import { data } from "react-router";

export async function loader({ params, context }: Route.LoaderArgs) {
  const doId = context.cloudflare.env.CAMPAIGN_DO.idFromName("global");
  const stub = context.cloudflare.env.CAMPAIGN_DO.get(doId);
  const campaign = await stub.getCampaign(params.id);

  if (!campaign) {
    throw data({ error: "Campaign not found" }, { status: 404 });
  }

  return data({ campaign });
}
