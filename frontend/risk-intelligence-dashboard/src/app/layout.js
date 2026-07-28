import StoreProvider from "./StoreProvider";
import "./globals.css";

export const metadata = {
  title: "Risk Intelligence Dashboard",
  description: "A dashboard for tracking and analyzing global risks, for and by UM Enterprise Strategic Risk Department.",
};

export default function RootLayout({ children }) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className='overflow-y-hidden'>{children}</body>
      </html>
    </StoreProvider>
  );
}
