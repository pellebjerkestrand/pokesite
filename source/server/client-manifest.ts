import manifest from "./client-manifest.json";

// NOTE: This method requires the client to be built before the server,
// but is much faster and safer at runtime than trying to load
// `./client-manifest.json` from the filesystem and parse its contents.

export const hydratorUrl = `/${manifest["client/hydrator.entry.ts"]}`;

export const styleUrls = Object.entries(manifest)
  .filter(([, url]) => url.endsWith(".css"))
  .map(([, url]) => `/${url}`);
