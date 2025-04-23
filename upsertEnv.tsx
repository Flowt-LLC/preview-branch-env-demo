import { Vercel } from "@vercel/sdk";
import assert from "assert";

assert(process.env.VERCEL_ACCESS_TOKEN);
const vercel = new Vercel({
  bearerToken: process.env.VERCEL_ACCESS_TOKEN,
});
const VERCEL_PROJECT_ID = "prj_MJY7gNdDbixlE8DWRZsDKKXHcJlQ";

await upsertEnvValue("DEMO_VAR");

async function upsertEnvValue(key: string) {
  if (
    !process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.VERCEL_GIT_COMMIT_REF === "main"
  ) {
    console.warn("not a preview build, skipping env var creation");
    return;
  }

  const addResponse = await vercel.projects.createProjectEnv({
    idOrName: VERCEL_PROJECT_ID,
    slug: "flowt",
    teamId: "flowt",
    upsert: "true",
    requestBody: [
      {
        comment: "set via upsertEnvValue",
        gitBranch: process.env.VERCEL_GIT_COMMIT_REF,
        key,
        value: `${key}_${process.env.VERCEL_GIT_COMMIT_REF}`,
        target: ["preview"],
        type: "encrypted",
      },
    ],
  });
  assert(
    addResponse.failed.length == 0,
    `Failed to set env item - ${JSON.stringify(addResponse)}`
  );
  console.log("Added environment variables: %o", addResponse);
  const vercelEnvVal = await getVercelEnvItem(key);
  assert(vercelEnvVal, `Failed to get envs - ${key} not found`);
}

async function getVercelEnvItem(key: string) {
  const envData = await vercel.projects.filterProjectEnvs({
    idOrName: VERCEL_PROJECT_ID,
    slug: "flowt",
    teamId: "flowt",
    gitBranch: process.env.VERCEL_GIT_COMMIT_REF,
  });
  assert(
    "envs" in envData,
    `Failed to get envs - unexpected response ${JSON.stringify(envData)}`
  );
  return envData.envs.find(
    (env) =>
      env.key === key && env.gitBranch === process.env.VERCEL_GIT_COMMIT_REF
  );
}
