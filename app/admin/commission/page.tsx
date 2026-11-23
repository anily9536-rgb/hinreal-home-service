
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Property = {
  id: string;
  property_code: number | null;
  title: string | null;
  locality: string | null;
  property_type: string | null;
};

type Commission = {
  id: number;
  property_id: string | null;
  property_code: number;
  property_title: string | null;
  area: string | null;
  property_type: string | null;
  commission_amount: number;
  commission_month: number;
  commission_year: number;
  remarks: string | null;
  created_at: string;
};

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

export default function CommissionPage() {
  const router = useRouter();

  const today = new Date();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCommissionId, setEditingCommissionId] = useState<number | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Property | null>(null);

  const [amount, setAmount] = useState("");
  const [commissionMonth, setCommissionMonth] = useState(
    String(today.getMonth() + 1)
  );
  const [commissionYear, setCommissionYear] = useState(
    String(today.getFullYear())
  );
  const [remarks, setRemarks] = useState("");

  const [filterMonth, setFilterMonth] = useState("all");
  const [filterYear, setFilterYear] = useState("all");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const { data: authData } = await supabase.auth.getUser();

        if (!authData.user) {
          router.replace("/admin/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (profileError || profile?.role !== "admin") {
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }

        const [propertyResult, commissionResult] = await Promise.all([
          supabase
            .from("properties")
            .select("id,property_code,title,locality,property_type")
            .order("property_code", { ascending: true }),

          supabase
            .from("property_commissions")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

        if (propertyResult.error) {
          throw propertyResult.error;
        }

        if (commissionResult.error) {
          throw commissionResult.error;
        }

        if (active) {
          setProperties(propertyResult.data || []);
          setCommissions(commissionResult.data || []);
        }
      } catch (error) {
        console.error("Commission loading error:", error);
        alert("Data load nahi ho saka. Please refresh karein.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [router]);

  const filteredProperties = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return properties;

    return properties.filter((property) =>
      [
        String(property.property_code || ""),
        property.title || "",
        property.locality || "",
        property.property_type || "",
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [properties, search]);

  const filteredCommissions = useMemo(() => {
    return commissions.filter((item) => {
      const monthMatch =
        filterMonth === "all" ||
        String(item.commission_month) === filterMonth;

      const yearMatch =
        filterYear === "all" ||
        String(item.commission_year) === filterYear;

      return monthMatch && yearMatch;
    });
  }, [commissions, filterMonth, filterYear]);

  const totalCommission = filteredCommissions.reduce(
    (total, item) => total + Number(item.commission_amount || 0),
    0
  );

  const years = Array.from(
    new Set([
      today.getFullYear(),
      ...commissions.map((item) => item.commission_year),
    ])
  ).sort((a, b) => b - a);
function editCommission(item: Commission) {
  setEditingCommissionId(item.id);
  setSelected({
    id: item.property_id || "",
    property_code: item.property_code,
    title: item.property_title,
    locality: item.area,
    property_type: item.property_type,
  });
  setAmount(String(item.commission_amount));
  setCommissionMonth(String(item.commission_month));
  setCommissionYear(String(item.commission_year));
  setRemarks(item.remarks || "");

  window.scrollTo({ top: 0, behavior: "smooth" });
}
  async function saveCommission() {
  if (!selected) {
    alert("Please property select karein.");
    return;
  }

  const commissionAmount = Number(amount);

  if (!amount || !Number.isFinite(commissionAmount) || commissionAmount <= 0) {
    alert("Sahi commission amount enter karein.");
    return;
  }

  setSaving(true);

  const commissionData = {
    property_id: selected.id || null,
    property_code: selected.property_code,
    property_title: selected.title,
    area: selected.locality,
    property_type: selected.property_type,
    commission_amount: commissionAmount,
    commission_month: Number(commissionMonth),
    commission_year: Number(commissionYear),
    remarks: remarks.trim() || null,
  };

  try {
    if (editingCommissionId !== null) {
      const { data, error } = await supabase
        .from("property_commissions")
        .update(commissionData)
        .eq("id", editingCommissionId)
        .select()
        .single();

      if (error) throw error;

      setCommissions((previous) =>
        previous.map((item) =>
          item.id === editingCommissionId ? data : item
        )
      );

      alert("Commission successfully update ho gaya.");
    } else {
      const { data, error } = await supabase
        .from("property_commissions")
        .insert(commissionData)
        .select()
        .single();

      if (error) throw error;

      setCommissions((previous) => [data, ...previous]);

      alert("Commission successfully save ho gaya.");
    }

    setEditingCommissionId(null);
    setAmount("");
    setRemarks("");
    setSelected(null);
    setSearch("");
  } catch (error) {
    console.error("Commission save/update error:", error);
    alert("Commission save/update nahi hua. Dobara try karein.");
  } finally {
    setSaving(false);
  }
}

    const commissionAmount = Number(amount);

    if (!amount || !Number.isFinite(commissionAmount) || commissionAmount <= 0) {
      alert("Sahi commission amount enter karein.");
      return;
    }

    setSaving(true);

    try {
      const { data, error } = await supabase
        .from("property_commissions")
        .insert({
          property_id: selected.id,
          property_code: selected.property_code,
          property_title: selected.title,
          area: selected.locality,
          property_type: selected.property_type,
          commission_amount: commissionAmount,
          commission_month: Number(commissionMonth),
          commission_year: Number(commissionYear),
          remarks: remarks.trim() || null,
        })
        .select()
        .single();

      if (error) throw error;

      setCommissions((previous) => [data, ...previous]);
      setAmount("");
      setRemarks("");
      setSelected(null);
      setSearch("");

      alert("Commission successfully save ho gaya.");
    } catch (error) {
      console.error("Commission save error:", error);
      alert("Commission save nahi hua. Please dobara try karein.");
    } finally {
      setSaving(false);
    }
  }

  function escapeHtml(value: unknown) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => {
      const entities: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return entities[character];
    });
  }

  
  function printCommission() {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow popups to print the bill.");
      return;
    }

    const monthLabel =
      filterMonth === "all"
        ? "All Months"
        : months[Number(filterMonth) - 1];

    const yearLabel =
      filterYear === "all" ? "All Years" : filterYear;

    const rows = filteredCommissions.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(item.property_code)}</td>
        <td>${escapeHtml(item.property_title || "-")}</td>
        <td>${escapeHtml(item.area || "-")}</td>
        <td>${escapeHtml(item.property_type || "-")}</td>
        <td>${escapeHtml(months[item.commission_month - 1])} ${escapeHtml(item.commission_year)}</td>
        <td>₹${Number(item.commission_amount).toLocaleString("en-IN")}</td>
        <td>${escapeHtml(item.remarks || "-")}</td>
      </tr>
    `).join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>REAL HOME SERVICE - Commission Bill</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #222;
            }

            .company-header {
              text-align: center;
              border-bottom: 2px solid #222;
              padding-bottom: 15px;
            }

            .company-header img {
              width: 75px;
              height: 75px;
              object-fit: contain;
            }

            .company-header h1 {
              margin: 8px 0;
              font-size: 26px;
            }

            .bill-title {
              text-align: center;
              margin-top: 20px;
            }

            .details {
              text-align: center;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 25px;
            }

            th, td {
              border: 1px solid #ccc;
              padding: 10px;
              text-align: left;
              font-size: 12px;
            }

            th {
              background: #eee;
            }

            .total {
              text-align: right;
              font-size: 20px;
              font-weight: bold;
              margin-top: 25px;
            }

            .authorised {
              text-align: right;
              font-weight: bold;
              margin-top: 60px;
              font-size: 14px;
            }

            @media print {
              button {
                display: none;
              }
            }
          </style>
        </head>

        <body>
          <div class="company-header">
            <img src="${window.location.origin}/logo.png" alt="Company Logo">
            <h1>REAL HOME SERVICE</h1>
          </div>

          <h2 class="bill-title">PROPERTY COMMISSION BILL</h2>

          <p class="details">
            Period: ${escapeHtml(monthLabel)} ${escapeHtml(yearLabel)}
          </p>

          <p class="details">
            Total Commission Entries: ${filteredCommissions.length}
          </p>

          <p class="details">
            Print Date: ${new Date().toLocaleDateString("en-IN")}
          </p>

          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Property ID</th>
                <th>Property</th>
                <th>Area</th>
                <th>Type</th>
                <th>Month</th>
                <th>Commission</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>
              ${rows || '<tr><td colspan="8">No commission records found for this period.</td></tr>'}
            </tbody>
          </table>

          <div class="total">
            Total Commission: ₹${totalCommission.toLocaleString("en-IN")}
          </div>

          <div class="authorised">
            AUTHORISED BILL
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          <\/script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }


    

  function printSingleCommission(item: Commission) {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow popups to print the bill.");
      return;
    }

    const monthName = months[item.commission_month - 1];
    const amount = Number(item.commission_amount);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>REAL HOME SERVICE - Property Commission Bill</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #222;
            }
            .company-header {
              text-align: center;
              border-bottom: 2px solid #222;
              padding-bottom: 15px;
            }
            .company-header img {
              width: 75px;
              height: 75px;
              object-fit: contain;
            }
            .company-header h1 {
              margin: 8px 0;
              font-size: 26px;
            }
            h2, .details {
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 25px;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 12px;
              text-align: left;
            }
            th {
              background: #eee;
            }
            .total {
              text-align: right;
              font-size: 20px;
              font-weight: bold;
              margin-top: 25px;
            }
            .authorised {
              text-align: right;
              font-weight: bold;
              margin-top: 60px;
            }
          </style>
        </head>
        <body>
          <div class="company-header">
            <img src="${window.location.origin}/logo.png" alt="Company Logo">
            <h1>REAL HOME SERVICE</h1>
          </div>

          <h2>PROPERTY COMMISSION BILL</h2>

          <p class="details">Property ID: ${escapeHtml(item.property_code)}</p>
          <p class="details">Period: ${escapeHtml(monthName)} ${escapeHtml(item.commission_year)}</p>
          <p class="details">Print Date: ${new Date().toLocaleDateString("en-IN")}</p>

          <table>
            <thead>
              <tr>
                <th>Property ID</th>
                <th>Property</th>
                <th>Area</th>
                <th>Type</th>
                <th>Month</th>
                <th>Commission</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${escapeHtml(item.property_code)}</td>
                <td>${escapeHtml(item.property_title || "-")}</td>
                <td>${escapeHtml(item.area || "-")}</td>
                <td>${escapeHtml(item.property_type || "-")}</td>
                <td>${escapeHtml(monthName)} ${escapeHtml(item.commission_year)}</td>
                <td>₹${amount.toLocaleString("en-IN")}</td>
                <td>${escapeHtml(item.remarks || "-")}</td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            Total Commission: ₹${amount.toLocaleString("en-IN")}
          </div>

          <div class="authorised">AUTHORISED BILL</div>

          <script>
            window.onload = function() {
              window.print();
            };
          <\/script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginTop: "6px",
    boxSizing: "border-box" as const,
  };

  const buttonStyle = {
    padding: "12px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold" as const,
  };

  return (
    <main style={{
      maxWidth: "1100px",
      margin: "auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    }}>
      <button
        onClick={() => router.push("/admin")}
        style={{
          ...buttonStyle,
          background: "#eee",
          marginBottom: "18px",
        }}
      >
        ← Back to Admin
      </button>

      <h1>Property Commission</h1>
      <p>Property commission add, manage aur monthly bill print karein.</p>

      {loading ? (
        <p>Loading commission data...</p>
      ) : (
        <>
          <section style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "18px",
            marginTop: "20px",
          }}>
            <h2>Add Commission</h2>

            <label>Search Property by ID / Name / Area</label>
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSelected(null);
              }}
              placeholder="Property ID ya property name enter karein"
              style={inputStyle}
            />

            {search.trim() && !selected && (
              <div style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginTop: "8px",
                maxHeight: "220px",
                overflowY: "auto",
              }}>
                {filteredProperties.length === 0 ? (
                  <p style={{ padding: "12px" }}>Property nahi mili.</p>
                ) : (
                  filteredProperties.map((property) => (
                    <button
                      key={property.id}
                      onClick={() => {
                        setSelected(property);
                        setSearch(
                          `${property.property_code || ""} - ${property.title || property.locality || "Property"}`
                        );
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "12px",
                        border: "none",
                        borderBottom: "1px solid #eee",
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <b>Property ID: {property.property_code || "-"}</b>
                      <br />
                      {property.title || "Property"} | {property.locality || "-"}
                      <br />
                      <small>{property.property_type || "-"}</small>
                    </button>
                  ))
                )}
              </div>
            )}

            {selected && (
              <div style={{
                background: "#eff6ff",
                padding: "14px",
                borderRadius: "8px",
                marginTop: "12px",
              }}>
                <b>Selected Property</b>
                <p>Property ID: {selected.property_code}</p>
                <p>Property: {selected.title || "-"}</p>
                <p>Area: {selected.locality || "-"}</p>
                <p>Type: {selected.property_type || "-"}</p>
                <button
                  onClick={() => {
                    setSelected(null);
                    setSearch("");
                  }}
                  style={{ ...buttonStyle, background: "#ddd" }}
                >
                  Change Property
                </button>
              </div>
            )}

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
              marginTop: "18px",
            }}>
              <div>
                <label>Commission Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="Enter amount"
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Commission Month</label>
                <select
                  value={commissionMonth}
                  onChange={(event) => setCommissionMonth(event.target.value)}
                  style={inputStyle}
                >
                  {months.map((month, index) => (
                    <option key={month} value={index + 1}>{month}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Commission Year</label>
                <input
                  type="number"
                  value={commissionYear}
                  onChange={(event) => setCommissionYear(event.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginTop: "12px" }}>
              <label>Remarks (Optional)</label>
              <input
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Commission details"
                style={inputStyle}
              />
            </div>

            <button
              onClick={saveCommission}
              disabled={!selected || saving}
              style={{
                ...buttonStyle,
                background: "#2563eb",
                color: "#fff",
                marginTop: "18px",
                opacity: (!selected || saving) ? 0.6 : 1,
              }}
            >
              {saving
  ? "Saving..."
  : editingCommissionId !== null
    ? "Update Commission"
    : "Save Commission"}
              {editingCommissionId !== null && (
  <button
    type="button"
    onClick={() => {
      setEditingCommissionId(null);
      setSelected(null);
      setAmount("");
      setRemarks("");
      setSearch("");
    }}
    style={{ ...buttonStyle, background: "#6b7280", color: "#fff", marginTop: "10px" }}
  >
    Cancel Edit
  </button>
)}
            </button>
          </section>

          <section style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "18px",
            marginTop: "24px",
          }}>
            <h2>Commission Records</h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "12px",
            }}>
              <div>
                <label>Select Month</label>
                <select
                  value={filterMonth}
                  onChange={(event) => setFilterMonth(event.target.value)}
                  style={inputStyle}
                >
                  <option value="all">All Months</option>
                  {months.map((month, index) => (
                    <option key={month} value={index + 1}>{month}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Select Year</label>
                <select
                  value={filterYear}
                  onChange={(event) => setFilterYear(event.target.value)}
                  style={inputStyle}
                >
                  <option value="all">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{
              background: "#eff6ff",
              borderRadius: "10px",
              padding: "16px",
              marginTop: "16px",
            }}>
              <p style={{ margin: 0 }}>Total Commission</p>
              <h2 style={{ margin: "8px 0 0", color: "#1d4ed8" }}>
                ₹{totalCommission.toLocaleString("en-IN")}
              </h2>
            </div>

            <button
              onClick={printCommission}
              style={{
                ...buttonStyle,
                background: "#15803d",
                color: "#fff",
                marginTop: "16px",
              }}
            >
              Print Monthly Commission Bill
            </button>

            <div style={{ overflowX: "auto", marginTop: "18px" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "650px",
              }}>
                <thead>
                  <tr style={{ background: "#f3f4f6" }}>
                    {["Property ID", "Property", "Month", "Commission", "Remarks", "Print Bill"].map((heading) => (
                      <th key={heading} style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        textAlign: "left",
                      }}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCommissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "14px", textAlign: "center" }}>
                        No commission records found.
                      </td>
                    </tr>
                  ) : (
                    filteredCommissions.map((item) => (
                      <tr key={item.id}>
                        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                          {item.property_code}
                        </td>
                        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                          {item.property_title || "-"}
                          <br />
                          <small>{item.area || "-"}</small>
                        </td>
                        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                          {months[item.commission_month - 1]} {item.commission_year}
                        </td>
                        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                          ₹{Number(item.commission_amount).toLocaleString("en-IN")}
                        </td>
                        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                          {item.remarks || "-"}
                        </td>
                        
  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
    <button
      type="button"
      onClick={() => printSingleCommission(item)}
      style={{
        padding: "8px 12px",
        background: "#15803d",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Print / PDF
    </button>
    <button
  type="button"
  onClick={() => editCommission(item)}
  style={{
    padding: "8px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginLeft: "6px",
  }}
>
  Edit
</button>
  </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

