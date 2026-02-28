import type { Route } from "./+types/api.campaigns.$id.analyze";
import { data } from "react-router";
import { generateText } from "ai";
import { createWorkersAI } from "workers-ai-provider";

export async function action({ params, context }: Route.ActionArgs) {
  const doId = context.cloudflare.env.CAMPAIGN_DO.idFromName("global");
  const stub = context.cloudflare.env.CAMPAIGN_DO.get(doId);

  const ctx = await stub.getAnalysisContext(params.id);

  if (!ctx.found) {
    return data({ analysis: ctx.fallback }, { status: 404 });
  }

  try {
    const workersai = createWorkersAI({ binding: context.cloudflare.env.AI });

    const result = await generateText({
      model: workersai("auto", {}),
      system: ctx.systemPrompt,
      prompt: ctx.userPrompt,
    });

    return data({ analysis: result.text || ctx.fallback });
  } catch (e) {
    console.error("AI analysis error:", e);
    return data({ analysis: ctx.fallback });
  }
}
