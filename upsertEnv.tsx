import nextEnvPkg from "@next/env";
import { Vercel } from "@vercel/sdk";
import assert from "assert";
import path from "path";
import fs from "fs";
assert(process.env.VERCEL_ACCESS_TOKEN, "VERCEL_ACCESS_TOKEN is not set");

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_ACCESS_TOKEN,
});
const VERCEL_PROJECT_ID = "prj_MJY7gNdDbixlE8DWRZsDKKXHcJlQ";

main().catch((err) => {
  console.error("Failed to upsert env var", err);
  process.exit(1);
});

async function main() {
  if (
    !process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.VERCEL_GIT_COMMIT_REF == "main"
  ) {
    console.warn("skipping upsertEnvValue - not a preview build");
    return;
  }

  const value = `DEMO_VAR_${process.env.VERCEL_GIT_COMMIT_REF}`;
  await upsertEnvValue("DEMO_VAR", value);
  await writeEnvfile("DEMO_VAR", value);

  const projectDir = process.cwd();
  nextEnvPkg.loadEnvConfig(projectDir, false, console, true);
}

export function writeEnvfile(key: string, value: string) {
  const envPath = path.join(process.cwd(), ".env.local");
  fs.appendFileSync(envPath, `${key}="${value}"\n`);
}

async function upsertEnvValue(key: string, value: string) {
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
        value,
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
