"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase, supabaseConfigured } from "@/lib/supabase";

export default function SellPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [listingType, setListingType] = useState("Buy");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [price, setPrice] = useState("");
  const [locality, setLocality] = useState("");
  const [address, setAddress] = useState("");
  const [bhk, setBhk] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!supabaseConfigured) return;
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || ""));
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabaseConfigured) { setNotice("Supabase setup is incomplete."); return; }
    if (!userId) { router.push("/login"); return; }
    if (!photo) { setNotice("Please choose a property photo."); return; }
    const ext = photo.name.split(".").pop() || "jpg";
    const filePath = `${userId}/${Date.now()}.${ext}`;
    const upload = await supabase.storage.from("property-photos").upload(filePath, photo);
    if (upload.error) { setNotice(upload.error.message); return; }
    const { data: publicUrl } = supabase.storage.from("property-photos").getPublicUrl(filePath);
    const { error } = await supabase.from("properties").insert({
      user_id: userId, title, listing_type: listingType, property_type: propertyType,
      price: Number(price), locality, address, bhk: bhk ? Number(bhk) : null,
      area_sqft: area ? Number(area) : null, description, phone,
      images: [publicUrl.publicUrl], status: "pending"
    });
    if (error) setNotice(error.message);
    else { setNotice("Property submitted for admin approval."); setTitle(""); setPrice(""); setLocality(""); setAddress(""); setDescription(""); setPhone(""); setPhoto(null); }
  }

  return <><Header /><main className="container section"><form className="panel form" onSubmit={submit}>
    <h1>Post Property</h1><p className="muted">Submit your property for admin approval.</p>
    {!userId && <p className="notice">Please log in first. If you do not have an account, create one in Supabase Authentication or ask the site administrator.</p>}
    <label>Property title<input required value={title} onChange={e => setTitle(e.target.value)} /></label>
    <label>Listing type<select value={listingType} onChange={e => setListingType(e.target.value)}><option>Buy</option><option>Rent</option></select></label>
    <label>Property type<select value={propertyType} onChange={e => setPropertyType(e.target.value)}><option>Apartment</option><option>House</option><option>Villa</option><option>Plot</option><option>Commercial</option></select></label>
    <label>Price (₹)<input required type="number" min="1" value={price} onChange={e => setPrice(e.target.value)} /></label>
    <label>Locality<input required value={locality} onChange={e => setLocality(e.target.value)} /></label>
    <label>Full address<input value={address} onChange={e => setAddress(e.target.value)} /></label>
    <label>BHK<input type="number" min="0" value={bhk} onChange={e => setBhk(e.target.value)} /></label>
    <label>Area (sq ft)<input type="number" min="0" value={area} onChange={e => setArea(e.target.value)} /></label>
    <label>Contact phone<input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} /></label>
    <label>Description<textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} /></label>
    <label>Property photo<input required type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} /></label>
    <button className="button">Submit Property</button>{notice && <p className="notice" role="status">{notice}</p>}
  </form></main><Footer /></>;
}
