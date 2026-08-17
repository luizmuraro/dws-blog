export function getLastName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);

  return parts[parts.length - 1] ?? '';
}

export function splitParagraphs(content: string): string[] {
  return content
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}
