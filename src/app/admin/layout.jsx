import SidebarAdmin from "@/component/SidebarAdmin/SidebarAdmin";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <SidebarAdmin />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
