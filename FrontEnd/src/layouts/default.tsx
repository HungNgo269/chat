import { Divider } from "@heroui/divider";

import { Navbar } from "@/components/navbar";
import { SideBar } from "@/components/sidebar/sidebar";

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex flex-col h-screen overflow-hidden bg-background  min-w-screen">
            <Navbar />
            <Divider />
            <div className="flex flex-row flex-1  min-h-0 ">
                <SideBar />
                <Divider orientation="vertical" />
                <main className=" flex-1  m-3 bg-content1 text-content1-foreground overflow-hidden rounded-md">
                    {children}
                </main>
            </div>
        </div>
    );
}
