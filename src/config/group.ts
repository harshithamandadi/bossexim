/**
 * BOSS Group page content — from the client's BOSS Group documents and the
 * second resource pack (BOSS Container Line brochure and website, BOSS
 * Australia website, BOSS footprint map).
 */
import type { IconName } from "@/lib/icons";
import type { Feature, ImageAsset, ProseContent, SectionContent } from "@/types/content";

export const groupIntro: ProseContent = {
  heading: {
    eyebrow: "About BOSS Group",
    title: "The Strength and Range Behind BOSS EXIM",
  },
  paragraphs: [
    "BOSS EXIM is part of the wider BOSS Group, a diversified business ecosystem with activities across India and Australia. The Group’s interests span logistics, retail, construction, hospitality, IT, BPO and business services.",
    "For BOSS EXIM, the most direct strategic support comes from BOSS Container Line and the wider logistics network, which provides experience in NVOCC, freight forwarding, container trading, break bulk and other supply-chain activities.",
    "The Group’s diversified background gives BOSS EXIM access to practical business knowledge, international relationships and operational capability across multiple sectors and markets.",
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
  /** From the BOSS Container Line brochure (contact page). */
  phone?: string;
  email?: string;
}

/**
 * A BOSS Container Line service, with its own page at /boss-group/container-line/<slug>.
 * Copy: the client's service documents (final round, Oct 2026). Photos: the client's
 * Website Photos → BCLL. `description` is the short card text.
 */
export interface ContainerLineService extends Feature {
  slug: string;
  /** A few words for compact tiles, e.g. on the services overview. */
  tagline: string;
  image: ImageAsset;
  /** "contain" for illustrations on a white background, shown whole on a white panel. */
  imageFit?: "cover" | "contain";
  gallery: ImageAsset[];
  paragraphs: string[];
  highlightsTitle: string;
  highlights: string[];
}

const clImage = (file: string, alt: string, width: number, height: number): ImageAsset => ({
  src: `/images/group/container-line/${file}.webp`,
  alt,
  width,
  height,
});

export const containerLineServices: ContainerLineService[] = [
  {
    slug: "nvocc",
    title: "NVOCC",
    tagline: "Container line services as an NVOCC",
    description:
      "Non-Vessel Operating Common Carrier (NVOCC) services for reliable, efficient and cost-effective movement of containerised cargo across regional and international trade routes.",
    icon: "container",
    image: clImage("nvocc", "A container ship with cargo planes and lorries — sea, air and road connections", 1400, 514),
    gallery: [
      clImage("nvocc-2", "Container port with gantry cranes at golden hour", 1200, 675),
      clImage("nvocc-3", "Container ship at a port at sunset", 1200, 800),
    ],
    paragraphs: [
      "BOSS Container Line provides Non-Vessel Operating Common Carrier (NVOCC) services to support reliable, efficient and cost-effective movement of containerised cargo across regional and international trade routes.",
      "Working closely with shipping lines, freight partners, overseas agents, shippers and consignees, the company coordinates cargo movement from origin to destination without operating its own vessel fleet. Its strength lies in carrier relationships, container planning, routing knowledge and operational coordination.",
      "Services include booking coordination, container planning, documentation support, routing assistance, shipment monitoring and operational follow-up. Each shipment is planned based on cargo type, origin, destination, container requirement, transit expectations and commercial priorities.",
      "Through its network of offices, agents and logistics partners, BOSS Container Line supports cargo connectivity across India, Southeast Asia, the Middle East and other international markets.",
      "With a focus on reliability, responsiveness, transparency and clear communication, the company aims to make international container movement simpler, better coordinated and more dependable.",
    ],
    highlightsTitle: "Services",
    highlights: [
      "Booking coordination",
      "Container planning",
      "Documentation support",
      "Routing assistance",
      "Shipment monitoring",
      "Operational follow-up",
    ],
  },
  {
    slug: "freight-forwarding",
    title: "Freight Forwarding",
    tagline: "Sea, road, rail & air, door to door",
    description:
      "Freight-forwarding solutions for the efficient movement of cargo across domestic and international trade routes, planned around cargo type, route, transit time and commercial priorities.",
    icon: "route",
    image: clImage("freight-forwarding", "An open container of cartons with a forklift and a freight-forwarding checklist", 722, 542),
    imageFit: "contain",
    gallery: [
      clImage("freight-forwarding-2", "A loaded container and forklift in front of a world map with trade routes", 778, 702),
      clImage("freight-forwarding-3", "A handshake over a container ship, lorry and cargo plane", 570, 726),
    ],
    paragraphs: [
      "BOSS Container Line provides freight-forwarding solutions for the efficient movement of cargo across domestic and international trade routes. Services are planned according to cargo type, origin, destination, transit requirements and commercial priorities.",
      "The company coordinates with suppliers, transporters, ports, shipping lines, customs-related service providers, overseas agents and consignees to support smooth shipment execution.",
      "Depending on customer requirements, services can include freight booking, routing support, container planning, inland transportation, documentation coordination, port handling support, customs-related coordination and door-to-door logistics through suitable service partners.",
      "BOSS Container Line also supports multimodal movements involving combinations of sea, road, rail or air transportation where required.",
      "By focusing on efficient planning, clear communication, shipment visibility and reliable coordination, the team helps customers manage freight movements more effectively. The objective is simple: understand the cargo, identify a practical route, coordinate every stage and keep customers informed throughout the shipment journey.",
    ],
    highlightsTitle: "Services",
    highlights: [
      "Freight booking & routing support",
      "Container planning",
      "Inland transportation",
      "Documentation coordination",
      "Port handling & customs-related coordination",
      "Door-to-door & multimodal logistics",
    ],
  },
  {
    slug: "container-trading",
    title: "Trading",
    tagline: "Buy, sell or lease containers",
    description:
      "Container trading and leasing — buying, selling and leasing shipping containers and related equipment based on customer requirements and market availability.",
    icon: "arrow-left-right",
    image: clImage("container-trading", "Stacked shipping containers marked for container trading", 579, 765),
    imageFit: "contain",
    gallery: [
      clImage("container-trading-2", "A reach stacker lifting a red container at a depot", 945, 1200),
      clImage("container-trading-3", "A stack of shipping containers", 615, 802),
    ],
    paragraphs: [
      "BOSS Container Line provides container trading and leasing solutions focused on the buying, selling and leasing of shipping containers and related equipment based on customer requirements and market availability.",
      "The company supports shipping lines, freight forwarders, logistics providers, exporters, importers and other businesses requiring containers for transport, storage, project use or operational purposes.",
      "Depending on availability and agreed terms, solutions can include standard, used, refurbished and customised containers. Each requirement is evaluated based on container type, quantity, location, condition, intended use, delivery needs and commercial feasibility.",
      "Through practical experience in shipping and logistics markets, BOSS Container Line understands equipment sourcing, asset evaluation, repositioning, market demand and container availability across different locations.",
      "The focus is on transparent commercial terms, suitable equipment selection and reliable execution. Our approach is simple: understand the requirement, identify the right container solution, agree clear terms and complete the transaction efficiently.",
    ],
    highlightsTitle: "What We Offer",
    highlights: [
      "Buying and selling containers",
      "Container leasing",
      "Standard, used, refurbished and customised units",
      "Equipment sourcing and asset evaluation",
      "Repositioning support",
      "Transparent commercial terms",
    ],
  },
  {
    slug: "break-bulk-cargo",
    title: "Break Bulk",
    tagline: "Oversized & heavy cargo",
    description:
      "Break bulk solutions for oversized, heavy, irregular and non-containerised cargo that cannot be efficiently moved in standard containers.",
    icon: "anchor",
    image: clImage("break-bulk", "A general cargo ship loaded with break bulk cargo", 1400, 788),
    gallery: [
      clImage("break-bulk-2", "Ship cranes loading pipes and crated cargo at sea", 1200, 1200),
      clImage("break-bulk-3", "A cargo ship carrying steel pipes and machinery", 1200, 751),
    ],
    paragraphs: [
      "BOSS Container Line provides break bulk cargo solutions for oversized, heavy, irregular and non-containerised cargo that cannot be efficiently moved in standard containers.",
      "Typical cargo may include machinery, steel products, construction equipment, industrial components, heavy vehicles and large fabricated structures requiring specialised handling and planning.",
      "Each shipment is assessed individually based on cargo dimensions, weight, lifting requirements, origin, destination and delivery conditions. Services can include vessel-space coordination, loading arrangements, port handling, cargo securing, inland transportation and destination delivery support through suitable service partners.",
      "The company works closely with transporters, ports, terminals, vessel operators, stevedores and lifting contractors to support safe and coordinated cargo movement.",
      "With a focus on technical planning, commercial evaluation, safe handling and clear communication, BOSS Container Line aims to provide practical break bulk solutions from loading point to final destination.",
    ],
    highlightsTitle: "Typical Cargo",
    highlights: [
      "Machinery",
      "Steel products",
      "Construction equipment",
      "Industrial components",
      "Heavy vehicles",
      "Large fabricated structures",
    ],
  },
  {
    slug: "project-cargo",
    title: "Project Cargo",
    tagline: "Heavy, oversized & specialised shipments",
    description:
      "Project cargo logistics for heavy, oversized and specialised shipments that require planning beyond standard container transportation.",
    icon: "boxes",
    image: clImage("project-cargo", "Ship cranes lifting a large industrial vessel onto a multi-axle trailer", 1254, 1254),
    gallery: [
      clImage("project-cargo-2", "A heavy-lift cargo ship carrying industrial tanks at sea", 1200, 1200),
      clImage("project-cargo-3", "Two cranes over a busy cargo port", 1200, 800),
    ],
    paragraphs: [
      "BOSS Container Line provides project cargo logistics solutions for heavy, oversized and specialised shipments that require planning beyond standard container transportation.",
      "Project cargo can include industrial machinery, construction equipment, plant components, steel structures, engineering materials and other large-format cargo linked to infrastructure, manufacturing and commercial projects.",
      "Each movement is evaluated based on cargo dimensions, weight, origin, destination, lifting requirements, route conditions, port suitability and delivery timelines. Depending on the project, services can include inland transportation, port handling, ocean freight, break bulk movement, specialised equipment, warehousing, lifting support, documentation coordination and final delivery.",
      "The company works with carriers, transporters, terminals, agents and specialised handling partners to coordinate each stage of the movement.",
      "With a focus on careful planning, safe handling, cost visibility and operational control, BOSS Container Line delivers logistics solutions designed around the specific requirements of each project.",
    ],
    highlightsTitle: "Services",
    highlights: [
      "Inland transportation",
      "Port handling & ocean freight",
      "Break bulk movement",
      "Specialised equipment & lifting support",
      "Warehousing",
      "Documentation coordination & final delivery",
    ],
  },
  {
    slug: "3pl-and-warehousing",
    title: "Warehouse & 3PL",
    tagline: "Storage, handling & dispatch",
    description:
      "Warehouse and Third-Party Logistics (3PL) solutions connecting storage, cargo handling, transportation and shipment coordination through one integrated process.",
    icon: "warehouse",
    image: clImage("warehouse", "Warehouse racking with a forklift loading a lorry in front of a globe", 713, 601),
    imageFit: "contain",
    gallery: [
      clImage("warehouse-2", "A modern warehouse loading dock with a forklift and lorry", 1200, 900),
      clImage("warehouse-3", "Lorries at the loading bays of a modern warehouse", 1200, 900),
    ],
    paragraphs: [
      "BOSS Container Line provides warehouse and Third-Party Logistics (3PL) solutions that connect storage, cargo handling, transportation and shipment coordination through one integrated logistics process.",
      "Depending on customer requirements, services can include cargo receiving, short-term storage, inventory coordination, consolidation, deconsolidation, packing, labelling, dispatch planning and transport coordination.",
      "Its 3PL capabilities can also connect warehousing with inland transportation, freight forwarding, NVOCC services, port movement, documentation coordination and final delivery, helping customers manage cargo through a more organised supply-chain process.",
      "Solutions are planned according to cargo type, volume, location and handling requirements. This can support palletised goods, industrial products, raw materials, project cargo and other commercial shipments.",
      "With a focus on safe storage, inventory visibility, clear communication and timely cargo movement, BOSS Container Line works with suitable warehouse and logistics partners to coordinate cargo efficiently from receiving point to final destination.",
    ],
    highlightsTitle: "Services",
    highlights: [
      "Cargo receiving & short-term storage",
      "Inventory coordination",
      "Consolidation & deconsolidation",
      "Packing & labelling",
      "Dispatch planning",
      "Transport coordination",
    ],
  },
];

export function getContainerLineService(slug: string): ContainerLineService | undefined {
  return containerLineServices.find((service) => service.slug === slug);
}

export const containerLine: {
  heading: SectionContent;
  paragraphs: string[];
  motto: string;
  image: ImageAsset;
  services: ContainerLineService[];
} = {
  heading: {
    eyebrow: "Our Services",
    title: "Integrated Logistics, Origin to Destination",
    description:
      "The shipping and logistics vertical within the wider BOSS Group — NVOCC services, freight forwarding, container trading, break bulk cargo handling and related supply-chain support.",
  },
  paragraphs: [
    "BOSS Container Line is the shipping and logistics vertical within the wider BOSS Group. It provides integrated logistics solutions through NVOCC services, freight forwarding, container trading, break bulk cargo handling and related supply-chain support.",
    "Its operations are supported by offices in key locations and a wider network of international carrier and agent relationships. This gives the business the ability to coordinate container movement, ocean freight, customs-related support, documentation, tracking and destination logistics across multiple markets.",
    "For BOSS EXIM, this logistics capability is an important strategic advantage. International trading requires reliable cargo movement, documentation and coordination between suppliers, ports, carriers and buyers. Access to an experienced logistics ecosystem allows BOSS EXIM to structure transactions with a clearer understanding of freight, routing and operational requirements.",
  ],
  motto: "We connect global markets and empower success for businesses worldwide.",
  image: { src: "/images/group/container-line/main.webp", alt: "A BOSS Container Line container ship at sea", width: 1600, height: 724 },
  services: containerLineServices,
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
      phone: "+91 966 641 9979",
      email: "vvnrao@bossgrp.com",
    },
    {
      entity: "BOSS Container Line Sdn. Bhd.",
      city: "Klang, Malaysia",
      address: "903, 9th Floor, South Tower (A), BBT One, Bandar Bukit Tinggi, Klang 41200",
      phone: "+60 142 175 851",
      email: "rh.malaysia@bossgrp.com",
    },
    {
      entity: "BOSS Container Line LLP",
      city: "Hyderabad",
      address: "BOSS Towers, Street 2, Patrika Nagar, Madhapur, Hyderabad 500081",
      phone: "+91 966 641 9979",
      email: "vvnrao@bossgrp.com",
    },
    {
      entity: "BOSS Container Line LLP",
      city: "Navi Mumbai",
      address: "F-06, Nano Wing, Haware Fantasia Business Park, Vashi, Navi Mumbai 400705",
      phone: "+91 897 703 0047",
      email: "deepu.divakaran@bossgrp.com",
    },
    {
      entity: "BOSS Container Line LLP",
      city: "Gandhidham",
      address: "F-05, Plot No. 576, Ward 12/C, Adinath Arcade 2, Kachchh, Gandhidham 370201",
      phone: "+91 915 482 9363",
      email: "prakhar.patidar@bossgrp.com",
    },
    {
      entity: "BOSS Container Line LLP",
      city: "Chennai",
      address: "3rd Floor, No. 317/1 (Old 153/1), Thambu Chetty Street, George Town, Chennai 600001",
      phone: "+91 906 312 5762",
      email: "sales.chennai@bossgrp.com",
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
      "BOSS Group operates across a diversified portfolio of businesses including shipping and logistics, international trade, retail, construction, hospitality, technology, BPO and consumer services. Each vertical is supported by experienced teams, practical systems and a shared commitment to responsible growth, operational excellence, customer service and long-term business relationships.",
  },
  currentLabel: "You are here",
};

/** A period of the Group's journey, in the client's own groupings (Oct 2026). */
export interface JourneyPeriod {
  period: string;
  text: string;
  icon: IconName;
}

export interface Founder {
  name: string;
  role: string;
  photo: ImageAsset;
  /** Profile paragraphs; the first is shown, the rest open under "Read full profile". */
  bio: string[];
}

/** BOSS Group's journey, in the client's own periods (Our Journey document, Oct 2026). */
export const groupJourney: {
  heading: SectionContent;
  periods: JourneyPeriod[];
  values: { title: string; text: string };
} = {
  heading: {
    eyebrow: "Our Journey",
    title: "From Small Beginnings to Great Heights",
    description:
      "From a single retail outlet to a diversified ecosystem across retail, property, hospitality, logistics and international trade.",
  },
  periods: [
    { period: "2000 – 2003", text: "Established BOSS Group, opened the first Wollongong outlet in 2002, and began building a customer-focused retail platform that became the foundation for future expansion.", icon: "store" },
    { period: "2004 – 2007", text: "Entered Brisbane, established key fuel-industry relationships, relocated headquarters, strengthened operating systems and leadership, and built the management platform needed for wider business diversification and growth.", icon: "route" },
    { period: "2008 – 2011", text: "Expanded convenience retail operations, strengthened service-station capabilities, acquired additional sites and freeholds, and developed deeper experience in managing customer-facing assets, teams and operations at scale.", icon: "building" },
    { period: "2012 – 2015", text: "Reached more than ten operating sites, expanded across retail and property activities, earned business and community recognition, and strengthened BOSS Group’s diversified operating foundation further.", icon: "badge-check" },
    { period: "2016 – 2019", text: "Established major fuel partnerships, completed greenfield developments, expanded construction and property capabilities, and strengthened the Group’s operating network through disciplined investment and execution across markets.", icon: "handshake" },
    { period: "2020 – 2023", text: "Expanded into hospitality with its first hotel acquisition, entered medical centres and subdivisions, strengthened fuel partnerships, and launched BOSS Container Line in 2023, entering global logistics.", icon: "ship" },
    { period: "2024 – 2026", text: "Opened the Group’s first EV site, expanded logistics networks and container assets, strengthened global operations, and successfully established BOSS EXIM (Global) Private Limited in 2026.", icon: "globe" },
  ],
  values: {
    title: "Growing with Purpose, Leading with Integrity",
    text: "At the heart of BOSS is the belief in people — employees, customers and the communities the Group serves. However far it has come, the Group stays approachable and down to earth: its journey is about building connections, delivering value and impacting lives.",
  },
};

/** The founders of BOSS Group (Founders documents, Oct 2026). */
export const groupFounders: { heading: SectionContent; readProfile: string; showLess: string; founders: Founder[] } = {
  heading: {
    eyebrow: "Founders",
    title: "Built on Friendship, Trust and Shared Responsibility",
    description:
      "BOSS Group was founded by a group of friends who shared a common vision to stay connected, support one another and build meaningful businesses together. Coming from different professional and entrepreneurial backgrounds, the founders brought diverse experience, ideas and capabilities into one common platform. Over time, this foundation helped the Group expand across multiple industries and international markets — and the founders continue to shape its culture through their commitment to integrity, innovation, teamwork, disciplined execution and sustainable growth.",
  },
  readProfile: "Read full profile",
  showLess: "Show less",
  founders: [
    {
      name: "Prasad Kalla",
      role: "Chairman, BOSS Group",
      photo: { src: "/images/group/founders/prasad-kalla-portrait.webp", alt: "Prasad Kalla", width: 1000, height: 750 },
      bio: [
        "Mr. Prasad Kalla pursued his Master of Business Administration (MBA) at Victoria University of Technology, Melbourne, Australia — part of his motivation for coming to Australia was the opportunity to experience a different culture and environment first-hand. He migrated from Khammam in Andhra Pradesh, India, and has had the good fortune to work in many multicultural environments, in academic, business and social settings.",
        "Brought up in Andhra Pradesh, he studied in Karnataka for his engineering degree in Computer Science from Bangalore University, alongside people of many cultural backgrounds. Much of his experience has been in teams. Under his leadership, BOSS (Aust) Consulting Pty Ltd today operates 26 petrol and convenience stores under the BP banner, both freehold and leasehold, where he values cultural diversity in the workplace and works closely with people of different cultural and linguistic backgrounds.",
        "Mr. Prasad believes in building prosperity by supporting a broad range of causes through donation and sponsorship. He encourages employees to take part in social and charitable programmes, volunteers his own time, talent and resources for local community needs, employs local people, sources locally and strengthens the community — including contributions to religious organisations and to people affected by floods and other natural calamities.",
        "He continues to develop a workplace culture that is safe, professional and positive — one that values the skills of all staff, acknowledges their achievements, provides pathways for career development and enables a good balance with the responsibilities of work — and, under his leadership, BOSS Group creates more jobs for the local community, from customer service officers and managers to IT professionals.",
        "A gentle, down-to-earth person from a joint family of 40 members living together under one roof in India, he is regarded as respected, trustworthy and generous, and credits others for success while taking responsibility for failures. He created BOSS Group’s commercial success guidelines on a simple principle: work together, stay together — let the challenges come from anywhere, but the solutions will come from us. Nothing is more important to him than the safety of people and the environments in which the Group works.",
      ],
    },
    {
      name: "Krishna Prasad (Kris) Bodla",
      role: "CEO, BOSS Group (Australia)",
      photo: { src: "/images/group/founders/krishna-bodla-portrait.webp", alt: "Krishna Prasad (Kris) Bodla", width: 1000, height: 750 },
      bio: [
        "Kris Bodla serves as CEO of BOSS Group (Australia), bringing over two decades of visionary leadership to the organisation’s diverse operations across retail, property, construction, hospitality and more. His journey began in India, where he designed and implemented a comprehensive Management Information System at Srinivasa Hatcheries Group — an early demonstration of his ability to blend technology with business process improvement.",
        "In 2002, Kris co-founded BOSS Group Australia and has since played a critical role across every function, from operations and systems development to strategic growth. His hands-on leadership and adaptability have been instrumental in transforming BOSS Group into a resilient, multi-sector enterprise recognised in Forbes Australia and Convenience World magazine.",
        "Kris’s leadership philosophy is rooted in clear vision, integrity and empowerment. He fosters a culture of collaboration and continuous improvement, encouraging innovation and ownership at all levels while maintaining an unwavering focus on customer experience and ethical responsibility.",
        "A lifelong learner, he is deeply committed to mentoring the next generation of leaders. Outside work, Kris enjoys cricket, rugby, Indian music, travel and reading — interests that enrich his global perspective and keep him connected to both business and community.",
      ],
    },
    {
      name: "Sudhakar Chaluvadi",
      role: "Director, BOSS Group",
      photo: { src: "/images/group/founders/sudhakar-chaluvadi-portrait.webp", alt: "Sudhakar Chaluvadi", width: 1000, height: 750 },
      bio: [
        "Mr. Sudhakar Chaluvadi is a seasoned business leader with extensive exposure across multiple sectors, including Information Technology, Shipping and Logistics, Construction, Hospitality, Retail and Fuel Stations. His diverse industry background enables him to combine strong corporate management experience with a practical understanding of business operations across different markets.",
        "He spent more than 18 years with Wipro, where he held senior executive responsibilities and gained significant global experience in Business Operations, Delivery Management, People Supply Management and large-scale team leadership — managing and coordinating a workforce of nearly 8,000 professionals.",
        "His technology expertise includes extensive experience in ERP platforms, Microsoft technologies and enterprise delivery frameworks, supported by a strong understanding of both onshore and offshore execution models.",
        "Over the years, Mr. Sudhakar has applied his corporate experience to diversified business ventures, bringing a structured, process-driven and customer-focused approach to management. With a strong global outlook and cross-industry experience, he continues to contribute to the BOSS Group’s growth, diversification and long-term business development.",
      ],
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
  media: { title: string; image: ImageAsset }[];
  note: string;
  press: { label: string; href: string };
} = {
  heading: {
    eyebrow: "Recognition",
    title: "Recognised for Excellence and Service",
    description:
      "Over the years, BOSS Group’s journey has been recognised through several business and community awards, reflecting its commitment to excellence and service. Its entrepreneurial journey has also garnered media attention through newspaper features, business interviews and international publications, including Forbes Australia.",
  },
  items: [
    { title: "Commonwealth Bank and Brisbane Indian Times Multicultural Business and Community Award", year: "2012", image: { src: "/images/group/awards/multicultural-business-2012.webp", alt: "Commonwealth Bank and Brisbane Indian Times Multicultural Business and Community Award 2012 glass trophy", width: 560, height: 700 } },
    { title: "BP Buying Group — Compliance Winner", year: "2012", image: { src: "/images/group/awards/bp-buying-group-2012.webp", alt: "BP Buying Group Compliance Winner 2012 plaque", width: 560, height: 700 } },
    { title: "Andhra Pradesh Tourism — Best Hotel in Category Two", year: "2012", image: { src: "/images/group/awards/ap-tourism-best-hotel-2012.webp", alt: "Andhra Pradesh Tourism award trophy, World Tourism Day 2012", width: 467, height: 700 } },
    { title: "CIB Mayor’s Multicultural Youth Stipend — Son of the Year", year: "2014", image: { src: "/images/group/awards/multicultural-youth-2014.webp", alt: "Mayor’s Multicultural Youth Stipend frosted glass trophy", width: 560, height: 700 } },
    { title: "PMTDR Dealer Recognition Award", year: "2021", image: { src: "/images/group/awards/pmtdr-dealer-recognition-2021.webp", alt: "PMTDR Dealer Recognition Award presented to Shell Hatton Vale, 2021", width: 560, height: 700 } },
    { title: "Queensland Telugu Association — Platinum Sponsor", year: "2023", image: { src: "/images/group/awards/qld-telugu-association-2023.webp", alt: "Queensland Telugu Association trophy presented to BOSS Group, Platinum Sponsor 2022–2023", width: 675, height: 900 } },
    { title: "Department of Tourism, Andhra Pradesh — World Tourism Day", year: "2012", image: { src: "/images/group/awards/world-tourism-day-souvenir-2012.webp", alt: "Silver Charminar souvenir from the World Tourism Day celebrations, 27 September 2012", width: 675, height: 900 } },
    { title: "Khammam Kala Parishat — Recognition", year: "2012", image: { src: "/images/group/awards/khammam-kala-parishat-2012.webp", alt: "Bronze-framed recognition plaque from Khammam Kala Parishat, 2012", width: 900, height: 675 } },
    { title: "Vana Samaradhana — Community Recognition", year: "2011", image: { src: "/images/group/awards/vana-samaradhana-2011.webp", alt: "Community recognition trophy, 2011", width: 720, height: 900 } },
    { title: "Best Hotel Award — press coverage", year: "2012", image: { src: "/images/group/awards/best-hotel-press-2012.webp", alt: "Newspaper coverage of the Best Hotel award at the World Tourism Day celebrations, 2012", width: 745, height: 677 } },
    { title: "Finalist — Australian Fuel & Convenience Awards (Small Retailer)", year: "2023", image: { src: "/images/group/awards/afca-finalist-2023.webp", alt: "Letter shortlisting BOSS Australia as a finalist in the 2023 Australian Fuel and Convenience Awards", width: 475, height: 528 } },
    { title: "Shell Hatton Vale — Outstanding Performance Recognition", year: "2022" },
  ],
  media: [
    { title: "Featured in Convenience World magazine", image: { src: "/images/group/awards/convenience-world.webp", alt: "Convenience World magazine cover", width: 312, height: 443 } },
    { title: "“Compliance the BOSS in this group’s strategies” — industry feature", image: { src: "/images/group/awards/compliance-feature.webp", alt: "Magazine feature on BOSS Group’s compliance strategy", width: 283, height: 445 } },
    { title: "World Tourism Day celebrations, Andhra Pradesh, 2012", image: { src: "/images/group/awards/world-tourism-day-2012.webp", alt: "BOSS Group receiving the Best Hotel award at the World Tourism Day celebrations, 2012", width: 1000, height: 671 } },
  ],
  note: "International shipping and logistics later became another important milestone through BOSS Container Line. Today, BOSS Group is an ecosystem of businesses connected by common leadership, shared values, experienced teams and practical execution across international markets.",
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
      "Leadership interactions, business meetings, industry events, conferences, supplier and partner engagements, project activities, community initiatives and important Group milestones — along with selected media coverage, interviews, awards and international publications.",
  },
  emptyLabel: "Photos coming soon",
  note: "The focus remains on authentic photographs, event visuals and genuine business moments rather than generic imagery — a transparent view of the people, activities and relationships behind the Group’s growth.",
  close: "Close",
};

export type GroupVerticalSlug = "container-line" | "retail" | "constructions" | "hospitality" | "laundromats" | "it" | "bpo";

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
  /** The client's photographs of the business, shown as a gallery on its page. */
  photos?: ImageAsset[];
}

/**
 * The BOSS Group verticals, each with its own page (client feedback, Oct 2026).
 * Copy from the client's final vertical documents (Oct 2026); capability tiles from
 * the BOSS Australia website. Photos: the client's Website Photos.
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
        "The BOSS Group’s customer-facing retail vertical, focused on fuel, convenience services, food and beverage offerings, and everyday customer needs.",
    },
    intro: {
      heading: { eyebrow: "Retail", title: "A Convenient, Dependable Stop on Every Journey" },
      paragraphs: [
        "BOSS Retail represents the BOSS Group’s customer-facing retail vertical, focused on fuel, convenience services, food and beverage offerings, and everyday customer needs. The business reflects the Group’s practical experience in operating service-oriented retail environments where accessibility, consistency, customer care and operational efficiency are essential.",
        "BOSS Retail locations are designed to provide customers with a convenient and dependable experience, combining fuel services with selected retail and lifestyle facilities. Depending on the location, services may include fuel, convenience products, cafés, refreshments, ATMs, bottled gas, gift cards, vehicle-related support and other everyday essentials.",
        "Food and beverage services form an important part of the retail experience, with selected locations offering café or dining options for customers who want to refuel, refresh and continue their journey comfortably.",
        "The strength of BOSS Retail lies in disciplined day-to-day operations, responsive service, efficient systems and attention to customer expectations. Managing multiple retail touchpoints requires strong people management, inventory control, service standards and operational coordination.",
        "Through BOSS Retail, the Group continues to build practical experience in consumer services, retail management, customer relationships and operational excellence, supporting the wider BOSS Group’s diversified global business portfolio.",
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
    photos: [
      { src: "/images/group/retail/bp-forecourt-sunset.webp", alt: "A BP service station forecourt at sunset", width: 1400, height: 1050 },
      { src: "/images/group/retail/ampol-redbank.webp", alt: "Ampol Redbank service station at dusk", width: 1400, height: 931 },
      { src: "/images/group/retail/shell-forecourt.webp", alt: "A Shell forecourt lit up at night", width: 1400, height: 616 },
      { src: "/images/group/retail/convenience-store.webp", alt: "Inside a BOSS convenience store", width: 1400, height: 862 },
      { src: "/images/group/retail/bp-annerley.webp", alt: "BP Annerley at sunset", width: 1400, height: 955 },
      { src: "/images/group/retail/caltex.webp", alt: "A Caltex service station", width: 1400, height: 531 },
      { src: "/images/group/retail/ampol-aerial.webp", alt: "Aerial view of an Ampol fuel station", width: 1400, height: 800 },
      { src: "/images/group/retail/bp-boambee.webp", alt: "BP Boambee forecourt panorama", width: 1400, height: 502 },
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
        "The BOSS Group’s experience in commercial, residential, retail and property development across multiple markets.",
    },
    intro: {
      heading: { eyebrow: "Constructions", title: "Planning, Building and Long-Term Asset Creation" },
      paragraphs: [
        "BOSS Constructions represents the BOSS Group’s experience in commercial, residential, retail and property development across multiple markets. The vertical reflects practical capability in project planning, site development, procurement, contractor coordination, quality management and long-term asset creation.",
        "The Group’s construction portfolio includes projects undertaken through Suchakra InfraCon Pvt. Ltd., Suchakra Projects Pvt. Ltd. and Elite Construction & Projects. These activities cover commercial buildings, residential developments, retail spaces, offices, restaurants, warehouses and other property-related projects.",
        "Notable developments include BOSS Towers, a commercial property of more than 30,000 sq. ft., along with a range of residential projects delivered through the Group’s construction entities.",
        "BOSS Constructions brings together experience in site evaluation, feasibility assessment, project planning, procurement, vendor management, cost coordination, quality control, regulatory coordination and project execution.",
        "Successful construction depends on disciplined coordination between architects, engineers, contractors, suppliers, authorities and customers. The Group’s approach focuses on practical execution, responsible project management, quality and timely delivery. Through this vertical, BOSS Group continues to strengthen its experience in asset development, supplier management, project coordination and long-term value creation.",
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
    photos: [
      { src: "/images/group/constructions/boss-towers.webp", alt: "BOSS Towers, Hyderabad — a commercial property of more than 30,000 sq. ft.", width: 1400, height: 933 },
      { src: "/images/group/constructions/surya-complex.webp", alt: "Surya Complex, a commercial retail development", width: 1400, height: 933 },
      { src: "/images/group/constructions/kvr-pride.webp", alt: "KVR Pride, a commercial building", width: 1400, height: 1050 },
      { src: "/images/group/constructions/tulasi-kamal.webp", alt: "Tulasi Kamal, a residential apartment building", width: 960, height: 1200 },
      { src: "/images/group/constructions/tulasi-geetha.webp", alt: "Tulasi Geetha, a residential apartment building", width: 1400, height: 933 },
      { src: "/images/group/constructions/tulasi-lilac.webp", alt: "Tulasi Lilac, a residential apartment building", width: 1400, height: 933 },
      { src: "/images/group/constructions/tulasi-jasmine.webp", alt: "Tulasi Jasmine, a residential apartment building", width: 960, height: 1200 },
      { src: "/images/group/constructions/lawnton.webp", alt: "A residential development at Lawnton, Queensland", width: 1400, height: 1027 },
      { src: "/images/group/constructions/suburban-homes.webp", alt: "Aerial view of suburban homes built by the Group", width: 1400, height: 788 },
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
        "Hotels, motels, serviced accommodation and guest-focused hospitality businesses across multiple international markets.",
    },
    intro: {
      heading: { eyebrow: "Hospitality", title: "Dependable Service and Memorable Stays" },
      paragraphs: [
        "BOSS Hospitality represents the BOSS Group’s experience in hotels, motels, serviced accommodation and guest-focused hospitality businesses across multiple international markets. The vertical reflects the Group’s commitment to service quality, operational discipline and creating comfortable experiences for business travellers, families, tourists and long-stay guests.",
        "The Group’s hospitality portfolio includes a mix of hotels, motels, accommodation properties, banquet facilities, dining services and leisure-oriented stays. These operations require consistent attention to guest service, cleanliness, staff management, food and beverage, property maintenance and day-to-day execution.",
        "Notable hospitality assets include Budget Hotel, featuring 40 guest rooms, three banquet halls and a fine-dining restaurant, together with a wider portfolio of hotel, motel and accommodation properties managed across different markets. The Group also has international hospitality exposure through Agriturismo Cascina Cipressa.",
        "Managing hospitality businesses across diverse locations has strengthened the Group’s understanding of customer expectations, service cultures and operational environments.",
        "BOSS Hospitality is built around a simple philosophy: provide dependable service, maintain professional standards and create comfortable, memorable experiences for every guest.",
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
    photos: [
      { src: "/images/group/hospitality/budget-hotel-khammam.webp", alt: "Budget Hotel, Khammam", width: 1400, height: 933 },
      { src: "/images/group/hospitality/budget-hotel-karimnagar.webp", alt: "Budget Hotel, Karimnagar", width: 1400, height: 933 },
      { src: "/images/group/hospitality/eminence.webp", alt: "A city hotel tower at a downtown intersection", width: 1400, height: 788 },
      { src: "/images/group/hospitality/arkana-motor-inn.webp", alt: "Arkana Motor Inn on a sunny day", width: 1400, height: 788 },
      { src: "/images/group/hospitality/highfields-motel.webp", alt: "Highfields Motel entrance", width: 1400, height: 788 },
      { src: "/images/group/hospitality/motel-entrance.webp", alt: "A motel entrance and car park", width: 1400, height: 1019 },
      { src: "/images/group/hospitality/motel-room.webp", alt: "A modern motel room", width: 935, height: 502 },
      { src: "/images/group/hospitality/cascina-cipressa.webp", alt: "Agriturismo Cascina Cipressa, Italy", width: 1400, height: 1050 },
      { src: "/images/group/hospitality/cabin-village.webp", alt: "A cabin village at twilight after rain", width: 1400, height: 1050 },
    ],
  },
  {
    slug: "laundromats",
    name: "Laundromats",
    companyName: "BOSS Laundromats",
    menuDescription: "Self-service laundry, made convenient.",
    hero: {
      eyebrow: "BOSS Group · Consumer Services",
      title: "Laundromats",
      description:
        "The BOSS Group’s customer-focused self-service laundry vertical, designed to make everyday laundry more convenient, efficient and comfortable.",
    },
    intro: {
      heading: { eyebrow: "Laundromats", title: "Everyday Laundry, Made Convenient" },
      paragraphs: [
        "BOSS Laundromats represents the BOSS Group’s customer-focused self-service laundry vertical, designed to make everyday laundry more convenient, efficient and comfortable. The business combines modern equipment, practical facilities and reliable service to support individuals, families, students and working professionals.",
        "The laundromats are equipped with washers and dryers in different capacities, allowing customers to manage regular loads, bedding, towels and other larger laundry requirements. Selected machines may also include automatic soap and softener dispensing, while on-site laundry essentials can provide added convenience.",
        "Customer comfort is an important part of the experience. Depending on the location, facilities may include folding and pressing areas, comfortable seating and Wi-Fi, helping customers use their time productively while their laundry is being completed.",
        "The business places strong emphasis on cleanliness, equipment maintenance, service consistency and operational efficiency. Managing laundromat operations also strengthens the Group’s experience in consumer services, equipment-based businesses, vendor coordination and day-to-day facility management.",
        "BOSS Laundromats reflects the Group’s commitment to practical, customer-friendly services built around reliability, convenience, efficiency and care.",
      ],
    },
    capabilities: [
      {
        items: [
          { title: "Washers & Dryers", description: "Machines in different capacities — for regular loads, bedding, towels and larger items.", icon: "washing-machine" },
          { title: "Automatic Dispensing", description: "Soap and softener dispensed automatically on selected machines.", icon: "droplets" },
          { title: "Laundry Essentials", description: "On-site essentials for added convenience.", icon: "package" },
          { title: "Folding & Pressing", description: "Folding and pressing areas, depending on the location.", icon: "layers" },
          { title: "Seating & Wi-Fi", description: "Comfortable seating and Wi-Fi while the laundry is done.", icon: "sparkles" },
          { title: "Clean & Well-Maintained", description: "Strong emphasis on cleanliness, equipment maintenance and consistent service.", icon: "shield-check" },
        ],
      },
    ],
    photos: [
      { src: "/images/group/laundromats/beenleigh-1.webp", alt: "Laundrette @ Beenleigh shopfront", width: 1170, height: 724 },
      { src: "/images/group/laundromats/beenleigh-2.webp", alt: "Washers at Laundrette @ Beenleigh", width: 996, height: 724 },
      { src: "/images/group/laundromats/beenleigh-3.webp", alt: "Dryers and folding area at Laundrette @ Beenleigh", width: 1170, height: 724 },
      { src: "/images/group/laundromats/beenleigh-4.webp", alt: "Seating and washers at Laundrette @ Beenleigh", width: 996, height: 724 },
      { src: "/images/group/laundromats/redbank-1.webp", alt: "Laundrette @ Redbank shopfront", width: 914, height: 824 },
      { src: "/images/group/laundromats/redbank-2.webp", alt: "Washers, dryers and folding table at Laundrette @ Redbank", width: 1214, height: 824 },
      { src: "/images/group/laundromats/redbank-3.webp", alt: "Dryers and seating at Laundrette @ Redbank", width: 858, height: 692 },
      { src: "/images/group/laundromats/redbank-4.webp", alt: "Large-capacity washers at Laundrette @ Redbank", width: 1276, height: 692 },
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
        "The BOSS Group’s technology and digital-services vertical — software solutions, web platforms, mobile applications, digital services and IT-enabled operations.",
    },
    intro: {
      heading: { eyebrow: "IT", title: "Technology That Makes Business More Efficient and Connected" },
      paragraphs: [
        "BOSS IT represents the BOSS Group’s technology and digital-services vertical, supporting businesses through software solutions, web platforms, mobile applications, digital services and IT-enabled operations. The focus is on using technology to improve efficiency, communication, visibility and customer engagement.",
        "Its capabilities include web development, web applications, mobile applications, content management systems, e-commerce solutions, business applications, search engine optimisation, digital creative services and technology support. Solutions are designed around practical business requirements, with an emphasis on usability, reliability and scalability.",
        "Beyond development, BOSS IT supports digital processes that help organisations manage information, reduce manual work, improve reporting and strengthen day-to-day operations. Technology is also used to support recruitment-related systems, internal applications and other business-process requirements.",
        "As part of the wider BOSS Group ecosystem, BOSS IT helps connect people, systems and information across multiple business activities and locations.",
        "The vertical reflects a practical approach to innovation — using technology not for complexity, but to make businesses more efficient, responsive, connected and better equipped for growth.",
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
        "Business-process outsourcing and operational support — helping organisations manage people, processes and back-office functions in a structured, efficient and reliable manner.",
    },
    intro: {
      heading: { eyebrow: "BPO", title: "Simplify Routine Operations, Focus on Growth" },
      paragraphs: [
        "BOSS BPO represents the BOSS Group’s business-process outsourcing and operational support vertical, helping organisations manage people, processes and back-office functions in a structured, efficient and reliable manner.",
        "The business supports a range of functions including finance operations, human resources, recruitment, procurement, customer support, reporting and administration. By managing routine and process-driven activities with clear workflows and skilled teams, BOSS BPO helps organisations improve efficiency, consistency and operational visibility.",
        "Finance support can include account processing, reconciliations, invoice processing, payment coordination, financial reporting, budgeting and forecasting. Human-resource services may include recruitment, onboarding support, payroll coordination and employee administration.",
        "The vertical also supports procurement, vendor coordination, data management, customer-service processes and other operational requirements. BOSS BPO combines people, process discipline and technology-supported execution to reduce administrative complexity and improve productivity.",
        "Its approach is practical and performance-focused: simplify routine operations, improve response times, strengthen process control and allow organisations to focus more attention on strategy, customers and growth.",
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
  moreServices: "More Container Line Services",
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
