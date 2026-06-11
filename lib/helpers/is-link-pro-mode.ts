const UPRANKLY_TOOLS_PATHS = [
  "/app/command-center",
  "/app/account",
  "/app/billing",
  "/app/usage",
  "/app/team",
];

export function isLinkProMode(pathname: string): boolean {
  return !UPRANKLY_TOOLS_PATHS.includes(pathname);
}
