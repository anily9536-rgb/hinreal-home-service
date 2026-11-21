
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default async function AdminPage() {
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  async function updateStatus(formData: FormData) {
    "use server";

    const id = String(formData.get("id"));
    const status = String(formData.get("status"));

    if (!["approved", "rejected"].includes(status)) return;

    const { createClient } = await import("@supabase/supabase-js");

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user } } = await client.auth.getUser();

    if (!user) throw new Error("Please login first");

    const { data: profile } = await client
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      throw new Error("Admin access required");
    }

    await client
      .from("properties")
      .update({ status })
      .eq("id", id);
  }

  return (
    <>
      <Header />
      <main className="section">
        <h1>Admin Dashboard</h1>
        <p>Manage property listings</p>

        {error && <p>Properties load nahi ho paayi.</p>}

        <div className="grid">
          {properties?.map((property) => (
            <div className="property-card" key={property.id}>
              <h3>{property.title}</h3>
              <p>City: {property.city}</p>
              <p>Price: ₹{property.price}</p>
              <p>Status: {property.status}</p>

              <form action={updateStatus}>
                <input
                  type="hidden"
                  name="id"
                  value={property.id}
                />
                <button name="status" value="approved">
                  Approve
                </button>
                <button name="status" value="rejected">
                  Reject
                </button>
              </form>
            </div>
          ))}
        </div>

        {!properties?.length && <p>No properties found.</p>}
      </main>
      <Footer />
    </>
  );
}
