
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SaleByCustomer() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");

  const loadItems = useCallback(async () => {
    const { data, error } = await supabase
      .from("customer_property_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setMessage(error.message);
    else setItems(data || []);

    setLoading(false);
  }, []);

  useEffect(() => {
    async function checkAdmin() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/admin/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      await loadItems();
    }

    checkAdmin();
  }, [router, loadItems]);

  async function approve(item: any) {
    if (busy || item.status !== "pending") return;

    if (!window.confirm("Is property ko website par approve karna hai?")) return;

    setBusy(item.id);
    setMessage("Approving property...");

    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Admin login expired.");

      const { data: property, error } = await supabase
        .from("properties")
        .insert({
          user_id: auth.user.id,
          title: item.title,
          locality: item.address,
          address: item.address,
          listing_type: item.listing_type,
          property_type: item.property_type,
          price: Number(item.price),
          phone: item.mobile_number,
          images: item.images,
          description: "Customer submitted property",
          status: "approved",
          deleted_from_manage: false,
        })
        .select("id")
        .single();

      if (error) throw error;

      const { error: updateError } = await supabase
        .from("customer_property_submissions")
        .update({
          status: "approved",
          approved_property_id: property.id,
        })
        .eq("id", item.id)
        .eq("status", "pending");

      if (updateError) throw updateError;

      setMessage("Property approved and listed on website!");
      await loadItems();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Approval failed.");
    } finally {
      setBusy("");
    }
  }

  async function deleteItem(item: any) {
    if (busy) return;

    if (!window.confirm("Customer property submission delete karni hai?")) return;

    setBusy(item.id);

    try {
      // If already approved, remove its live listing too.
      if (item.approved_property_id) {
        const { error } = await supabase
          .from("properties")
          .delete()
          .eq("id", item.approved_property_id);

        if (error) throw error;
      }

      const { error } = await supabase
        .from("customer_property_submissions")
        .delete()
        .eq("id", item.id);

      if (error) throw error;

      const paths = (item.images || []).map((url: string) => {
        const marker = "/storage/v1/object/public/property-images/";
        const index = url.indexOf(marker);
        return index >= 0
          ? decodeURIComponent(url.slice(index + marker.length))
          : "";
      }).filter(Boolean);

      if (paths.length) {
        await supabase.storage.from("property-images").remove(paths);
      }

      setMessage("Submission deleted.");
      await loadItems();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setBusy("");
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#EAF1EB",
      padding: 20,
      color: "#10264A",
    }}>
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <h1 style={{ color: "#10264A" }}>Sale By Customer</h1>

        <button onClick={() => router.push("/admin")}
          style={{
            padding: 12,
            background: "#10264A",
            color: "#fff",
            border: 0,
            borderRadius: 8,
          }}>
          Back to Dashboard
        </button>

        {message && <p style={{
          padding: 12,
          background: "#fff",
          border: "1px solid #C9A34A",
          borderRadius: 8,
        }}>{message}</p>}

        <h3>Total Submissions: {items.length}</h3>
        <h3>Pending: {items.filter(x => x.status === "pending").length}</h3>

        {loading ? <p>Loading...</p> : items.map(item => (
          <div key={item.id} style={{
            background: "#fff",
            border: "2px solid #C9A34A",
            borderRadius: 14,
            padding: 16,
            marginBottom: 20,
          }}>
            <h2>{item.title}</h2>

            <p><b>Property Type:</b> {item.property_type}</p>
            <p><b>Listing:</b> {item.listing_type === "Rent" ? "FOR RENT" : "FOR SALE"}</p>
            <p><b>Address:</b> {item.address}</p>
            <p><b>Price:</b> ₹{Number(item.price).toLocaleString("en-IN")}</p>
            <p><b>Customer:</b> {item.customer_name}</p>
            <p><b>Mobile:</b> {item.mobile_number}</p>
            <p><b>Status:</b> {item.status.toUpperCase()}</p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))",
              gap: 8,
            }}>
              {(item.images || []).map((url: string, i: number) => (
                <a key={i} href={url} target="_blank" rel="noreferrer">
                  <img src={url} alt="Property"
                    style={{
                      width: "100%",
                      height: 90,
                      objectFit: "cover",
                      borderRadius: 8,
                    }} />
                </a>
              ))}
            </div>

            <div style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 16,
            }}>
              {item.status === "pending" && (
                <button disabled={!!busy}
                  onClick={() => approve(item)}
                  style={{
                    padding: 13,
                    background: "#C9A34A",
                    color: "#10264A",
                    border: 0,
                    borderRadius: 8,
                    fontWeight: 900,
                  }}>
                  {busy === item.id ? "Please Wait..." : "APPROVE PROPERTY"}
                </button>
              )}

              <button disabled={!!busy}
                onClick={() => deleteItem(item)}
                style={{
                  padding: 13,
                  background: "#A52A2A",
                  color: "#fff",
                  border: 0,
                  borderRadius: 8,
                  fontWeight: 900,
                }}>
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
