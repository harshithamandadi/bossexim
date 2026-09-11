import { mainNavigation } from "@/config/navigation";

export interface LocalNavItem {
  id: string;
  label: string;
}

/** The in-page anchors for a route, taken from its menu group. */
export function getLocalNavItems(route: string): LocalNavItem[] {
  const group = mainNavigation.find((candidate) => candidate.href === route);
  if (!group) return [];

  return group.items.flatMap((item) => {
    const [path, id] = item.href.split("#");
    return path === route && id ? [{ id, label: item.label }] : [];
  });
}

export function isActivePath(pathname: string, href: string): boolean {
  const path = href.split(/[?#]/)[0] ?? href;
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}
