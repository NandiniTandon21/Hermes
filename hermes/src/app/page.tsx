import {CrossChainMessageForm} from "@/app/dashboard/page";
import ThemeSwitcher from "@/components/themeSwitcher";
import {AnimatedGrid} from "@/components/ui/animatedGrid";

export default function Home() {
    return (
        <div className="min-h-screen w-full font-[family-name:var(--font-geist-sans)]">
            {/* Split layout container */}
            <div className="flex flex-col lg:flex-row min-h-screen w-full">
                {/* Left half - Stylish project name */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start p-8 lg:p-16 relative z-10">
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse">
                        HERMES
                    </h1>
                    <p className="text-xl md:text-2xl mt-6 max-w-md text-center lg:text-left">
                        Bridging chains with elegant messaging solutions
                    </p>
                    <div className="mt-10">
                        <CrossChainMessageForm/>
                    </div>
                </div>

                {/* Right half - Animated grid */}
                <div className="w-full lg:w-1/2 h-[40vh] lg:h-screen relative overflow-hidden">
                    <AnimatedGrid className="w-full h-full" />
                </div>
            </div>

            {/* Theme switcher */}
            <ThemeSwitcher
                currentTheme="dark"
                className="absolute top-4 right-4 z-20"
            />
        </div>
    );
}
