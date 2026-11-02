"""Builds the BOSS EXIM brochure (HTML) from the website's CMS database and config copy.

Usage: python build.py <project_root> <out_dir>
Then print <out_dir>/brochure.html to PDF with headless Chrome.
"""
import html
import sqlite3
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(sys.argv[1])
OUT = Path(sys.argv[2])
IMG = OUT / "img"
IMG.mkdir(parents=True, exist_ok=True)
PUBLIC = ROOT / "public"
db = sqlite3.connect(ROOT / "cms-data" / "bgexim.db")
db.row_factory = sqlite3.Row

e = html.escape


def img(rel: str, max_w: int = 900) -> str:
    """Downscaled JPEG copy of a public/ image, returned as a file URL."""
    src = PUBLIC / rel.lstrip("/")
    if src.suffix.lower() == ".png":
        return src.as_uri()
    dst = IMG / (rel.strip("/").replace("/", "_").rsplit(".", 1)[0] + f"_{max_w}.jpg")
    if not dst.exists():
        im = Image.open(src)
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA")
            bg = Image.new("RGB", im.size, "white")
            bg.paste(im, mask=im.split()[-1])
            im = bg
        else:
            im = im.convert("RGB")
        im.thumbnail((max_w, max_w * 2))
        im.save(dst, "JPEG", quality=80, optimize=True, progressive=True)
    return dst.as_uri()


# ── Content from the CMS ──────────────────────────────────────────────────────
company = db.execute("select * from company_details").fetchone()
markets = db.execute("select * from markets order by _order").fetchall()
group = db.execute("select * from group_companies order by _order").fetchall()
team = db.execute("select * from team_members order by _order").fetchall()


def products(direction):
    rows = db.execute("select * from products where direction=? order by _order", (direction,)).fetchall()
    out = []
    for p in rows:
        variants = [r["text"] for r in db.execute(
            "select text from products_texts where parent_id=? and path='variants' order by \"order\"", (p["id"],))]
        out.append({**dict(p), "variants": variants})
    return out


exports, imports = products("export"), products("import")

CATEGORY_ORDER = ["Rice & Grains", "Spices", "Pulses", "Vegetables", "Fresh Fruits", "Dehydrated Products", "Seafood",
                  "Manufactured Products", "Other Export Products", "Polymers", "Metal Scrap", "Other Import Products"]


def by_category(items):
    cats = {}
    for p in items:
        cats.setdefault(p["category"], []).append(p)
    return sorted(cats.items(), key=lambda kv: CATEGORY_ORDER.index(kv[0]) if kv[0] in CATEGORY_ORDER else 99)


# ── Building blocks ───────────────────────────────────────────────────────────
LOGO = """<svg class="mark" viewBox="0 0 272 174" aria-hidden="true"><defs>
<clipPath id="b{i}"><rect x="1" y="2" width="270" height="170"/></clipPath>
<mask id="g{i}"><rect width="272" height="174" fill="#fff"/><g fill="#000" stroke="#000" stroke-width="16"><rect x="1" y="2" width="92.3" height="170"/><circle cx="92.3" cy="45" r="46.7"/><circle cx="92.3" cy="129" r="46.7"/></g></mask>
<mask id="s{i}"><rect width="272" height="174" fill="#fff"/><rect x="0" y="39" width="58" height="14" fill="#000"/><rect x="0" y="118" width="58" height="13" fill="#000"/></mask>
<mask id="m{i}" maskUnits="userSpaceOnUse" x="0" y="0" width="272" height="174"><circle cx="185" cy="87" r="85" fill="#fff" mask="url(#g{i})"/><g clip-path="url(#b{i})" mask="url(#s{i})"><rect x="1" y="2" width="92.3" height="170" fill="#fff"/><circle cx="92.3" cy="45" r="46.7" fill="#fff"/><circle cx="92.3" cy="129" r="46.7" fill="#fff"/></g></mask>
</defs><rect width="272" height="174" fill="currentColor" mask="url(#m{i})"/></svg>"""
_logo_n = 0


def logo():
    global _logo_n
    _logo_n += 1
    return LOGO.replace("{i}", str(_logo_n))


page_no = 0


def page(body: str, section: str = "", cls: str = "") -> str:
    global page_no
    page_no += 1
    chrome = ""
    if section:
        chrome = f"""<header class="run"><span class="brand">{logo()}<b>BOSS</b>&nbsp;EXIM Global</span><span>{e(section)}</span></header>
<footer class="run"><span>www.bgexim.com</span><span>{page_no:02d}</span></footer>"""
    return f'<section class="page {cls}">{chrome}<div class="inner">{body}</div></section>'


def heading(eyebrow, title, lead=""):
    lead_html = f'<p class="lead">{e(lead)}</p>' if lead else ""
    return f'<div class="eyebrow">{e(eyebrow)}</div><h2>{e(title)}</h2>{lead_html}'


def paras(items):
    return "".join(f"<p>{e(t)}</p>" for t in items)


def num(n):
    return f'<span class="num">{n:02d}</span>'


# ── Pages ─────────────────────────────────────────────────────────────────────
pages = []

# 1. Cover
pages.append(page(f"""
<div class="cover-photo top" style="background-image:url('{img('/images/group/container-line/main.webp', 1600)}')"></div>
<div class="cover-shade"></div>
<div class="cover-top"><span class="brand big">{logo()}<span><b>BOSS</b> EXIM Global</span></span></div>
<div class="cover-text">
  <div class="eyebrow light">Company Profile &amp; Product Catalogue · 2026</div>
  <h1>Trade Beyond<br>Boundaries</h1>
  <p class="cover-lead">Connecting reliable suppliers, genuine buyers and international markets through structured sourcing,
  trading and supply-chain coordination.</p>
  <div class="cover-roles"><span>Merchant Exporter</span><span>Merchant Importer</span><span>Supply Chain Solutions</span></div>
</div>
<div class="cover-foot"><span>BOSS EXIM (Global) Pvt. Ltd. · A BOSS Group company</span><span>www.bgexim.com</span></div>
""", cls="cover"))

# 2. About + at a glance + contents
n_markets = len(markets) + 1  # plus India, the corporate base
pages.append(page(f"""
{heading("About BOSS EXIM Global", "Connecting Products, Markets and People")}
<div class="cols-2 about">
  <div>{paras([
    "BOSS EXIM (Global) Pvt. Ltd. is an international trading arm within the wider BOSS business ecosystem. BOSS EXIM is created to connect Indian products with global buyers and to source selected industrial products and recyclable materials from international markets for Indian customers.",
    "Our role is to identify genuine opportunities, study buyer requirements, find reliable suppliers, evaluate products, structure commercial terms and coordinate the trade process from enquiry to delivery. We aim to make international trading simple, organised and dependable for our business partners.",
    "Our current business focus includes agricultural products, polymers, industrial raw materials and ferrous and non-ferrous metals. However, BOSS EXIM is not limited to these products or to a fixed list of countries. We remain open to new opportunities where there is genuine demand, reliable supply, acceptable commercial value, logistics feasibility and regulatory compliance.",
    "Supported by the wider BOSS Group and its logistics capabilities, BOSS EXIM follows a disciplined approach built on transparency, quality verification, structured documentation, secured payment methods and long-term relationships.",
  ])}
  <p class="pull">Our goal is simple: to connect products, markets and people through trusted international trade.</p></div>
  <div>
    <div class="stats">
      <div><b>{len(exports)}</b><span>export products from India</span></div>
      <div><b>{len(imports)}</b><span>import products for Indian industry</span></div>
      <div><b>{n_markets}</b><span>core trade markets</span></div>
      <div><b>31</b><span>agency agreements through BOSS Container Line</span></div>
    </div>
    <div class="contents">
      <div class="eyebrow">Inside</div>
      <ol>
        <li>Vision, mission &amp; values</li><li>What we do</li><li>Why BOSS EXIM</li><li>How we work &amp; quality</li>
        <li>Global presence</li><li>Product portfolio</li><li>Export products</li><li>Import products</li>
        <li>Our team &amp; compliance</li><li>BOSS Group</li><li>Partner with us</li><li>Contact</li>
      </ol>
    </div>
  </div>
</div>
""", "About Us"))

# 3. Vision, mission, values
values = [
    ("Integrity", "We uphold honesty, transparency and ethical conduct in every business interaction."),
    ("Reliability", "We strive to honour our commitments and deliver on agreed terms and timelines."),
    ("Compliance", "We conduct international trade through recognised legal, customs and banking channels, in accordance with applicable regulations."),
    ("Quality", "We focus on agreed product specifications, appropriate verification and consistent quality standards."),
    ("Responsibility", "We assess commercial, operational and compliance risks before proceeding with transactions."),
    ("Partnership", "We build long-term, mutually beneficial relationships founded on trust, collaboration and repeat business rather than one-time transactions."),
]
pages.append(page(f"""
{heading("Vision, Mission & Values", "The Values That Guide Every Transaction")}
<div class="vm">
  <div class="vm-card"><img src="{img('/images/about/vision.webp', 400)}" alt=""><div><div class="eyebrow">Vision</div>
    <p>To build a trusted global trading network that connects quality products, reliable suppliers and genuine buyers across international markets.</p></div></div>
  <div class="vm-card"><img src="{img('/images/about/mission.webp', 400)}" alt=""><div><div class="eyebrow">Mission</div>
    <p>To simplify international trade through reliable sourcing, transparent commercial practices, structured transactions, quality verification and dependable supply-chain coordination.</p></div></div>
</div>
<p class="lead">Our values guide how we conduct every transaction and build lasting business relationships across international markets.</p>
<div class="grid-3 values">{"".join(f'<div class="tile">{num(i + 1)}<h4>{e(t)}</h4><p>{e(d)}</p></div>' for i, (t, d) in enumerate(values))}</div>
""", "Vision, Mission & Values"))

# 4. What we do: services + business model
services = [
    ("Merchant Export", "Selected products sourced from India for international buyers through a buyer-driven approach — planned around the product, quality, quantity, packaging, destination and documentation you need.",
     ["Rice, spices, pulses, fresh produce & seafood", "Dehydrated, manufactured & other food products", "Quality reports, certificates & inspection coordinated"]),
    ("Merchant Import", "Polymers and industrial raw materials sourced internationally for Indian buyers, based on confirmed grades, technical specifications and commercial requirements.",
     ["Polymers — PP, PE & polyester chips", "Copper, aluminium, UBC, iron & steel scrap", "Foil rolls, medical bottles & recycled plastic flakes"]),
    ("Supply Chain Solutions", "Documentation, inspection, banking and logistics coordinated through our logistics partners and trusted external specialists.",
     ["Backed by an established logistics network", "NVOCC, freight forwarding & break bulk", "Customs & shipment coordination"]),
    ("Global Sourcing", "Understanding the requirement, identifying suitable sources and verifying commercial and quality details before a trade is structured.",
     ["Supplier identification & verification", "Specification matching", "Structured, transparent transactions"]),
]
models = ["Global Sourcing & Trade Facilitation", "Principal Trading", "Structured / Back-to-Back Trading", "Supply Chain Coordination"]
pages.append(page(f"""
{heading("What We Do", "Four Ways We Move Trade Forward")}
<div class="grid-2 services">{"".join(
    f'<div class="tile svc">{num(i + 1)}<h3>{e(t)}</h3><p>{e(d)}</p><ul>{"".join(f"<li>{e(x)}</li>" for x in pts)}</ul></div>'
    for i, (t, d, pts) in enumerate(services))}</div>
<div class="band">
  <div class="eyebrow light">Our Business Model</div>
  <h3>A Flexible B2B Trading Model</h3>
  <p>BOSS EXIM operates through a flexible B2B trading model designed to connect reliable supply with genuine demand. We begin by
  understanding the buyer’s requirements — product, grade, quantity, destination, quality expectations and commercial terms — and
  coordinate documentation, inspection and logistics through the wider BOSS ecosystem and external partners where required.</p>
  <div class="chips light">{"".join(f"<span>{e(m)}</span>" for m in models)}</div>
</div>
""", "What We Do"))

# 5. Why BOSS EXIM + focus
strengths = ["Access to Indian and International Markets", "A Flexible Product Strategy", "Product and Supplier Verification",
             "Structured Documentation", "Secured Payment Methods", "Logistics Support Through the BOSS Network"]
criteria = ["Buyer demand", "Supplier reliability", "Product quality", "Commercial viability", "Logistics feasibility", "Payment security", "Regulatory requirements"]
pages.append(page(f"""
{heading("Why BOSS EXIM", "One Dependable Point of Contact")}
<div class="cols-2">
  <div>{paras([
    "BOSS EXIM combines international sourcing, market flexibility, structured transactions and access to established logistics capabilities. We work to understand both the buyer’s and the supplier’s requirements, and focus on long-term relationships with genuine buyers, reliable suppliers and strategic partners.",
    "For customers, this means one dependable point of contact for sourcing, trading, verification, documentation and supply-chain coordination.",
  ])}</div>
  <ul class="checks">{"".join(f"<li>{e(s)}</li>" for s in strengths)}</ul>
</div>
<div class="divider"></div>
{heading("Our Current Focus", "Two Clear Trade Directions")}
<div class="focus">
  <div class="tile"><div class="eyebrow">We export</div><p>Rice, spices, pulses, dehydrated products, fresh produce, seafood, jaggery, groundnuts and selected manufactured products — from India to the world.</p></div>
  <div class="tile mid"><div class="eyebrow">Core markets</div><p>{e(", ".join(["India"] + [m["short_name"] or m["name"] for m in markets]))}</p></div>
  <div class="tile"><div class="eyebrow">We import</div><p>Polymers, recyclable ferrous and non-ferrous metals, aluminium foil rolls, clear medical bottles and recycled plastic flakes — for Indian industry.</p></div>
</div>
<div class="divider"></div>
{heading("Beyond Our Current Focus", "Open to Genuine Opportunities",
         "We are not limited to our current categories or to a fixed list of countries. If a verified buyer requires a product outside our portfolio, our team studies the requirement, identifies suitable sources and proceeds when the transaction meets our standards on:")}
<div class="chips">{"".join(f"<span>{e(c)}</span>" for c in criteria)}</div>
<p class="pull">Focused Today &amp; Flexible for Tomorrow.</p>
""", "Why BOSS EXIM"))

# 6. How we work + quality
steps = [
    ("Understand", "We identify the product, grade, quantity, destination, timing, quality expectation and preferred commercial terms."),
    ("Source", "We study suitable sourcing options and identify suppliers who can meet the requirement."),
    ("Verify", "Buyer and supplier information, product specifications and commercial details are reviewed before we move to the next stage."),
    ("Structure", "We structure pricing, Incoterms, payment terms, inspection, documentation and delivery responsibilities."),
    ("Execute", "BOSS EXIM coordinates procurement, quality checks, documentation, banking arrangements, logistics and shipment."),
    ("Complete", "The transaction is monitored through delivery and payment closure."),
]
quality = [
    ("Manufactured Products", "For polymers and similar products, we may review the manufacturer CoA, TDS and technical data."),
    ("Agricultural Products", "Laboratory testing, phytosanitary documents, residue reports or other certificates may be required."),
    ("Scrap & Metals", "Grade verification, weight checks, PSIC, radiation or contamination declarations and third-party inspection may be relevant."),
    ("Independent Inspection", "Where necessary, independent surveyors, laboratories or inspection agencies can be involved."),
    ("Transaction Documents", "We also review the shipping, insurance, customs and transaction documentation required for the trade."),
    ("Verified Parties", "Buyer and supplier information is reviewed before any trade is executed."),
]
pages.append(page(f"""
{heading("How We Work", "Six Steps from Enquiry to Completion",
         "Every BOSS EXIM transaction begins with a clear understanding of the customer’s requirements. This process maintains clarity, accountability and commercial discipline throughout the transaction.")}
<div class="steps">{"".join(f'<div class="step"><span class="dot">{i + 1}</span><h4>{e(t)}</h4><p>{e(d)}</p></div>' for i, (t, d) in enumerate(steps))}</div>
<div class="divider"></div>
{heading("Quality & Verification", "Verify, Then Execute",
         "Depending on the product and transaction, we review buyer and supplier information, product specifications, available certificates, quality reports and commercial documentation before execution.")}
<div class="grid-3">{"".join(f'<div class="tile">{num(i + 1)}<h4>{e(t)}</h4><p>{e(d)}</p></div>' for i, (t, d) in enumerate(quality))}</div>
<p class="pull">Verify the product, verify the parties, verify the documents, then execute.</p>
""", "Trade Process"))

# 7. Global presence
tiers = [
    ("Corporate Base", "Our office, and a key sourcing and destination market.", ["Hyderabad, India"]),
    ("BOSS Group Logistics Presence", "BOSS Container Line offices in Singapore, Malaysia and four Indian port cities.",
     ["Singapore", "Klang, Malaysia", "Hyderabad", "Navi Mumbai", "Gandhidham", "Chennai"]),
    ("Core Trade Markets", "Where our trade is focused today.", ["India"] + [m["name"] for m in markets]),
    ("Extended Network", "31 agency agreements through BOSS Container Line, plus shipping relationships and logistics partners.",
     ["Indian Subcontinent", "Southeast Asia", "Middle East & Upper Gulf", "Red Sea & Africa", "CIS markets", "China, Maldives & Turkey"]),
]
pages.append(page(f"""
{heading("Our Global Presence", "From Our Base in India to an International Network",
         "India is our corporate base and a key sourcing and destination market. Our wider network extends through the BOSS Group, shipping relationships, logistics partners and agent networks across the Indian Subcontinent, Southeast Asia, the Middle East and Gulf, the Red Sea and Africa, CIS markets and other international destinations.")}
<img class="map" src="{img('/images/group/boss-group-presence.webp', 1600)}" alt="BOSS Group presence map">
<div class="grid-2 tiers">{"".join(
    f'<div class="tile">{num(i + 1)}<h4>{e(t)}</h4><p>{e(d)}</p><div class="chips sm">{"".join(f"<span>{e(p)}</span>" for p in places)}</div></div>'
    for i, (t, d, places) in enumerate(tiers))}</div>
<p class="note">We do not present every country as a BOSS EXIM office. We distinguish between our own corporate base, BOSS Group
logistics presence, core trade markets and extended network capability — so we can support opportunities even where we do not keep a dedicated office.
Buyers outside these markets are also supplied worldwide on request.</p>
""", "Global Presence"))

# 8. Portfolio overview
cat_desc = {
    "Rice & Grains": "Basmati, non-Basmati and broken rice.", "Spices": "Chillies, turmeric, cardamom, pepper & whole spices.",
    "Pulses": "Toor dal, red lentils, mung beans, chana dal.", "Vegetables": "Fresh onions, okra and green beans.",
    "Fresh Fruits": "Pomegranates, mangoes and chikoo.", "Dehydrated Products": "Dehydrated fruits and vegetables.",
    "Seafood": "Vannamei shrimp, tiger prawns, catla fish.", "Manufactured Products": "Areca & bagasse disposables, feed-grade soda.",
    "Other Export Products": "A2 ghee, jaggery and groundnuts.", "Polymers": "PP, PE and polyester chips.",
    "Metal Scrap": "Copper, aluminium, UBC, iron and steel.", "Other Import Products": "Foil rolls, medical bottles, plastic flakes.",
}


def overview(items):
    return "".join(
        f'<tr><td><b>{e(c)}</b><div class="mute">{e(cat_desc.get(c, ""))}</div></td><td>{e(", ".join(p["name"] for p in ps))}</td><td class="c">{len(ps)}</td></tr>'
        for c, ps in by_category(items))


pages.append(page(f"""
{heading("Product Portfolio", f"{len(exports) + len(imports)} Products, Two Trade Directions",
         "Our current portfolio is a clear starting point. Typical specifications follow on the next pages; exact values, grades and packaging are agreed for each transaction.")}
<h3 class="dir"><span class="tag">Exports</span> From India to the world</h3>
<table class="ov"><thead><tr><th>Category</th><th>Products</th><th class="c">Lines</th></tr></thead><tbody>{overview(exports)}</tbody></table>
<h3 class="dir"><span class="tag imp">Imports</span> From the world to Indian industry</h3>
<table class="ov"><thead><tr><th>Category</th><th>Products</th><th class="c">Lines</th></tr></thead><tbody>{overview(imports)}</tbody></table>
""", "Product Portfolio"))


# 9+. Product catalogue pages, six cards per page
def card(p):
    photo = PUBLIC / "images" / "cms" / "products" / f"{p['slug']}.jpg"
    pic = f'<div class="pic" style="background-image:url(\'{img(f"/images/cms/products/{p["slug"]}.jpg", 700)}\')"></div>' if photo.exists() else '<div class="pic empty"></div>'
    hs = f'<span class="hs">HSN {e(p["hs_code"])}</span>' if p["hs_code"] else ""
    variants = p["variants"][:6]
    var_html = f'<div class="chips sm">{"".join(f"<span>{e(v)}</span>" for v in variants)}</div>' if variants else ""
    pack = f'<div class="pack"><b>Packaging:</b> {e(p["packaging"])}</div>' if p["packaging"] else ""
    return f"""<article class="card">{pic}<div class="body">
<div class="meta"><span class="eyebrow">{e(p['category'])}</span>{hs}</div>
<h4>{e(p['name'])}</h4><p>{e(p['summary'] or '')}</p>{var_html}{pack}</div></article>"""


def catalogue(items, title, eyebrow, lead):
    ordered = [p for _, ps in by_category(items) for p in ps]
    chunks = [ordered[i:i + 6] for i in range(0, len(ordered), 6)]
    for k, chunk in enumerate(chunks):
        head = heading(eyebrow, title, lead) if k == 0 else f'<div class="eyebrow">{e(eyebrow)} · continued</div>'
        pages.append(page(f'{head}<div class="cards">{"".join(card(p) for p in chunk)}</div>', title))


catalogue(exports, "Export Products", "From India to the World",
          "Selected Indian products for international buyers — planned around the product, quality, quantity, packaging, destination and documentation you need.")
catalogue(imports, "Import Products", "From the World to Indian Industry",
          "Polymers and industrial raw materials sourced internationally for Indian buyers, based on confirmed grades, technical specifications and commercial requirements.")

# Team + compliance
regs = [("CIN", "Corporate Identity Number", "Ministry of Corporate Affairs", "registrations_cin"),
        ("PAN", "Permanent Account Number", "Income Tax Department", "registrations_pan"),
        ("GST", "Goods & Services Tax Identification Number", "GST Network", "registrations_gst"),
        ("IEC", "Importer-Exporter Code", "Directorate General of Foreign Trade", "registrations_iec"),
        ("RCMC", "Registration-cum-Membership Certificate", "Export Promotion Council", "registrations_rcmc"),
        ("ISO", "ISO Certification", "Accredited certification body", "registrations_iso"),
        ("AD Code", "Authorised Dealer Code", "Authorised dealer bank, registered with Customs", "registrations_ad_code")]


def team_card(m):
    slug = m["name"].lower().replace(" ", "-").replace(".", "")
    photo = f"/images/cms/team/{slug}-portrait.jpg"
    pic = f'<img src="{img(photo, 500)}" alt="">' if (PUBLIC / photo.lstrip("/")).exists() else ""
    bio = (m["bio"] or "").split("\n\n")[0]
    return f'<div class="person">{pic}<div><h4>{e(m["name"])}</h4><div class="role">{e(m["role"])}</div><p>{e(bio)}</p></div></div>'


pages.append(page(f"""
{heading("Our Team", "Meet Our Team",
         "Our operations team brings practical experience in international trade, sourcing, supplier coordination, commercial negotiation, quality verification, documentation, logistics and customer support — following structured processes and disciplined transaction control from enquiry through delivery.")}
<div class="people">{"".join(team_card(m) for m in team)}</div>
<div class="divider"></div>
{heading("Registrations, Certifications & Compliance", "The Registrations We Trade Under",
         "BOSS EXIM maintains the corporate, tax, customs and trade registrations required for its operations, as and when applicable and obtained.")}
<table class="ov regs"><tbody>{"".join(
    f'<tr><td><b>{c}</b></td><td>{e(n)}</td><td class="mute">{e(i)}</td>'
    + (f'<td class="r">{e(company[k] or "")}</td>' if any(company[r[3]] for r in regs) else "") + "</tr>"
    for c, n, i, k in regs)}</tbody></table>
<p class="note">Product-specific approvals, inspection reports, laboratory certificates, certificates of origin, phytosanitary certificates and other
statutory documents are arranged according to the product, origin, destination and transaction requirements.</p>
""", "Team & Compliance"))

# BOSS Group: intro + companies
pages.append(page(f"""
<div class="group-head"><img src="{img('/images/group/boss-group-logo-white.png', 500)}" alt="BOSS Group"></div>
{heading("About BOSS Group", "The Strength and Range Behind BOSS EXIM")}
{paras([
    "BOSS EXIM is part of the wider BOSS Group, a diversified business ecosystem with activities across India and Australia. The Group’s interests span logistics, retail, construction, hospitality, IT, BPO and business services.",
    "For BOSS EXIM, the most direct strategic support comes from BOSS Container Line and the wider logistics network, which provides experience in NVOCC, freight forwarding, container trading, break bulk and other supply-chain activities.",
])}
<div class="grid-2 companies">{"".join(
    f'<div class="tile{" here" if g["is_current"] else ""}"><h4>{e(g["name"])}</h4><p>{e(g["description"])}</p></div>' for g in group)}</div>
""", "BOSS Group"))

# BOSS Group: Container Line + journey
cl = [("NVOCC", "Non-Vessel Operating Common Carrier services for reliable, cost-effective movement of containerised cargo across regional and international trade routes."),
      ("Freight Forwarding", "Sea, road, rail and air, door to door — planned around cargo type, route, transit time and commercial priorities."),
      ("Container Trading", "Buying, selling and leasing shipping containers and related equipment based on customer requirements."),
      ("Break Bulk", "Solutions for oversized, heavy, irregular and non-containerised cargo."),
      ("Project Cargo", "Heavy, oversized and specialised shipments that need planning beyond standard containers."),
      ("Warehouse & 3PL", "Storage, cargo handling, transportation and shipment coordination through one integrated process.")]
journey = [("2000 – 2003", "Established BOSS Group and opened the first Wollongong outlet in 2002."),
           ("2004 – 2007", "Entered Brisbane, built key fuel-industry relationships and the management platform for growth."),
           ("2008 – 2011", "Expanded convenience retail, acquired additional sites and freeholds."),
           ("2012 – 2015", "Reached more than ten operating sites; business and community recognition."),
           ("2016 – 2019", "Major fuel partnerships, greenfield developments, construction and property capabilities."),
           ("2020 – 2023", "First hotel acquisition, medical centres and subdivisions; launched BOSS Container Line in 2023."),
           ("2024 – 2026", "First EV site, wider logistics networks, and established BOSS EXIM (Global) Pvt. Ltd. in 2026.")]
pages.append(page(f"""
{heading("BOSS Container Line", "Integrated Logistics, Origin to Destination",
         "The Group’s shipping and logistics vertical — a registered NVOCC with 31 agency agreements across Asia, the Middle East and Africa, and offices in Singapore, Malaysia and India.")}
<div class="cl-photos">
  <img src="{img('/images/group/container-line/nvocc.webp', 900)}" alt="">
  <img src="{img('/images/cms/media/yards-img_5862.jpg', 700)}" alt="">
</div>
<div class="grid-3">{"".join(f'<div class="tile">{num(i + 1)}<h4>{e(t)}</h4><p>{e(d)}</p></div>' for i, (t, d) in enumerate(cl))}</div>
<div class="divider"></div>
{heading("Our Journey", "From Small Beginnings to Great Heights")}
<div class="timeline">{"".join(f'<div><b>{e(p)}</b><p>{e(t)}</p></div>' for p, t in journey)}</div>
""", "BOSS Group"))

# Partner with us
tracks = [
    ("Register as a Buyer", "/images/partner/buyer.webp", "Share your product, specification, quantity, destination, delivery date, preferred Incoterm and payment method — we match you with suitable verified sources.",
     ["Company, registration & contact details", "Product, grade or specification & quantity", "Destination port & required delivery date", "Preferred Incoterm & payment method"]),
    ("Register as a Supplier", "/images/partner/supplier.webp", "Manufacturers, processors, exporters and reliable traders offering consistent quality, competitive terms and dependable supply.",
     ["Company, registration & contact details", "Product, grade & country of origin", "Monthly capacity, MOQ & packaging", "Loading port, indicative price & payment terms"]),
    ("Strategic Business Partner", "/images/partner/strategic.webp", "Logistics providers, warehouses, inspection agencies, laboratories, financial institutions, customs-support companies and overseas representatives.",
     ["Logistics providers & freight forwarders", "Warehouses, inspection agencies & laboratories", "Financial institutions & trade-finance providers", "Customs support & overseas representatives"]),
]
pages.append(page(f"""
{heading("Partner With Us", "Buy, Sell or Partner with BOSS EXIM",
         "We welcome long-term relationships with genuine buyers, reliable suppliers and experienced strategic partners. Register in minutes at www.bgexim.com/partner.")}
<div class="tracks">{"".join(
    f'<div class="track"><img src="{img(src, 600)}" alt=""><div><h3>{e(t)}</h3><p>{e(d)}</p><ul>{"".join(f"<li>{e(x)}</li>" for x in pts)}</ul></div></div>'
    for t, src, d, pts in tracks)}</div>
<p class="note">Every enquiry is reviewed by the BOSS EXIM team before further discussion. Registration does not create a commercial
commitment or guarantee business — we contact you when there is a genuine, commercially viable match.</p>
""", "Partner With Us"))

# Back cover: contact
socials = [("LinkedIn", company["social_linkedin"]), ("Facebook", company["social_facebook"]),
           ("Instagram", company["social_instagram"]), ("YouTube", company["social_youtube"])]
social_html = "".join(f'<li><b>{n}</b><a href="{e(u)}">{e(u.replace("https://", "").replace("www.", ""))}</a></li>' for n, u in socials if u)
pages.append(page(f"""
<div class="cover-photo" style="background-image:url('{img('/images/group/container-line/freight-forwarding-2.webp', 1400)}')"></div>
<div class="cover-shade strong"></div>
<div class="back">
  <span class="brand big">{logo()}<span><b>BOSS</b> EXIM Global</span></span>
  <h2>Let’s Trade Together</h2>
  <p class="cover-lead">Tell us what you want to buy, sell or build. Every enquiry gets a reference number and a reply from our team.</p>
  <div class="contact">
    <div><div class="eyebrow light">Office</div><p>{e(company["contact_address"] or "")}</p></div>
    <div><div class="eyebrow light">Email</div><p><a href="mailto:{e(company["contact_email"])}">{e(company["contact_email"])}</a></p>
         <div class="eyebrow light">Phone / WhatsApp</div><p>{e(company["contact_phone"] or "")}</p></div>
    <div><div class="eyebrow light">Online</div><p><a href="https://www.bgexim.com">www.bgexim.com</a></p><ul class="social">{social_html}</ul></div>
  </div>
  <div class="motto">Connecting Products. Markets. Opportunities.</div>
</div>
<div class="cover-foot"><span>BOSS EXIM (Global) Pvt. Ltd. · A BOSS Group company</span><span>Specifications are typical; exact values are agreed per transaction.</span></div>
""", cls="cover"))

css = (Path(__file__).parent / "brochure.css").read_text(encoding="utf-8")
doc = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>BOSS EXIM Brochure</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@600;700;800&display=block" rel="stylesheet">
<style>{css}</style></head><body>{"".join(pages)}</body></html>"""
(OUT / "brochure.html").write_text(doc, encoding="utf-8")
print("pages:", page_no, "exports:", len(exports), "imports:", len(imports))
