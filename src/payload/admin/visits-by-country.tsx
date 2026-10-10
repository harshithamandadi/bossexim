import { sql, type SQLiteAdapter } from "@payloadcms/db-sqlite";
import type { ServerProps } from "payload";
import { countryName, UNKNOWN_COUNTRY } from "../visitor";

const DAY_MS = 24 * 60 * 60 * 1000;
const VISITS_HREF = "/admin/collections/site-visits";

interface CountryRow {
  country: string;
  week: number;
  month: number;
  total: number;
}

/** Visits per country (last 7 days, last 30 days, all time), counted in the database. */
async function visitsByCountry(db: SQLiteAdapter): Promise<CountryRow[]> {
  const weekAgo = new Date(Date.now() - 7 * DAY_MS).toISOString();
  const monthAgo = new Date(Date.now() - 30 * DAY_MS).toISOString();
  const rows = await db.drizzle.all<Record<string, unknown>>(sql`
    SELECT country,
      SUM(CASE WHEN created_at >= ${weekAgo} THEN 1 ELSE 0 END) AS week,
      SUM(CASE WHEN created_at >= ${monthAgo} THEN 1 ELSE 0 END) AS month,
      COUNT(*) AS total
    FROM site_visits
    GROUP BY country
    ORDER BY month DESC, total DESC
  `);
  return rows.map((row) => ({
    country: String(row.country),
    week: Number(row.week),
    month: Number(row.month),
    total: Number(row.total),
  }));
}

/** Dashboard panel: how many people visit the website, and from which countries. */
export async function VisitsByCountry({ payload }: ServerProps) {
  const rows = await visitsByCountry(payload.db as unknown as SQLiteAdapter);
  const sum = (key: keyof Omit<CountryRow, "country">) => rows.reduce((total, row) => total + row[key], 0);
  const totals = { week: sum("week"), month: sum("month"), total: sum("total") };

  return (
    <section className="bg-visits">
      <div className="bg-visits__header">
        <div>
          <p className="bg-welcome__eyebrow">Insights</p>
          <h2 className="bg-visits__title">Website visits by country</h2>
          <p className="bg-welcome__text">One visit is one browser session on the website. No personal details are stored.</p>
        </div>
        <a className="bg-welcome__link" href={VISITS_HREF}>
          All visits →
        </a>
      </div>

      <dl className="bg-visits__totals">
        <div>
          <dt>Last 7 days</dt>
          <dd>{totals.week.toLocaleString("en-IN")}</dd>
        </div>
        <div>
          <dt>Last 30 days</dt>
          <dd>{totals.month.toLocaleString("en-IN")}</dd>
        </div>
        <div>
          <dt>All time</dt>
          <dd>{totals.total.toLocaleString("en-IN")}</dd>
        </div>
        <div>
          <dt>Countries</dt>
          <dd>{rows.filter((row) => row.country !== UNKNOWN_COUNTRY).length}</dd>
        </div>
      </dl>

      {rows.length === 0 ? (
        <p className="bg-welcome__text">No visits recorded yet — they appear here as people browse the website.</p>
      ) : (
        <table className="bg-visits__table">
          <thead>
            <tr>
              <th scope="col">Country</th>
              <th scope="col">7 days</th>
              <th scope="col">30 days</th>
              <th scope="col">All time</th>
              <th scope="col" aria-label="Share of all visits" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.country}>
                <th scope="row">
                  <a href={`${VISITS_HREF}?where[country][equals]=${row.country}`}>
                    {row.country === UNKNOWN_COUNTRY ? (
                      <span className="bg-visits__flag bg-visits__flag--unknown" aria-hidden>
                        ?
                      </span>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element -- tiny static flag in the admin
                      <img className="bg-visits__flag" src={`/flags/${row.country.toLowerCase()}.svg`} alt="" />
                    )}
                    {countryName(row.country)}
                  </a>
                </th>
                <td>{row.week.toLocaleString("en-IN")}</td>
                <td>{row.month.toLocaleString("en-IN")}</td>
                <td>{row.total.toLocaleString("en-IN")}</td>
                <td className="bg-visits__bar-cell">
                  <span className="bg-visits__bar" style={{ width: `${Math.max(2, (row.total / totals.total) * 100)}%` }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
