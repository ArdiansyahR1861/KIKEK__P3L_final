import Navbar from "@/component/navbar/navbar";

export default function BelanjaLayout({ children }) {
    return (
        <div className="">
            <Navbar />
            <main className="px-10">{children}</main>
        </div>
    );
}