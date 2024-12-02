import "../globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "../components/sidebar/page";
import localFont from "next/font/local";
import TopNavbar from "../components/topnavbar/page";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function DashLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar column (3 for large screens) */}
            <div className="col-xl-3 col-md-3 p-0">
              <Sidebar />
            </div>

            {/* Main content column (remaining space) */}
            <div className="col-xl-9 col-md-9 p-0">
              <TopNavbar/>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
