import { defineRailway, github, project, service } from "railway/iac";
// This repository manages only its own resources in the environment. Other
// repositories export their own partial name.
// See https://docs.railway.com/infrastructure-as-code#multi-repo-projects
export const partial = "cinema-web";
export default defineRailway(() => {
  const cinemaWeb = service("cinema-web", {
    source: github("productsmy385-spl/CINEMA-OS"),
    build: { buildCommand: "cd apps/web && npm install --include=dev --legacy-peer-deps && npm run build", buildEnvironment: "V3", builder: "NIXPACKS" },
    start: "cd apps/web && npx next start -p ${PORT:-3000}",
    healthcheck: "/api/health",
    healthcheckTimeout: 300,
    replicas: { "sfo": 1 },
  });

  return project("CINEMA-OS", {
    variables: { managed: false },
    resources: [cinemaWeb],
  });
});
