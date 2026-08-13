// The PI's publication record spans two eras: current retina/vision research
// at UT Southwestern, and earlier microbial/comparative-genomics work from
// his PhD. That earlier work is real and stays in the full publications
// list, but it's no longer the lab's focus — so the site's visualizations
// (Home hero keyword diagram, Publications PCA plot) are scoped to the
// vision-era papers only, via this keyword allow-list. A paper carrying any
// keyword from this set is treated as pre-vision/genomics-era and excluded
// from those visuals. Extend this list (not per-paper flags) if a keyword
// from that earlier era shows up on a new entry.
const PRE_VISION_KEYWORDS = new Set([
  'Mycobacterium',
  'Mycobacterium tuberculosis',
  'CRISPR-Cas',
  'Horizontal Gene Transfer',
  'Comparative Genomics',
  'Bacterial Genomics',
  'Proteogenomics',
  'Population Genomics',
  'Human Genetics',
  'Gut Microbiome',
  'Microbial Diversity',
  'Tuberculosis',
  'Symbiosis',
  'Methylotroph',
  'Copy Number Variation',
  'DNA-Binding Proteins',
  'Structural Biology',
  'Interactome',
  'Drug Target Discovery',
  'Infection Model',
  'Gene Expression Profiling',
  'Inflammation',
  'Lymph Node',
  'Iron Metabolism',
  'Adipocyte',
  'Gene Discovery',
]);

export function isVisionEra(keywords: string[]): boolean {
  return !keywords.some((k) => PRE_VISION_KEYWORDS.has(k));
}
