
async function handleAddProperty(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  if (saving) return;

  setSaving(true);
  setMessage("Step 1: Checking admin login...");

  const timeout = <T,>(promise: Promise<T>) =>
    Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Supabase response timeout. Please check connection.")),
          15000
        )
      ),
    ]);

  try {
    const { data: auth, error: authError } = await timeout(
      supabase.auth.getUser()
    );

    if (authError || !auth.user) {
      throw new Error(authError?.message || "Admin login expired.");
    }

    setMessage("Step 2: Preparing property data...");

    const propertyData = {
      user_id: auth.user.id,
      title: title.trim(),
      locality: locality.trim(),
      listing_type: listingType,
      property_type: propertyType,
      price: Number(price),
      description: description.trim(),
      phone: phone.trim() || null,
      images: [],
      status: "approved",
    };

    if (!title.trim() || !locality.trim() || !price || Number(price) <= 0) {
      throw new Error("Title, location aur valid price zaroori hain.");
    }

    setMessage("Step 3: Saving property to database...");

    const result = await timeout(
      supabase
        .from("properties")
        .insert(propertyData)
        .select()
        .single()
    );

    if (result.error) {
      throw new Error(result.error.message);
    }

    setMessage("Success! Property website par add ho gayi.");

    setTitle("");
    setLocality("");
    setPrice("");
    setPhone("");
    setDescription("");
    setImageFile(null);

    await loadData().catch(() => {});
  } catch (error) {
    setMessage(
      "UPLOAD FAILED: " +
      (error instanceof Error ? error.message : "Unknown error")
    );
  } finally {
    setSaving(false);
  }
}
