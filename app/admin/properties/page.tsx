
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Property = {
  id: string;
  title: string;
  locality: string;
  price: number;
  property_type: string;
  status?: string;
  deleted_from_manage?: boolean;
  created_at?: string;
};

export default function AdminPropertiesPage() {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function fetchProperties() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .or("deleted_from_manage.is.null,deleted_from_manage.eq.false")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setProperties((data || []) as Property[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || profile?.role !== "admin") {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      await fetchProperties();
    }

    checkAdmin();
  }, [router]);

  async function deleteProperty(id: string) {
    const property = properties.find(
      (item) => String(item.id) === String(id)
    );

    if (!property) return;

    const confirmed = window.confirm(
      property.status === "sold"
        ? "Yeh SOLD property hai. Yeh sirf Manage Properties se hide hogi. Sold Properties aur Selling Amount safe rahenge. Kya continue karein?"
        : "Are you sure you want to permanently delete this property?"
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      let result;

      if (property.status === "sold") {
        result = await supabase
          .from("properties")
          .update({ deleted_from_manage: true })
          .eq("id", id);
      } else {
        result = await supabase
          .from("properties")
          .delete()
          .eq("id", id);
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      await fetchProperties();

      if (property.status === "sold") {
        alert("Sold property Manage Properties se hide ho gayi. Sold record aur Selling Amount safe hain.");
      } else {
        alert("Property permanently deleted.");
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Property delete nahi ho payi."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Properties
            </h1>
            <p className="mt-2 text-gray-600">
              View and manage all listed properties.
            </p>
          </div>

          <button
            onClick={fetchProperties}
            disabled={loading || deleting}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">Total Properties</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {properties.length}
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center">
            Loading properties...
          </div>
        ) : error ? (
          <div className="rounded-xl bg-white p-6 text-red-600">
            Error: {error}
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center">
            No properties found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="border-t">
                    <td className="p-4 font-medium">
                      {property.title}
                    </td>

                    <td className="p-4">
                      {property.locality}
                    </td>

                    <td className="p-4">
                      ₹{Number(property.price || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4">
                      {property.property_type}
                    </td>

                    <td className="p-4">
                      {property.status === "sold" ? (
                        <span className="rounded bg-red-100 px-3 py-1 font-bold text-red-700">
                          SOLD
                        </span>
                      ) : (
                        property.status || "Pending"
                      )}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => deleteProperty(property.id)}
                        disabled={deleting}
                        className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
                      >
                        {deleting ? "Please wait..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() => router.push("/admin")}
            className="rounded-lg bg-gray-800 px-5 py-3 text-white"
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </main>
  );
}
