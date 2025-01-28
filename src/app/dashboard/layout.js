import "../globals.css";
import "./layout.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "../components/sidebar/page";
import localFont from "next/font/local";
import { PageNameProvider } from "../components/pagenamecontext/page";
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
  title: "IDC Infrastructure Manager",
  description: "",
};

export default function DashLayout({ children }) {
  return (
    <section className={`${geistSans.variable} ${geistMono.variable}`}>
      <PageNameProvider>
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar column (fixed/sticky) */}
            <div className="col-xl-3 col-md-3 p-0 sidebar-container">
              <Sidebar />
            </div>

            {/* Main content column (scrollable) */}
            <div className="col-xl-9 col-md-9 p-0 main-content">
              <TopNavbar />
              {children}
            </div>
          </div>
        </div>
      </PageNameProvider>
    </section>
  );
}
