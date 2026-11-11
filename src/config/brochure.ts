/**
 * The product brochure (client request, Nov 2026): visitors pick products on the
 * Resources page and download a PDF of a cover page, About BOSS EXIM, About BOSS Group,
 * the selected products twelve to a page and a back cover with the company's details.
 * Product facts and contact details come from the admin; this file holds the wording around them.
 */

export const brochureContent = {
  /** Product cards per brochure page (client request, 11 Nov 2026). */
  productsPerPage: 12,
  /** Pages around the products: cover, About BOSS EXIM, About BOSS Group and the back cover. */
  fixedPages: 4,
  /** The product picker on the Resources page. */
  builder: {
    title: "Choose Your Products",
    description:
      "Select the products you’re interested in. Your brochure opens with an introduction to BOSS EXIM and BOSS Group, presents your products twelve to a page, each linked to its full details online, and closes with our contact details.",
    selectAll: "Select all",
    clear: "Clear",
    /** "3 of 42 selected" */
    selectedOf: "of",
    selected: "selected",
    download: "Download brochure",
    preparing: "Preparing your brochure…",
    emptyHint: "Select at least one product to download your brochure.",
    error: "We couldn’t prepare your brochure just now. Please try again in a moment.",
    /** "6-page PDF" */
    pages: "-page PDF",
  },

  /** Plain-text replies from the brochure link when it can't make one. */
  errors: {
    noProducts: "Choose at least one product for your brochure.",
    rateLimited: "Too many brochures requested. Please try again in a few minutes.",
  },

  /** Text printed in the PDF. */
  document: {
    fileName: "BOSS-EXIM-Brochure.pdf",
    title: "Product Brochure",
    /** On the cover, before the selected products' names. */
    featuring: "In this brochure",
    andMore: (count: number) => `and ${count} more`,
    aboutSection: "About Us",
    /** The About page's eyebrow (client mark-up, Nov 2026: no "Global"). */
    aboutEyebrow: "About BOSS EXIM",
    /** The About BOSS Group page, as on the website's BOSS Group page (client request, 11 Nov 2026). */
    groupSection: "BOSS Group",
    productsSection: "Products",
    productsEyebrow: "Our Products",
    productsTitle: "Products in This Brochure",
    /** "1–12 of 42" */
    productsCount: (from: number, to: number, total: number) => (from === to ? `${from} of ${total}` : `${from}–${to} of ${total}`),
    /** Button at the foot of each product page, to the website's Products page. */
    otherProducts: "Other Products",
    /** Link on each product card, to the product's page on the website. */
    viewOnline: "View details",
    whatWeDo: "What We Do",
    backCover: {
      title: "Let’s Trade Together",
      lead: "Tell us what you want to buy, sell or build. Every enquiry is reviewed by our team and answered with a reference number.",
      office: "Office",
      email: "Email",
      phone: "Phone / WhatsApp",
      online: "Online",
      group: "A BOSS Group company",
    },
  },
};
