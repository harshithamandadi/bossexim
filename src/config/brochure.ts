/**
 * The product brochure (client request, Nov 2026): visitors pick products on the
 * Resources page and download a PDF of a cover page, About BOSS EXIM, one page per
 * selected product and a back cover with the company's details. Product facts and
 * contact details come from the admin; this file holds the wording around them.
 */

export const brochureContent = {
  /** The product picker on the Resources page. */
  builder: {
    title: "Choose Your Products",
    description:
      "Select the products you’re interested in. Your brochure opens with an introduction to BOSS EXIM, gives each product its own page with typical specifications, and closes with our contact details.",
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
    productsSection: "Products",
    /** Button at the foot of each product page, to the website's Products page. */
    otherProducts: "Other Products",
    /** Link beside the HSN code, to the product's page on the website. */
    viewOnline: "View online",
    whatWeDo: "What We Do",
    overview: "Overview",
    marketsTitle: "Key Markets",
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
