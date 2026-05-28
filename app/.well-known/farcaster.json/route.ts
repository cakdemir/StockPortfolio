import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://stock-portfolio-five-sigma.vercel.app';

  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjMzMzYzOSwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDgzNTdiYUU3QmJkOTJEMTQ2NUZhRDM0ZTBCNTczRTVjMWRjOUU0N0QifQ", // Görseldeki uzun yazının devamı otomatik eşleşecek
      payload: "eyJkb21haW4iOiJzdG9jay1wb3J0Zm9saW8tZml2ZS1zaWdtYS52ZXJjZWwuYXBwIn0",
      signature: "Ep4lhJJKo9a7KQab1k+g5kZHQ+ca8G6JxeVTnXaDTpQ20t/jwzLiq7rhLwlXvxAtss4EysGUIHk9ggJnoSAivRs="
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