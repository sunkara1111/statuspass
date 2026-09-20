import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    title: "StatusPass",
    statusBarStyle: "black-translucent",
  },
};

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
