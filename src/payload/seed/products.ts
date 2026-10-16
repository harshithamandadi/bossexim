/**
 * Starting product catalogue (client's final structure, Oct 2026). Loaded by
 * `npm run seed`; edit in the admin after. Photos live in ./images and are
 * uploaded to the admin by the seed script.
 *   Exports — ./export-products.ts (client category text + Product Brochure specs).
 *   Imports — below (client's import documents).
 */
import type { ExportProduct, ImportProduct } from "@/types/content";
import { exportProducts } from "./export-products";

export type SeedProduct = (Omit<ExportProduct, "images"> | Omit<ImportProduct, "images">) & {
  /** Files in ./images, uploaded in this order. */
  photos?: { file: string; alt: string }[];
};

const paragraphs = (...items: string[]) => items.join("\n\n");

/** The client's aluminium scrap documentation list — shared by Used Beverage Cans. */
const SCRAP_DOCS = [
  "Pre-shipment inspection certificate (PSIC)",
  "Certificate of origin",
  "Material or grade certificate",
  "Weight certificate",
  "Third-party inspection report",
  "Radiation-free declaration",
  "Non-hazardous / contamination declaration",
  "Commercial invoice",
  "Packing list",
  "Bill of lading",
  "Insurance",
  "Environmental / import approvals",
];

/** The client's "Imports Other Import Products" document. */
const OTHER_IMPORTS =
  "BOSS EXIM supports sourcing of specialised products including Aluminium Foil Rolls, Clear Medical Bottles and Recycled Plastic Flakes according to customer specifications and intended applications.";
const OTHER_IMPORTS_DETAIL =
  "Buyers benefit from flexible international sourcing, supplier evaluation, quality verification and logistics coordination, with each transaction assessed for regulatory requirements, commercial feasibility, documentation and dependable supply.";

/** Import catalogue (into India). */
const importProducts: SeedProduct[] = [
  {
    slug: "polypropylene",
    photos: [{ file: "products/polypropylene.jpg", alt: "Polypropylene pellets in a grid of colours and shapes" }],
    name: "Polypropylene (PP)",
    direction: "import",
    category: "Polymers",
    icon: "package",
    summary: "Injection, raffia, film and fibre grades from international suppliers for Indian industry.",
    description: paragraphs(
      "BOSS EXIM sources Polypropylene (PP) from international suppliers for Indian industrial buyers. Depending on the application, grades can include Injection Grade, Raffia Grade, Film Grade, Fibre Grade and other buyer-specific formulations.",
      "PP is widely used in packaging, woven sacks, household products, automotive components, furniture, moulded products and industrial applications. Since performance differs by grade, we confirm key technical parameters such as melt flow index, application, brand, origin and manufacturer specification before purchase.",
      "All grades are sourced against the buyer’s confirmed technical and commercial requirement.",
    ),
    variants: ["Injection", "Raffia", "Film", "Fibre"],
    variantsLabel: "Grades",
    packaging: "25 kg manufacturer bags, palletised where required.",
    documentation: [
      "Manufacturer CoA",
      "TDS",
      "SDS / MSDS",
      "Certificate of origin",
      "Grade / specification certificate",
      "Commercial invoice",
      "Packing list",
      "Bill of lading",
      "Insurance certificate",
      "Indian import documentation",
    ],
  },
  {
    slug: "polyethylene",
    photos: [{ file: "products/polyethylene.jpg", alt: "Mounds of coloured plastic pellets" }],
    name: "Polyethylene (PE)",
    direction: "import",
    category: "Polymers",
    icon: "layers",
    summary: "HDPE, LDPE and LLDPE grades for packaging, film, moulding, pipes and industrial use.",
    description: paragraphs(
      "BOSS EXIM sources selected Polyethylene grades for Indian buyers, including HDPE, LDPE and LLDPE. These materials are widely used in packaging, film, containers, moulding, pipes, industrial products and other manufacturing applications.",
      "Depending on the buyer’s requirement, HDPE can include injection, blow moulding, film and pipe grades; LDPE can include film, coating and injection grades; and LLDPE can include film, rotomoulding and other application-specific grades.",
      "We work with suppliers to confirm brand, grade, melt flow, density, end-use suitability and technical specification before commercial confirmation.",
      "BOSS EXIM provides transaction-specific quotations based on grade, origin, quantity and delivery terms.",
    ),
    variants: ["HDPE", "LDPE", "LLDPE"],
    variantsLabel: "Grades",
    documentation: [
      "Manufacturer CoA",
      "TDS",
      "SDS / MSDS",
      "Certificate of origin",
      "Grade / specification certificate",
      "Commercial invoice",
      "Packing list",
      "Bill of lading",
      "Insurance",
      "Indian import documents",
    ],
  },
  {
    slug: "polyester-chips",
    photos: [{ file: "products/polyester-chips.jpg", alt: "Translucent polyester chips (PET resin pellets)" }],
    name: "Polyester Chips",
    direction: "import",
    category: "Polymers",
    icon: "shapes",
    summary: "Textile, film and PET/bottle-grade polyester chips for Indian textile, packaging and industrial buyers.",
    description: paragraphs(
      "BOSS EXIM sources selected Polyester Chips from international suppliers for Indian textile, film, packaging and industrial buyers. Potential grades can include textile grade, film grade, selected PET or bottle-grade material where available, and other buyer-specific industrial grades.",
      "Because product performance depends on technical properties, we confirm the manufacturer, grade, intrinsic viscosity, end-use, packaging and other specification parameters before finalising the transaction.",
      "All purchases are aligned with the customer’s required application and approved technical specification.",
    ),
    variants: ["Textile grade", "Film grade", "PET / bottle grade"],
    variantsLabel: "Grades",
    packaging: "Standard manufacturer export packaging suitable for container transport.",
    documentation: [
      "Manufacturer CoA",
      "Technical Data Sheet",
      "Safety Data Sheet",
      "Grade / specification report",
      "Intrinsic viscosity or technical test data",
      "Certificate of origin",
      "Commercial invoice",
      "Packing list",
      "Bill of lading",
      "Insurance",
      "Indian import / customs documentation",
    ],
  },
  {
    slug: "aluminium-scrap",
    photos: [{ file: "products/aluminium-scrap.jpg", alt: "Aluminium stock and scrap" }],
    name: "Aluminium Scrap",
    direction: "import",
    category: "Metal Scrap",
    icon: "recycle",
    summary: "Cable, extrusion, sheet, cast, UBC and formwork/Mivan scrap for Indian recyclers and foundries.",
    description: paragraphs(
      "BOSS EXIM sources selected Aluminium Scrap grades for Indian buyers, including cable scrap, extrusion scrap, sheet scrap, cast aluminium scrap, UBC – Used Beverage Can Scrap, aluminium formwork/Mivan scrap and other verified grades.",
      "Before purchase, we confirm the material grade, contamination level, weight basis, inspection standard and buyer’s recovery expectations. Where required, independent inspection can be arranged at origin before shipment.",
      "BOSS EXIM aims to work only with identifiable material, clear commercial terms and verifiable documentation to reduce quality and transaction risk.",
    ),
    variants: ["Cable", "Extrusion", "Sheet", "Cast", "UBC", "Formwork / Mivan"],
    variantsLabel: "Types",
    documentation: [
      "Pre-shipment inspection certificate (PSIC)",
      "Certificate of origin",
      "Material or grade certificate",
      "Weight certificate",
      "Third-party inspection report",
      "Radiation-free declaration",
      "Non-hazardous / contamination declaration",
      "Commercial invoice",
      "Packing list",
      "Bill of lading",
      "Insurance",
      "Environmental / import approvals",
    ],
  },
  {
    slug: "copper-scrap",
    photos: [{ file: "products/copper-scrap.jpg", alt: "Copper bars, wire coil and scrap" }],
    name: "Copper Scrap",
    direction: "import",
    category: "Metal Scrap",
    icon: "cable",
    summary: "Wire and cable, bare and high-grade, sheet and plate, and profile or busbar copper scrap.",
    description: paragraphs(
      "BOSS EXIM sources selected Copper Scrap for Indian recyclers, processors and industrial buyers. Product categories can include copper wire and cable scrap, bare or high-grade copper scrap, sheet and plate scrap, profile or busbar scrap and other verified industrial copper grades.",
      "Copper scrap has high value and requires careful verification of purity, composition, contamination and recovery. Before shipment, we confirm the agreed grade, inspection method, weight basis and buyer specifications. Third-party inspection or testing may be arranged where required.",
      "All copper scrap transactions are executed against clearly agreed specifications and documented commercial terms.",
    ),
    variants: ["Wire & cable", "Bare / high-grade", "Sheet & plate", "Profile / busbar"],
    variantsLabel: "Types",
    documentation: [
      "PSIC",
      "Certificate of origin",
      "Metal composition or grade certificate",
      "Recovery / purity report",
      "Inspection certificate",
      "Weight certificate",
      "Radiation or contamination declaration",
      "Environmental / import compliance documents",
      "Commercial invoice",
      "Packing list",
      "Bill of lading",
    ],
  },
  {
    slug: "iron-scrap",
    photos: [{ file: "products/iron-scrap.jpg", alt: "Steel bar stacks and a pile of iron scrap" }],
    name: "Iron Scrap",
    direction: "import",
    category: "Metal Scrap",
    icon: "hammer",
    summary: "HMS, shredded, plate and structural, and cast iron scrap for Indian mills, recyclers and foundries.",
    description: paragraphs(
      "BOSS EXIM sources selected Ferrous, Iron and Steel Scrap grades for Indian mills, recyclers, foundries and processors. Product categories can include HMS grades, shredded scrap, plate and structural scrap, cast iron scrap and other buyer-approved grades.",
      "Because ferrous scrap can vary significantly in size, composition, contamination and density, the buyer’s specification is confirmed before sourcing. Inspection, radiation checks and other verification can be coordinated where required by regulation or commercial agreement.",
      "BOSS EXIM focuses on clear grade definition, documented inspection and reliable shipping execution for every ferrous scrap transaction.",
    ),
    variants: ["HMS", "Shredded", "Plate & structural", "Cast iron"],
    variantsLabel: "Types",
    documentation: [
      "PSIC",
      "Certificate of origin",
      "Inspection certificate",
      "Grade / specification report",
      "Weight certificate",
      "Radiation-free declaration",
      "Explosive / ammunition-free declaration",
      "Environmental / import compliance documents",
      "Commercial invoice",
      "Packing list",
      "Bill of lading",
      "Insurance",
    ],
  },
  {
    slug: "stainless-steel-scrap",
    photos: [{ file: "products/stainless-steel-scrap.jpg", alt: "Stainless steel stock and scrap" }],
    name: "Stainless Steel Scrap",
    direction: "import",
    category: "Metal Scrap",
    icon: "cog",
    summary: "Stainless steel scrap in grades 202, 304 and 316, with composition reviewed before confirmation.",
    description: paragraphs(
      "BOSS EXIM sources selected Stainless Steel Scrap grades for Indian recyclers, processors and industrial buyers. Our initial focus can include commonly traded grades such as 202, 304 and 316, along with other buyer-approved stainless grades where suitable opportunities are available.",
      "Stainless steel scrap requires accurate grade identification because value and end-use depend on chemical composition, particularly nickel and chromium content. For this reason, material composition and grade are reviewed before commercial confirmation, and testing or third-party inspection can be arranged where required.",
      "BOSS EXIM aims to supply clearly identified, documented and buyer-approved stainless scrap grades.",
    ),
    variants: ["202", "304", "316"],
    variantsLabel: "Grades",
    documentation: [
      "PSIC",
      "Chemical composition or grade certificate",
      "Inspection certificate",
      "Certificate of origin",
      "Weight certificate",
      "Radiation or contamination declaration",
      "Environmental / import compliance documents",
      "Commercial invoice",
      "Packing list",
      "Bill of lading",
    ],
  },
  {
    slug: "used-beverage-cans",
    photos: [{ file: "products/used-beverage-cans.jpg", alt: "Used beverage cans and compressed aluminium bales" }],
    name: "Used Beverage Cans (UBC)",
    direction: "import",
    category: "Metal Scrap",
    icon: "recycle",
    summary: "Used aluminium beverage cans from suitable international suppliers, to agreed specifications.",
    description: paragraphs(
      "BOSS EXIM sources Copper Scrap, Aluminium Scrap, Used Beverage Cans, Iron Scrap and Steel Scrap from suitable international suppliers. We focus on agreed specifications, material quality, supplier verification, competitive commercial terms and coordinated shipping.",
      "Our structured approach helps buyers manage sourcing, inspection, documentation, logistics and import requirements through one transaction process.",
    ),
    documentation: SCRAP_DOCS,
  },
  {
    slug: "aluminium-foil-rolls",
    photos: [{ file: "products/aluminium-foil-rolls.jpg", alt: "Polished aluminium foil rolls" }],
    name: "Aluminium Foil Rolls",
    direction: "import",
    category: "Other Import Products",
    icon: "cylinder",
    summary: "Aluminium foil rolls sourced internationally to the customer’s specification and intended application.",
    description: paragraphs(OTHER_IMPORTS, OTHER_IMPORTS_DETAIL),
  },
  {
    slug: "medical-bottles-and-plastic-flakes",
    photos: [{ file: "products/medical-bottles-and-plastic-flakes.jpg", alt: "Clear medical bottles beside recycled plastic flakes" }],
    name: "Clear Medical Bottles & Recycled Plastic Flakes",
    direction: "import",
    category: "Other Import Products",
    icon: "milk",
    summary: "Clear medical bottles and recycled plastic flakes, sourced to the customer’s specification and application.",
    description: paragraphs(OTHER_IMPORTS, OTHER_IMPORTS_DETAIL),
  },
];

/** Exports first, then imports — each in the order of the client's structure. */
export const seedProducts: SeedProduct[] = [...exportProducts, ...importProducts];
