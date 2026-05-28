import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://stock-portfolio-five-sigma.vercel.app';

  const manifest = {
    accountAssociation: {
      header: "eyJhbGciOiJ...", 
      payload: "...",
      signature: "..."
    },
    frame: {
      version: "1", 
      name: "Stock Portfolio",
      iconUrl: `${appUrl}/icon.png`, 
      homeUrl: appUrl,
      imageUrl: `${appUrl}/splash.png`, 
      buttonTitle: "Launch",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#ffffff"
    }
  };

  return NextResponse.json(manifest);
}