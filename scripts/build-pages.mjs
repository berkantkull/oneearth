import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const root = process.cwd();
const backup = join(root, ".pages-build-backup");
const routes = ["api", "light"];
rmSync(backup, { recursive: true, force: true });
mkdirSync(backup);

try {
  for (const route of routes) {
    const source = join(root, "src", "app", route);
    if (existsSync(source)) renameSync(source, join(backup, route));
  }

  const command = process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : "npm";
  const args = process.platform === "win32" ? ["/d", "/s", "/c", "npm run build"] : ["run", "build"];
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      PAGES_BUILD: "1",
      NEXT_PUBLIC_STATIC_MODE: "1",
      NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? "/oneearth",
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://berkantkull.github.io/oneearth",
    },
  });
  if (result.error) console.error(result.error);
  if (result.status !== 0) process.exitCode = result.status ?? 1;
} finally {
  for (const route of routes) {
    const stored = join(backup, route);
    if (existsSync(stored)) renameSync(stored, join(root, "src", "app", route));
  }
  rmSync(backup, { recursive: true, force: true });
}
