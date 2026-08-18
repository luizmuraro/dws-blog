export const toggleItem = <T>(items: T[], item: T): T[] =>
  items.includes(item) ? items.filter((current) => current !== item) : [...items, item];
