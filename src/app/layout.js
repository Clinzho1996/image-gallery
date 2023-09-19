import AuthProvider from "./components/AuthProvider/AuthProvider";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Header";
import { ThemeProvider } from "./context/ThemeContext";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Drag & Drop Image Gallery | Confidence Emonena",
  description:
    "Designed & Developed by Confidence Emonena Ochuko | Dev-Clinton",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <div className="container">
              <Navbar />
              {children}
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
