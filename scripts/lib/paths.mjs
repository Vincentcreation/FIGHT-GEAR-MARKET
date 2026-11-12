import { existsSync, mkdirSync } from "fs";
import path from "path";

/**
 * Final output directory for screenshots/videos.
 * Prefer ARTIFACTS_DIR, else Cursor's /opt/cursor/artifacts when present, else ./artifacts.
 */
export function resolveArtifactsDir() {
  if (process.env.ARTIFACTS_DIR) {
    return path.resolve(process.env.ARTIFACTS_DIR);
  }
  if (existsSync("/opt/cursor/artifacts")) {
    return "/opt/cursor/artifacts";
  }
  return path.resolve("artifacts");
}

/**
 * Scratch/work directory for intermediate files.
 * Prefer OUTPUT_DIR, else <artifactsDir>/_work/<name>.
 */
export function resolveWorkDir(name, artifactsDir = resolveArtifactsDir()) {
  if (process.env.OUTPUT_DIR) {
    return path.resolve(process.env.OUTPUT_DIR);
  }
  return path.join(artifactsDir, "_work", name);
}

export function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
  return dir;
}
