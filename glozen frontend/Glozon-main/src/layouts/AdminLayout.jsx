import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Briefcase,
  MessageSquare,
  Users,
  Mail,
  FileText,
  Star,
  Settings,
  Bell,
  Search,
  UserCircle2,
} from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();

  const navigate = useNavigate();

  // protect admin route
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return null;
  }
  // const role = JSON.parse(atob(token?.split(".")[1]))?.role;
  // if (!role || role !== "admin") {
  //   navigate("/");
  //   return null;
  // }

  const handleLogout = () => {
    // remove login data

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    // go login page

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-[#0F172A]">
      <div className="flex">
        {/* SIDEBAR */}

        <aside
          className="
          w-64
          bg-white
          border-r
          border-zinc-200
          min-h-screen
          flex
          flex-col
        "
        >
          {/* LOGO */}

          <div
            className="
            h-20
            px-6
            flex
            items-center
            gap-3
            border-b
            border-zinc-200
          "
          >
            <div
              className="
              w-12
              h-12
              rounded-xl
              border
              border-zinc-200
              p-1
              overflow-hidden
            "
            >
              <img
                src="/Logo.png"
                alt="Glozon Fintax"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <p className="font-semibold text-lg">Glozon Fintax</p>

              <p className="text-xs text-zinc-500">Internal Portal</p>
            </div>
          </div>

          {/* MENU */}

          <nav className="mt-3 px-3 space-y-1 flex-1">
            <NavItem
              to="/admin"
              icon={Home}
              label="Hero Section"
              active={location.pathname === "/admin"}
            />

            <NavItem
              to="/admin/services"
              icon={Briefcase}
              label="Services"
              active={location.pathname === "/admin/services"}
            />

            <NavItem
              to="/admin/inquiries"
              icon={MessageSquare}
              label="Inquiries"
              active={location.pathname === "/admin/inquiries"}
            />

            <NavItem
              to="/admin/team"
              icon={Users}
              label="Team"
              active={location.pathname === "/admin/team"}
            />

            <NavItem
              to="/admin/client-onboarding"
              icon={Mail}
              label="On Boarding"
              active={location.pathname === "/admin/client-onboarding"}
            />

            {/* Partners */}
<NavItem
  to="/admin/partners"
  icon={Users}
  label="Partners"
  active={location.pathname === "/admin/partners"}
/>

            <NavItem
              to="/admin/careers"
              icon={FileText}
              label="Careers"
              active={location.pathname === "/admin/careers"}
            />

            <NavItem
              to="/admin/testimonials"
              icon={Star}
              label="Testimonials"
              active={location.pathname === "/admin/testimonials"}
            />

            <NavItem
              to="/admin/settings"
              icon={Settings}
              label="Settings"
              active={location.pathname === "/admin/settings"}
            />
          </nav>

          {/* LOGOUT */}

          <div
            className="
            p-4
            border-t
            border-zinc-200
          "
          >
            <button
              onClick={handleLogout}
              className="
              w-full
              flex
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-semibold
              text-red-500
              hover:bg-red-50
              transition
              "
            >
              <UserCircle2 className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}

        <div className="flex-1">
          <header
            className="
            h-20
            bg-white
            border-b
            border-zinc-200
            px-6
            flex
            items-center
            justify-between
          "
          >
            <h1 className="text-2xl font-semibold">Dashboard</h1>

            <div className="flex items-center gap-4">
              <div
                className="
                hidden
                md:flex
                items-center
                gap-3
                bg-[#F6F7FB]
                border
                border-zinc-200
                rounded-xl
                px-4
                py-2
                w-72
              "
              >
                <Search
                  className="
                  w-4
                  h-4
                  text-zinc-500
                "
                />

                <input
                  placeholder="Search..."
                  className="
                  bg-transparent
                  outline-none
                  text-sm
                  w-full
                  "
                />
              </div>

              <button
                className="
                relative
                w-10
                h-10
                rounded-xl
                border
                border-zinc-200
                flex
                items-center
                justify-center
              "
              >
                <Bell
                  className="
                  w-5
                  h-5
                  text-zinc-600
                "
                />

                <span
                  className="
                  absolute
                  -top-1
                  -right-1
                  w-5
                  h-5
                  rounded-full
                  bg-red-500
                  text-white
                  text-[10px]
                  flex
                  items-center
                  justify-center
                "
                >
                  3
                </span>
              </button>
            </div>
          </header>

          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function NavItem({ to, icon: Icon, label, active }) {
  return (
    <Link to={to}>
      <div
        className={`
        flex
        items-center
        gap-3
        rounded-xl
        px-4
        py-3
        text-sm
        font-medium
        transition

        ${
          active
            ? "bg-zinc-100 text-zinc-900"
            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
        }

        `}
      >
        <Icon className="w-5 h-5" />

        {label}
      </div>
    </Link>
  );
}
