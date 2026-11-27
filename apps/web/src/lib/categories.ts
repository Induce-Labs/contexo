/**
 * Provisional Phase 1 category list from the PRD discussion.
 * Exact final list remains a product decision (PRD §9 / todo §14).
 */

export type CategoryDefinition = {
  id: string;
  name: string;
  description: string;
  /** Placeholder until live counts come from the API. */
  itemCount: number;
  previewLabels: string[];
};

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: "links",
    name: "Links",
    description: "Saved webpages organised by source",
    itemCount: 0,
    previewLabels: [],
  },
  {
    id: "images",
    name: "Images / Screenshots",
    description: "Images and screenshots you capture or upload",
    itemCount: 0,
    previewLabels: [],
  },
  {
    id: "texts",
    name: "Texts",
    description: "Selected text snippets with their source page",
    itemCount: 0,
    previewLabels: [],
  },
  {
    id: "pdfs",
    name: "PDFs",
    description: "PDF documents you save or upload",
    itemCount: 0,
    previewLabels: [],
  },
];

export function getCategoryById(id: string): CategoryDefinition | undefined {
  return CATEGORIES.find((category) => category.id === id);
}
