import { NextResponse } from "next/server";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://castfolio.app";

export async function GET() {
  return NextResponse.json({
    accountAssociation: {
      header: "eyJmaWQiOjAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAifQ",
      payload: "eyJkb21haW4iOiJjYXN0Zm9saW8uYXBwIn0",
      signature:
        "MHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw",
    },
    frame: {
      version: "1",
      name: "Castfolio",
      iconUrl: `${appUrl}/next.svg`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/next.svg`,
      buttonTitle: "Open Castfolio",
      splashImageUrl: `${appUrl}/next.svg`,
      splashBackgroundColor: "#050B14",
      webhookUrl: `${appUrl}/api/miniapp/webhook`,
    },
    baseBuilder: {
      allowedChains: ["base"],
      defaultChain: "base",
    },
  });
}