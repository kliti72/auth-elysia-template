'use client';

import { use, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Cards from "./page/cards";
import ManageUser from "./page/manageUser";
import LoadingWidget from "../component/widget/loadingWidget"
import NotAuthWidget from "../component/widget/notAuthWidget";

const NAV = [
  { id: "cards", label: "KPI FUCK" },
  { id: "users", label: "USERS" },
  { id: "settings", label: "OTHERS..." },
];

export default function Admin() {
  const user = useAuth();
  const [active, setActive] = useState("cards");

  if (user.status === "loading") {
    return <LoadingWidget />
  }

  if (user.status != "authenticated") {
    return <NotAuthWidget />
  }

  if (user.status === "authenticated" && user.user.role != "staff" || user.user.role != "admin" ) {
    return (
      <div>
        <NotAuthWidget />
        <p style={{ padding: 24 }}> If you are developer use this route for give permissions: http://localhost:4040/admin/bootstrap/kliti7085@gmail.com, before edit the route /admin in the file for change email.</p>;
      </div>
    )};

    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#0f0f0f", color: "#e8e8e8" }}>
        <aside style={{ width: 200, borderRight: "1px solid #2a2a2a", padding: "32px 0", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ padding: "0 20px 24px", fontSize: 11, color: "#555", textTransform: "uppercase" }}>Admin</div>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setActive(n.id)}
              style={{
                textAlign: "left", padding: "10px 20px", background: active === n.id ? "#1e1e1e" : "transparent",
                border: "none", borderLeft: `2px solid ${active === n.id ? "#e8e8e8" : "transparent"}`,
                color: active === n.id ? "#fff" : "#666", cursor: "pointer", fontSize: 13, transition: "all .15s"
              }}>
              {n.label}
            </button>
          ))}
        </aside>
        <main style={{ flex: 1, padding: 32 }}>
          {active === "cards" && <Cards />}
          {active === "users" && <ManageUser />}
          {active !== "cards" && "users" && <p style={{ color: "#555", fontSize: 13 }}>{active} — coming soon.</p>}
        </main>
      </div>
    );
  }