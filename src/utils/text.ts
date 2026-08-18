export const getLastName = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/);

  return parts[parts.length - 1] ?? '';
};

export const splitParagraphs = (content: string): string[] =>
  content
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
