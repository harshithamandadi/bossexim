/**
 * BOSS Group page content — from the client's BOSS Group documents and the
 * second resource pack (BOSS Container Line brochure and website, BOSS
 * Australia website, BOSS footprint map).
 */
import type { Feature, ImageAsset, ProseContent, SectionContent } from "@/types/content";

export const groupIntro: ProseContent = {
  heading: {
    eyebrow: "About BOSS Group",
    title: "A Diversified Group Across India and Australia",
  },
  paragraphs: [
    "Founded in 2000, BOSS Group has grown over more than two decades into a well-diversified business group with operations across India and Australia — spanning logistics, retail, construction, hospitality, real estate, e-Commerce, IT and BPO.",
    "In India, the Group is active in construction, hospitality, BPO, IT and IT-enabled services, with a strategic focus on developing an exclusive land bank for investors. In Australia, its operations cover fuel stations with convenience stores, commercial and residential construction, real estate, hospitality, e-Commerce and IT services.",
    "BOSS Group’s strength lies in its commitment to customer satisfaction, operational excellence and sustainable growth. With dedicated teams and a global vision, the Group continues to innovate, diversify and contribute to the markets and communities it serves.",
  ],
};

export interface Testimonial {
  quote: string;
  company: string;
}

export interface NetworkRegion {
  region: string;
  places: string[];
}

export interface Office {
  entity: string;
  city: string;
  address: string;
}

export const containerLine: {
  heading: SectionContent;
  paragraphs: string[];
  motto: string;
  image: ImageAsset;
  services: Feature[];
} = {
  heading: {
    eyebrow: "Our Services",
    title: "Integrated Logistics, Origin to Destination",
    description:
      "A registered NVOCC simplifying global logistics through integrated, cost-effective shipping solutions — backed by 40+ years of combined industry experience in its team.",
  },
  paragraphs: [
    "BOSS Container Line specialises in NVOCC services, freight forwarding, container trading and multimodal transport, connecting every point in the supply chain efficiently and reliably. Its presence across Southeast Asia and the Middle East, together with trusted carrier and agent partnerships, allows competitive pricing and customised solutions for diverse cargo needs.",
    "Beyond transportation, it provides value-added services including customs clearance, documentation and regular tracking updates — giving transparency and peace of mind throughout the shipment journey. Its dedicated team upholds international logistics standards, with a commitment to long-term relationships and its customers’ growth.",
  ],
  motto: "We connect global markets and empower success for businesses worldwide.",
  image: {
    src: "/images/group/container-line-port.webp",
    alt: "Port cranes loading a container ship",
    width: 1200,
    height: 589,
  },
  services: [
    {
      title: "NVOCC",
      description:
        "Dependable line services with a customer-focused approach — documents for customs and harbour services, liaison with local and port authorities, handling of goods, freight collection and contact with shippers and receivers.",
      icon: "container",
    },
    {
      title: "Freight Forwarding",
      description:
        "From basic transportation to major logistics projects through a global partner network — air and ocean freight on a door-to-door basis, including regulatory requirements, to internationally accepted standards.",
      icon: "route",
    },
    {
      title: "Container Trading",
      description:
        "New, used, refurbished and customised containers for sale or lease to shipping lines and logistics providers — including containers cleared by customs for domestic and onshore use.",
      icon: "arrow-left-right",
    },
    {
      title: "Break Bulk Cargo",
      description:
        "Oversized or irregular cargo that cannot fit standard containers — steel, machinery, construction equipment and vehicles, loaded individually in crates, drums or directly onto vessels.",
      icon: "anchor",
    },
    {
      title: "Project Cargo",
      // DRAFT — the client's document asks us to write this service's copy; confirm with the client.
      description:
        "Planned movement of heavy, high-value and time-critical project shipments — route and equipment planning, carrier and port coordination, documentation and on-site follow-up from origin to final delivery.",
      icon: "boxes",
    },
    {
      title: "3PL & Warehousing",
      description:
        "End-to-end warehouse and logistics solutions — inventory management, order fulfilment, cargo storage and transport coordination, aimed at minimising delays and optimising supply chains.",
      icon: "warehouse",
    },
  ],
};

/** BOSS Container Line's network ("Our Sectors") and offices, from its brochure and footprint map. */
export const containerLineNetwork: {
  heading: SectionContent;
  agreements: { done: number; inProgress: number; label: string; note: string };
  regions: NetworkRegion[];
  officesTitle: string;
  offices: Office[];
  website: { label: string; href: string };
  testimonialsTitle: string;
  testimonials: Testimonial[];
} = {
  heading: {
    eyebrow: "Network & Offices",
    title: "Agents and Offices Across the Trade Lanes That Matter",
    description:
      "Carrier and agent relationships across the Indian Subcontinent, Southeast Asia, the Middle East and Gulf, the Red Sea and Africa, and CIS markets — supported by offices in Singapore, Malaysia and India.",
  },
  agreements: {
    done: 31,
    inProgress: 1,
    label: "agency agreements in place",
    note: "with one more in progress",
  },
  regions: [
    { region: "Indian Subcontinent", places: ["Bangladesh", "India", "Sri Lanka"] },
    { region: "Southeast Asia", places: ["Indonesia", "Malaysia", "Singapore", "Thailand", "Vietnam"] },
    { region: "Middle East & Upper Gulf", places: ["Dubai", "Iraq", "Iran", "Kuwait", "Oman"] },
    {
      region: "Red Sea & Africa",
      places: ["Egypt", "Ethiopia", "Jordan", "Kenya", "Saudi Arabia", "Sudan", "Tanzania", "Yemen"],
    },
    { region: "CIS Destinations", places: ["Kazakhstan", "Kyrgyzstan", "Turkmenistan", "Uzbekistan"] },
    { region: "Other Locations", places: ["China", "Maldives", "Turkey"] },
  ],
  officesTitle: "Offices",
  offices: [
    {
      entity: "BOSS Container Line Pte. Ltd.",
      city: "Singapore",
      address: "133 New Bridge Road, #08-01, China Town Point, Singapore 059413",
    },
    {
      entity: "BOSS Container Line Sdn. Bhd.",
      city: "Klang, Malaysia",
      address: "903, 9th Floor, South Tower (A), BBT One, Bandar Bukit Tinggi, Klang 41200",
    },
    {
      entity: "BOSS Container Line LLP",
      city: "Hyderabad",
      address: "BOSS Towers, Street 2, Patrika Nagar, Madhapur, Hyderabad 500081",
    },
    {
      entity: "BOSS Container Line LLP",
      city: "Navi Mumbai",
      address: "F-06, Nano Wing, Haware Fantasia Business Park, Vashi, Navi Mumbai 400705",
    },
    {
      entity: "BOSS Container Line LLP",
      city: "Gandhidham",
      address: "F-05, Plot No. 576, Ward 12/C, Adinath Arcade 2, Kachchh, Gandhidham 370201",
    },
    {
      entity: "BOSS Container Line LLP",
      city: "Chennai",
      address: "3rd Floor, No. 317/1 (Old 153/1), Thambu Chetty Street, George Town, Chennai 600001",
    },
  ],
  website: { label: "www.bosscontainerline.com", href: "https://www.bosscontainerline.com" },
  testimonialsTitle: "What Partners Say",
  testimonials: [
    {
      quote:
        "The services are excellent. The team is always supportive and they consistently respond to emails. Their attention to detail and quick action have made our operations smooth and efficient. Truly a reliable partner and extremely satisfied with their professionalism.",
      company: "Esteem Shipping Services",
    },
    {
      quote:
        "Excellent container handling and customer support. They respond promptly. The team is experienced, polite, and efficient, ensuring every shipment goes smoothly. Dependable and professional service every time. We value this reliable partnership.",
      company: "Pentagon International Freight Solutions Pvt. Ltd.",
    },
    {
      quote:
        "From booking to execution, their service has been top notch. The support team is responsive and helpful. Their attention to client needs and dedication to timelines is commendable. A trusted name in the container logistics sector.",
      company: "Everfast Global Logistics Pvt. Ltd.",
    },
  ],
};

/** Headings for the group companies; the companies themselves are managed in the admin. */
export const groupCompanies: { heading: SectionContent; currentLabel: string } = {
  heading: {
    eyebrow: "Our Businesses",
    title: "One Group. Many Strengths",
    description:
      "Experience in logistics, customer service, project execution, hospitality, technology and business operations — across India, Australia and international markets.",
  },
  currentLabel: "You are here",
};

export interface Milestone {
  year: string;
  title: string;
}

export interface GroupLeader {
  name: string;
  role: string;
  bio: string;
}

/** BOSS Group's journey, mainly through BOSS Australia (from the BOSS Australia website). */
export const groupJourney: {
  heading: SectionContent;
  milestones: Milestone[];
  values: { title: string; text: string };
  leadersTitle: string;
  leaders: GroupLeader[];
} = {
  heading: {
    eyebrow: "Our Journey",
    title: "From Small Beginnings to Great Heights",
    description:
      "Built on trust and friendship, BOSS began as a shared vision among friends from real estate, construction, IT and hospitality — united by trust, integrity and a passion for building something meaningful.",
  },
  milestones: [
    { year: "2000", title: "BOSS established in Australia" },
    { year: "2002", title: "First outlet opened in Wollongong" },
    { year: "2004", title: "Entered Brisbane" },
    { year: "2005", title: "Relationship with BP established; headquarters in Brisbane" },
    { year: "2009", title: "First convenience store (SPAR)" },
    { year: "2014", title: "10+ sites in operation" },
    { year: "2016", title: "Relationship with AMPOL established" },
    { year: "2017", title: "First complete greenfield site (Hattonvale)" },
    { year: "2018", title: "Relationship with Shell established" },
    { year: "2019", title: "Greenfield site developed (AMPOL Wacol)" },
    { year: "2022", title: "Elite Construction & Projects established; first hotel acquired (Adelaide); relationship with Caltex" },
    { year: "2023", title: "Fuel volume of 75 ML a year; Elite completes its first project" },
    { year: "2024", title: "First EV site opened — BP Brackenridge" },
  ],
  values: {
    title: "Growing with Purpose, Leading with Integrity",
    text: "At the heart of BOSS is the belief in people — employees, customers and the communities the Group serves. However far it has come, the Group stays approachable and down to earth: its journey is about building connections, delivering value and impacting lives.",
  },
  leadersTitle: "Group Leadership",
  leaders: [
    {
      name: "Prasad Kalla",
      role: "Group Chairman",
      bio: "Leads the BOSS Group across India and Australia. His commercial guidelines for the Group rest on a simple principle: work together, stay together — let the challenges come from anywhere, the solutions will come from us.",
    },
    {
      name: "Krishna Prasad (Kris) Bodla",
      role: "Chief Executive Officer, BOSS Group (Australia)",
      bio: "Co-founded BOSS Group Australia in 2002 and brings over two decades of leadership across retail, property, construction and hospitality. Under his hands-on leadership the Group has been recognised in Forbes Australia and Convenience World magazine.",
    },
  ],
};

export interface Recognition {
  title: string;
  year: string;
  image?: ImageAsset;
}

export const groupRecognition: {
  heading: SectionContent;
  items: Recognition[];
  press: { label: string; href: string };
} = {
  heading: {
    eyebrow: "Recognition",
    title: "Recognised for Service, Compliance and Community",
    description: "Industry and community awards received by BOSS Group and its businesses.",
  },
  items: [
    {
      title: "Commonwealth Bank & Brisbane Indian Times Multicultural Business & Community Award",
      year: "2012",
      image: { src: "/images/group/award-multicultural-business-2012.jpg", alt: "Multicultural Business & Community Award 2012 trophy", width: 235, height: 257 },
    },
    {
      title: "BP Buying Group — Compliance Winner",
      year: "2012",
      image: { src: "/images/group/award-bp-buying-group-2012.jpg", alt: "BP Buying Group Compliance Winner 2012 award", width: 235, height: 345 },
    },
    {
      title: "Lord Mayor’s Multicultural Award",
      year: "2012",
      image: { src: "/images/group/award-lord-mayors-multicultural-2012.jpg", alt: "Lord Mayor’s Multicultural Award 2012", width: 235, height: 350 },
    },
    {
      title: "Shell Hatton Vale — Dealer Recognition Award for Excellence in Business Improvement",
      year: "2021",
      image: { src: "/images/group/award-shell-business-improvement-2021.jpg", alt: "Shell dealer recognition award 2021", width: 235, height: 324 },
    },
    {
      title: "QLD Telugu Association",
      year: "2023",
      image: { src: "/images/group/award-qld-telugu-association-2023.jpg", alt: "QLD Telugu Association 2023 trophy", width: 235, height: 388 },
    },
    {
      title: "Featured in Convenience World magazine",
      year: "2023",
      image: { src: "/images/group/feature-convenience-world-2023.jpg", alt: "Convenience World magazine cover, September 2023", width: 237, height: 388 },
    },
    { title: "Finalist — Australian Fuel & Convenience Awards", year: "2023" },
    { title: "Shell Hattonvale — Outstanding Performance", year: "2022" },
    { title: "National Award for outstanding commitment to disability and workplace safety", year: "" },
    { title: "Best Hotel in Category Two — Department of Tourism, Andhra Pradesh", year: "2012" },
  ],
  press: {
    label: "Read the Forbes Australia feature",
    href: "https://www.forbes.com.au/brand-voice/forbes-profile/four-entrepreneurs-share-founder-journey/",
  },
};

/** Headings for the Media & Events page; the galleries are managed in the admin. */
export const mediaEvents: { heading: SectionContent; emptyLabel: string; note: string; close: string } = {
  heading: {
    eyebrow: "Media & Events",
    title: "Real People. Real Business",
    description:
      "Leadership, business meetings, supplier visits, factory inspections, trade events, conferences, international business visits and BOSS Group activities.",
  },
  emptyLabel: "Photos coming soon",
  note: "Every image here shows genuine people, locations, products or business activity — real BGEXIM and BOSS photographs, not stock images.",
  close: "Close",
};

export type GroupVerticalSlug = "container-line" | "retail" | "constructions" | "hospitality" | "it" | "bpo";

export interface CapabilityGroup {
  title?: string;
  items: Feature[];
}

export interface GroupVertical {
  slug: GroupVerticalSlug;
  /** Shown in headings and menus — without the "BOSS" prefix, per the client. */
  name: string;
  /** The company's name in the admin (Group companies), used to match its card. */
  companyName: string;
  menuDescription: string;
  hero: SectionContent;
  intro: ProseContent;
  capabilities: CapabilityGroup[];
}

/**
 * The BOSS Group verticals, each with its own page (client feedback, Oct 2026).
 * Copy from the client's BOSS Group documents and the BOSS Australia website —
 * kept concise, without store counts or individual locations, as the documents ask.
 * Container Line's page is built from `containerLine` and `containerLineNetwork` above.
 */
export const groupVerticals: GroupVertical[] = [
  {
    slug: "container-line",
    name: "Container Line",
    companyName: "BOSS Container Line",
    menuDescription: "NVOCC, freight forwarding, container trading & 3PL.",
    hero: {
      eyebrow: "BOSS Group · Shipping & Logistics",
      title: "Container Line",
      description:
        "A registered NVOCC simplifying global logistics through integrated, cost-effective shipping solutions — with offices in Singapore, Malaysia and India and 31 agency agreements across key trade lanes.",
    },
    intro: { heading: { title: "Container Line" }, paragraphs: [] },
    capabilities: [],
  },
  {
    slug: "retail",
    name: "Retail",
    companyName: "BOSS Retail",
    menuDescription: "Fuel and convenience retail in Australia.",
    hero: {
      eyebrow: "BOSS Group · Retail",
      title: "Retail",
      description:
        "The Group’s customer-facing retail business in Australia — fuel stations and convenience stores serving everyday needs with a focus on accessibility, service and operational efficiency.",
    },
    intro: {
      heading: { eyebrow: "Retail", title: "Something for Everyone, on Every Journey" },
      paragraphs: [
        "Every journey deserves a great pit stop. BOSS service stations across Australia are designed to offer something for everyone — daily commuters, road trippers and people simply passing through — with amenities from the basics to premium.",
        "Backed by strong systems and customer-centric policies, BOSS Retail offers premium fuel and daily essentials at affordable prices, working with leading fuel brands including BP, AMPOL, Shell and Caltex.",
      ],
    },
    capabilities: [
      {
        items: [
          { title: "Fuel Services", description: "Quality petrol and diesel for every vehicle, plus fast, easy fuelling with Caltex GO.", icon: "flame" },
          { title: "Food & Beverage", description: "BOSS Cafés, Wild Bean Cafés and restaurants — from coffee and pastries to hearty meals.", icon: "candy" },
          { title: "Convenience Services", description: "ATMs (including Bitcoin ATMs), bottled gas and gift cards, ready when customers are.", icon: "package" },
          { title: "Vehicle Support", description: "Trailer hire for short and long-term use, and workshop services from quick checks to minor repairs.", icon: "cog" },
          { title: "EV Charging", description: "The Group opened its first electric-vehicle charging site in 2024.", icon: "cable" },
          { title: "Comfort Stops", description: "Clean, well-maintained restrooms and a welcoming stop along the way.", icon: "sparkles" },
        ],
      },
    ],
  },
  {
    slug: "constructions",
    name: "Constructions",
    companyName: "BOSS Constructions",
    menuDescription: "Commercial and residential construction.",
    hero: {
      eyebrow: "BOSS Group · Construction",
      title: "Constructions",
      description:
        "Commercial, retail and residential construction across selected markets in India and Australia — building, developing and upgrading facilities, retail infrastructure and homes.",
    },
    intro: {
      heading: { eyebrow: "Constructions", title: "From Site Discovery to Project Handover" },
      paragraphs: [
        "BOSS Constructions brings together the Group’s experience in commercial, retail and property-related construction in India and Australia — including building and upgrading fuel stations and convenience stores with a focus on quality, compliance and efficiency.",
        "Through Elite Construction & Projects, a BOSS Group subsidiary with more than 15 years of experience, the Group delivers commercial and residential projects — handling everything from finding the right site to handing over the keys, with clear project costs and end values.",
      ],
    },
    capabilities: [
      {
        title: "What We Build",
        items: [
          { title: "Commercial", description: "Offices, retail stores, restaurants, warehouses, medical facilities and educational buildings.", icon: "building" },
          { title: "Residential", description: "Homes, townhouses, apartments, duplexes, villas and boutique builds.", icon: "layers" },
          { title: "Land Development", description: "Splitter blocks and multiple lots that make efficient use of land and add value.", icon: "ruler" },
        ],
      },
      {
        title: "How We Deliver",
        items: [
          { title: "Site Finding", description: "Market research, site evaluation, negotiation, due diligence and approvals.", icon: "search-check" },
          { title: "Project Management", description: "Budgeting, scheduling, quality control and stakeholder communication, end to end.", icon: "clipboard-check" },
          { title: "Turnkey Delivery", description: "Every phase from design to completion, handing over a facility ready for use.", icon: "badge-check" },
          { title: "Feasibility & Due Diligence", description: "Legal, financial, environmental and structural checks, with a clear financial roadmap.", icon: "scale" },
          { title: "Approvals & Civil Works", description: "Work sign-off, regulatory approvals and civil works, from groundwork to finishing.", icon: "hammer" },
          { title: "Sales Management", description: "Marketing and sales of completed properties to qualified buyers.", icon: "handshake" },
        ],
      },
    ],
  },
  {
    slug: "hospitality",
    name: "Hospitality",
    companyName: "BOSS Hospitality",
    menuDescription: "Hotels and motels in Australia, India and Italy.",
    hero: {
      eyebrow: "BOSS Group · Hospitality",
      title: "Hospitality",
      description:
        "Hotels, motels and accommodation in Australia, India and Italy — practical, accessible and customer-oriented hospitality near key transport points.",
    },
    intro: {
      heading: { eyebrow: "Hospitality", title: "A Perfect Stay for Every Journey" },
      paragraphs: [
        "A stay shapes the whole travel experience. Each BOSS property is thoughtfully designed and positioned in a desirable location, with easy access for road trips, business meetings or exploring local attractions.",
        "Hospitality goes beyond service — it is the essence of what the Group does. From arrival to departure, the focus is on an experience that meets and exceeds guests’ expectations, for a single night or an extended stay.",
      ],
    },
    capabilities: [
      {
        items: [
          { title: "Prime Locations", description: "Properties close to key transport points and local attractions.", icon: "route" },
          { title: "Easy Arrival", description: "Ample parking with seamless check-in and check-out.", icon: "badge-check" },
          { title: "24/7 Support", description: "Help whenever guests need it, so they can focus on their journey.", icon: "headset" },
          { title: "In-House Dining", description: "Restaurants serving authentic regional flavours.", icon: "wheat" },
          { title: "For Every Traveller", description: "Work or leisure — solo, couple or family.", icon: "users" },
          { title: "International", description: "Hotels and motels in Australia, India and Italy.", icon: "globe" },
        ],
      },
    ],
  },
  {
    slug: "it",
    name: "IT",
    companyName: "BOSS IT",
    menuDescription: "Digital systems and IT-enabled solutions.",
    hero: {
      eyebrow: "BOSS Group · Technology",
      title: "IT",
      description:
        "The Group’s technology capability — digital systems, business applications, recruitment-related technology and other IT-enabled solutions.",
    },
    intro: {
      heading: { eyebrow: "IT", title: "Technology for Faster, Clearer, Connected Business" },
      paragraphs: [
        "Technology plays an important role in modern business operations, communication, reporting and customer service. BOSS IT supports the Group with digital systems, business applications and IT-enabled solutions.",
        "Together with the Group’s BPO business, it works with 100+ professionals globally — empowering clients through smart systems, skilled talent and training.",
      ],
    },
    capabilities: [
      {
        items: [
          { title: "Digital Systems", description: "Systems that keep day-to-day operations running smoothly.", icon: "cpu" },
          { title: "Business Applications", description: "Applications for operations, communication and reporting.", icon: "layers" },
          { title: "Recruitment Technology", description: "Technology-led recruitment and staffing support.", icon: "users" },
          { title: "IT-Enabled Services", description: "Support and services delivered through skilled technology teams.", icon: "network" },
          { title: "Skilled Talent & Training", description: "Capable people, developed through continuous training.", icon: "book-open" },
          { title: "Data & Reporting", description: "Clear information for faster, better-informed decisions.", icon: "radar" },
        ],
      },
    ],
  },
  {
    slug: "bpo",
    name: "BPO",
    companyName: "BOSS BPO",
    menuDescription: "HR and finance operations outsourcing.",
    hero: {
      eyebrow: "BOSS Group · Business Process Outsourcing",
      title: "BPO",
      description:
        "Business process outsourcing that keeps HR and finance operations running efficiently — so businesses can focus on growth and strategy.",
    },
    intro: {
      heading: { eyebrow: "BPO", title: "We Handle the Numbers, You Focus on Growth" },
      paragraphs: [
        "Time-consuming functions such as HR and finance can pull a business away from its core. BOSS BPO takes over critical operational tasks — streamlining processes, reducing costs and boosting productivity.",
        "Expert teams keep HR and finance operations running seamlessly, without the stress or overheads of managing them in-house — whether for a small business looking to scale or a large enterprise seeking optimisation.",
      ],
    },
    capabilities: [
      {
        title: "HR Outsourcing",
        items: [
          { title: "Recruitment & Staffing", description: "From job postings to candidate screening — the whole hiring process.", icon: "users" },
          { title: "Payroll Management", description: "Accurate payroll, superannuation and tax deductions.", icon: "file-text" },
          { title: "Employee Relations", description: "Onboarding, performance reviews and employee engagement.", icon: "handshake" },
        ],
      },
      {
        title: "Finance Operations",
        items: [
          { title: "Account Processing", description: "Accounts payable and receivable, end to end.", icon: "clipboard-check" },
          { title: "Reconciliation", description: "Regular, precise reconciliation for up-to-date statements.", icon: "scale" },
          { title: "Invoice Processing", description: "Timely vendor and customer invoicing, without bottlenecks.", icon: "file-text" },
          { title: "Payment Management", description: "Payroll, vendor and tax payments, processed accurately and on time.", icon: "shield-check" },
          { title: "Finance Analytics", description: "Detailed reports and analysis for informed decisions.", icon: "radar" },
          { title: "Budgeting & Forecasting", description: "Accurate budgets and forecasts to plan ahead.", icon: "target" },
        ],
      },
    ],
  },
];

export const groupVerticalLabels = {
  services: "Our Services",
  otherVerticals: "More from BOSS Group",
};

/** Strips the "BOSS " prefix from a group company's name for headings (client request). */
export function withoutBossPrefix(name: string): string {
  return name.replace(/^BOSS\s+/, "");
}

export function getGroupVertical(slug: string): GroupVertical | undefined {
  return groupVerticals.find((vertical) => vertical.slug === slug);
}

/** The vertical page for a group company, matched by its admin name. */
export function getVerticalForCompany(companyName: string): GroupVertical | undefined {
  return groupVerticals.find((vertical) => vertical.companyName === companyName);
}
