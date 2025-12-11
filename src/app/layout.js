import "./globals.css";

export const metadata = {
  title: "Unfollowers for Bluesky",
  description: "Visualize os não-seguidores da rede socila Bluesky com mais facilidade.",
  keywords: "Bluesky, unfollowers, followers, seguidores, SDV, não segue de volta, Bluesky unfollowers, Bluesky followers, Bluesky seguidores, Bluesky SDV, Bluesky não segue de volta, bsky unfollowers, bsky followers, bsky seguidores, bsky SDV, bsky não segue de volta, bsky, scaique, caique silva, bsky scaique, bsky caique silva, unfollowers bsky, unfollowers for bluesky, unfollowers for bsky, unfs bsky, unfs bluesky",
  author: "Caique Silva",
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Unfollowers for Bluesky',
    description: 'Visualize os não-seguidores da rede socila Bluesky com mais facilidade.',
    url: 'https://unfollowers.scaique.dev.br',
    image: {
      url: 'https://unfolllowers.scaique.dev.br/og-image.webp',
      width: 1200,
      height: 630,
      alt: 'Imagem de visualização',
    },
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unfollowers for Bluesky',
    description: 'Visualize os não-seguidores da rede socila Bluesky com mais facilidade.',
    image: 'https://unfollowers.scaique.dev.br/og-image.webp',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
