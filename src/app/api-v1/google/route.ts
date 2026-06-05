import { NextResponse } from "next/server";
import { GOOGLE_MAPS_API_KEY } from "@/constants";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const query = searchParams.get("query");
  const placeId = searchParams.get("placeId");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  try {
    let url = "";

    switch (type) {
      case "places":
        if (!query) throw new Error("Missing query param");
        url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          query
        )}&key=${GOOGLE_MAPS_API_KEY}`;
        break;

      case "details":
        if (!placeId) throw new Error("Missing placeId param");
        url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
          placeId
        )}&fields=address_components,formatted_address,geometry,name&key=${GOOGLE_MAPS_API_KEY}`;
        break;

      case "geocode":
        if (!lat || !lng) throw new Error("Missing lat/lng params");
        url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
        break;

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Google API error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
