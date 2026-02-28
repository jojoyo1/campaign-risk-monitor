import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/campaigns", "routes/api.campaigns.ts"),
  route("api/campaigns/:id", "routes/api.campaigns.$id.ts"),
  route("api/campaigns/:id/analyze", "routes/api.campaigns.$id.analyze.ts"),
  route("api/seed", "routes/api.seed.ts"),
] satisfies RouteConfig;
