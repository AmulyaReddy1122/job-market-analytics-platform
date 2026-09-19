import { useMemo } from "react";

export default function Locations({ jobs = [] }) {
  const locations = useMemo(() => {
    const counts = {};

    jobs.forEach((job) => {
      const city = job.city?.trim();

      if (!city || city === "Unknown" || city === "India") return;

      counts[city] = (counts[city] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
  }, [jobs]);

  const uniqueLocations = locations.length;
  const topLocation = locations[0];

  return (
    <section className="jm-locations-page">
      <div className="jm-locations-header">
        <p className="jm-eyebrow">LOCATION INTELLIGENCE</p>

        <h1>Locations</h1>

        <p>
          Explore where job opportunities are concentrated
          across India.
        </p>
      </div>

      <div className="jm-locations-kpis">
        <div className="jm-locations-kpi">
          <p>Cities Analyzed</p>
          <strong>{uniqueLocations}</strong>
        </div>

        <div className="jm-locations-kpi">
          <p>Top Hiring City</p>
          <strong>{topLocation?.[0] || "N/A"}</strong>
        </div>

        <div className="jm-locations-kpi">
          <p>Top City Postings</p>
          <strong>
            {topLocation?.[1]?.toLocaleString("en-IN") || 0}
          </strong>
        </div>
      </div>

      <div className="jm-locations-panel">
        <div className="jm-locations-panel__header">
          <h2>Top Job Locations</h2>
          <p>
            Cities with the highest number of job postings
          </p>
        </div>

        <div className="jm-locations-list">
          {locations.map(([city, count], index) => (
            <div className="jm-location-row" key={city}>
              <span className="jm-location-rank">
                #{index + 1}
              </span>

              <div className="jm-location-info">
                <strong>{city}</strong>
                <span>
                  {count.toLocaleString("en-IN")} postings
                </span>
              </div>

              <div className="jm-location-bar">
                <div
                  className="jm-location-bar__fill"
                  style={{
                    width: `${
                      (count / locations[0][1]) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {locations.length === 0 && (
        <div className="jm-error">
          No location data is available.
        </div>
      )}
    </section>
  );
}
