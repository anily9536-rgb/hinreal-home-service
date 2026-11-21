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
  created_at?: string;
};

export default function AdminPropertiesPage() {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchProperties() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("properties")
      .select("*")
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await fetchProperties();
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
            className="rounded-lg bg-blue-600 px-5 py-3 text-white"
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
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="border-t">
                    <td className="p-4 font-medium">
                      {property.title}
                    </td>

                    <td className="p-4">{property.locality}</td>

                    <td className="p-4">
                      ₹{Number(property.price || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4">
                      {property.property_type}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => deleteProperty(property.id)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
