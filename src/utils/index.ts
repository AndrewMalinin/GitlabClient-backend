import { Worker, WorkerOptions } from "worker_threads";

export function importWorker(path: string, options: WorkerOptions) {
  const resolvedPath = require.resolve(path);
  return new Worker(resolvedPath, {
    ...options,
    execArgv: /\.ts$/.test(resolvedPath) ? ["--require", "ts-node/register"] : undefined,
  });
}