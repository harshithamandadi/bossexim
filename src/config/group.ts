/**
 * BOSS Group page content — from the client's BOSS Group documents and the
 * second resource pack (BOSS Container Line brochure and website, BOSS
 * Australia website, BOSS footprint map).
 */
import type { Feature, ImageAsset, ProseContent, SectionContent } from "@/types/content";

export const groupIntro: ProseContent = {
  heading: {
    eyebrow: "BOSS Group",
    title: "The strength and range behind BGEXIM.",
  },
  paragraphs: [
    "Founded in 2000, BOSS Group has grown over more than two decades into a well-diversified business group with operations across India and Australia — spanning logistics, retail, construction, hospitality, real estate, e-Commerce, IT and BPO.",
    "In India, the Group is active in construction, hospitality, BPO, IT and IT-enabled services, with a strategic focus on developing an exclusive land bank for investors. In Australia, its operations cover fuel stations with convenience stores, commercial and residential construction, retail, hospitality, e-Commerce and IT services.",
    "For BGEXIM, the most direct strategic support comes from BOSS Container Line and the wider logistics network. The Group’s diversified background gives BGEXIM access to practical business knowledge, international relationships and operational capability across multiple sectors and markets.",
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
    eyebrow: "BOSS Group · Shipping & logistics",
    title: "BOSS Container Line",
    description:
      "A registered NVOCC simplifying global logistics through integrated, cost-effective shipping solutions — backed by 40+ years of combined industry experience in its team.",
  },
  paragraphs: [
    "BOSS Container Line specialises in NVOCC services, freight forwarding, container trading and multimodal transport, connecting every point in the supply chain efficiently and reliably. Its presence across Southeast Asia and the Middle East, together with trusted carrier and agent partnerships, allows competitive pricing and customised solutions for diverse cargo needs.",
    "Beyond transportation, it provides value-added services including customs clearance, documentation and regular tracking updates — giving transparency and peace of mind throughout the shipment journey. For BGEXIM, this logistics capability means transactions are structured with a clear understanding of freight, routing and operational requirements.",
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
    eyebrow: "BOSS Container Line · Network",
    title: "Agents and offices across the trade lanes that matter.",
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
  testimonialsTitle: "What partners say",
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
    eyebrow: "Group Companies",
    title: "One group. Many strengths.",
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
    title: "From small beginnings to great heights.",
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
    title: "Growing with purpose, leading with integrity.",
    text: "At the heart of BOSS is the belief in people — employees, customers and the communities the Group serves. However far it has come, the Group stays approachable and down to earth: its journey is about building connections, delivering value and impacting lives.",
  },
  leadersTitle: "Group leadership",
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
    title: "Recognised for service, compliance and community.",
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
    title: "Real people. Real business.",
    description:
      "Leadership, business meetings, supplier visits, factory inspections, trade events, conferences, international business visits and BOSS Group activities.",
  },
  emptyLabel: "Photos coming soon",
  note: "Every image here shows genuine people, locations, products or business activity — real BGEXIM and BOSS photographs, not stock images.",
  close: "Close",
};
