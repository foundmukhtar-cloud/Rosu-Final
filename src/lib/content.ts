export const hero = {
  eyebrow: 'Real Estate Valuation · New York',
  title: 'Know what it’s worth.',
  body:
    'Independent appraisal management for lenders, owners, and institutions across New York.',
  cta: 'Explore our approach',
} as const;

export const uad = {
  eyebrow: 'Appraisal standard · UAD 3.6',
  title: 'Every assignment, built for UAD 3.6.',
  body:
    'ROSU reports are prepared natively for the Uniform Appraisal Dataset 3.6 — structured property data, consistent condition and quality ratings, and a digital record underwriters can follow from the first inspection to final delivery.',
  points: [
    'Structured property data',
    'Consistent condition ratings',
    'Underwriter-ready delivery',
  ],
} as const;

export const audience = {
  eyebrow: 'A valuation solution',
  title: 'A valuation solution for every need.',
  subtitle: 'Choose the perspective that fits your work.',
  cue: '03',
  options: [
    {
      id: 'lender',
      label: 'Lender',
      tag: 'GSE & Non-QM',
      headline: 'Audit-ready UAD 3.6 compliance',
      description:
        'Standardized property record schemas, strict condition grading, and verified comp grids that virtually eliminate post-delivery revision requests.',
      benefit: 'Minimizes underwriting review friction',
    },
    {
      id: 'broker',
      label: 'Broker',
      tag: 'Transaction Advisory',
      headline: 'Objective market valuation',
      description:
        'Rapid, independent valuation analyses, empirical comp grids, and neighborhood trend data to support pricing strategy and client representation.',
      benefit: 'Market clarity & pricing confidence',
    },
    {
      id: 'appraiser',
      label: 'Appraiser',
      tag: 'Valuation Network',
      headline: 'Professional partnership',
      description:
        'Fair appraisal compensation, realistic turn windows, and advanced cloud data tools designed by licensed appraisers who respect the discipline.',
      benefit: 'Streamlined local workflow',
    },
    {
      id: 'homeowner',
      label: 'Homeowner',
      tag: 'Private Clients',
      headline: 'Defensible valuation for your property',
      description:
        'Uncompromised, empirical property appraisals for estate planning, private acquisitions, refinancing, and municipal property tax appeals.',
      benefit: 'Fiduciary clarity and tax defense',
    },
    {
      id: 'other',
      label: 'Other',
      tag: 'Institutional & Legal',
      headline: 'Custom appraisal scope & litigation support',
      description:
        'Forensic property documentation, retrospective valuations, and qualified expert witness support for trust administration, probate, and commercial dispute resolution.',
      benefit: 'Defensible forensic records',
    },
  ],
} as const;

export const foundation = {
  eyebrow: 'HOW ROSU WORKS',
  title: 'People. Technology. Process.',
  subtitle:
    'Thoughtful appraisal expertise, supported by precise tools and a clear process.',
  cta: 'Our story',
  chapter: '04',
  pillars: [
    {
      id: 'people',
      number: '01',
      title: 'PEOPLE',
      lines: ['EXPERIENCE', 'JUDGMENT', 'LOCAL INSIGHT'],
      headline: 'Hyper-local certified appraisers',
      description:
        'No distant desk reviewers. Every assignment is conducted by state-certified valuation specialists with decades of neighborhood immersion.',
    },
    {
      id: 'technology',
      number: '02',
      title: 'TECHNOLOGY',
      lines: ['PRECISE TOOLS', 'ACCURATE DATA', 'GREATER CLARITY'],
      headline: 'UAD 3.6 native digital pipeline',
      description:
        'Direct integration with public records, deed registries, and geo-spatial boundaries verifies property attributes and comp sets in real time.',
    },
    {
      id: 'process',
      number: '03',
      title: 'PROCESS',
      lines: ['ORDER', 'REVIEW', 'DELIVERY'],
      headline: 'Mandatory two-tier peer review',
      description:
        'Every completed report undergoes secondary senior appraiser review before client submission, ensuring unassailable underwriting defense.',
    },
  ],
} as const;

export const regionalUpstate = {
  eyebrow: 'Upstate & Hudson Valley',
  title: 'Certified Valuations for Historic Estates & Acreage',
  body: 'Comprehensive appraisal for historic residences, waterfront parcels, and conservation acreage across the Hudson Valley—delivered to rigorous GSE and private client standards.',
  cue: 'Continue through New York',
} as const;

export const regionalCentral = {
  eyebrow: 'Central New York',
  title: 'Defensible Appraisals Across Central New York',
  body: 'Independent property valuations for single-family residences, craftsman architecture, and rural acreage with deep local market analysis.',
  cue: 'Continue through New York',
} as const;

export const regionalExpertiseLabels = {
  eyebrow: 'New York · Regional architecture expertise',
  regions: [
    {
      region: 'Hudson Valley',
      points: ['Historic estates', 'Stone foundations', 'Acreage'],
    },
    {
      region: 'Central New York',
      points: ['Resilient homes', 'Craftsman bungalows', 'Snow-bearing roofs'],
    },
    {
      region: 'New York City and Downstate',
      points: ['Brownstones', 'Pre-war masonry', 'Multifamily and high-rise buildings'],
    },
    {
      region: 'Western New York',
      points: ['Brick homes', 'Weather-resistant construction', 'Adaptive reuse'],
    },
  ] as const,
} as const;

export const propertyTypes = {
  eyebrow: 'New York City · Property Types',
  title: 'Every property. Properly understood.',
  body:
    'From brownstone homes to multifamily buildings and condominiums.',
  types: [
    {
      id: 'single-family',
      label: 'Single-family residence',
      headline: 'Townhouses, brownstones & historic estates',
      description:
        'Granular assessment of landmark preservation restrictions, original architectural elements, structural condition, and private outdoor amenity value.',
    },
    {
      id: 'multifamily',
      label: 'Multifamily residence',
      headline: 'Two-to-four unit & small apartment buildings',
      description:
        'Stabilized income approach modeling, market vs. in-place rent rolls, operating expense capitalization, and local rent stabilization laws.',
    },
    {
      id: 'condominium',
      label: 'Condominium',
      headline: 'High-rise condominiums & cooperative apartments',
      description:
        'Building financial strength audits, HOA reserve analyses, proprietary line comp matching, and elevation-specific light/air adjustments.',
    },
  ],
  cue: 'Scroll',
} as const;

export const cityHighrise = {
  eyebrow: 'New York City · High-Rise Valuation',
  title: 'A clearer view of the city.',
  body: '— Steel, glass, and value at every scale.',
  cue: 'Continue the city journey',
} as const;

export const valuationMethod = {
  eyebrow: 'From Property to Perspective',
  title: 'A clear path to a defensible value.',
  body:
    'Property detail, local evidence, and experienced review—brought together in one clear report.',
  cta: 'See how it works',
  progressLabel: 'Next: Start a conversation',
} as const;

export const closing = {
  eyebrow: 'Appraisal request',
  title: 'Request an appraisal.',
  lede:
    'Share a few details about the property. Our team will follow up with scope, timing and fee before the assignment is opened.',
  action: 'Request an appraisal',
  facts: [
    { term: 'Coverage', detail: 'New York City, Hudson Valley, Central New York and Upstate' },
    { term: 'Standard', detail: 'Prepared for UAD 3.6 from the first inspection' },
    { term: 'Methodology', detail: 'Empirical market evidence with independent dual-appraiser review' },
    { term: 'Turn Times', detail: '3–5 business days standard across all regional coverage areas' },
  ],
} as const;

export const chapters = [
  { index: 0, label: 'Skyline', targetVh: 0, sectionId: 'hero' },
  { index: 0.5, label: 'UAD 3.6', targetVh: 190, sectionId: 'uad' },
  { index: 1, label: 'Stakeholders', targetVh: 280, sectionId: 'audience' },
  { index: 2, label: 'How It Works', targetVh: 560, sectionId: 'approach' },
  { index: 3, label: 'Hudson Valley', targetVh: 840, sectionId: 'hudson-valley' },
  { index: 4, label: 'Central NY', targetVh: 1120, sectionId: 'central-ny' },
  { index: 5, label: 'Property Types', targetVh: 1680, sectionId: 'property-types' },
  { index: 7, label: 'Valuation Report', targetVh: 2100, sectionId: 'valuation-method' },
] as const;
