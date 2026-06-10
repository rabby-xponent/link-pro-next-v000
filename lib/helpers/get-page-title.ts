import { NAV_ITEMS } from "@/lib/config/nav-items";

const DEFAULT_PAGE_TITLE = "SEO Operating System";

export function getPageTitle(pathname: string): string {
  const match = NAV_ITEMS.find((item) => item.href === pathname);

  return match?.title ?? match?.label ?? DEFAULT_PAGE_TITLE;
}
