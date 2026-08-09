import { ImageResponse } from "next/og";

export const alt = "Finance — Finanzas personales";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const OG_LABELS = ["Ingresos", "Gastos", "Balance", "Categorías"];

function FeatureStat({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        padding: "12px 24px",
        borderRadius: 999,
        backgroundColor: "#ffffff",
        border: "1px solid #e3e1d5",
        fontSize: 18,
        color: "#51655b",
      }}
    >
      {label}
    </div>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#f4f3ec",
          color: "#0d1f16",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: "#0c8050",
              color: "#ffffff",
              fontSize: 34,
              fontWeight: 700,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            F
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            Finance
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Tu dinero, siempre al día.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#51655b",
              lineHeight: 1.4,
            }}
          >
            Registra tus ingresos y gastos, y toma el control de tus finanzas
            desde un solo lugar.
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {OG_LABELS.map((label) => (
            <FeatureStat key={label} label={label} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
