import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CrossChainMessageForm({
                              className,
                              ...props
                          }: React.ComponentProps<"form">) {
    return (
        <form className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to login to your account
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="souceChain">Source Chain</Label>
                    <Input id="souceChain" type="souceChain" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="destinationChain">Destination Chain</Label>
                    <Input id="destinationChain" type="destinationChain" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="message">Message</Label>
                    </div>
                    <Input id="message" type="text" required />
                </div>
                <Button
                    variant="slide"
                    radius="md"
                    name1="Send Message"
                    name2="Deliver via Hermes"
                    className="hover:from-amber-400 hover:via-yellow-500 hover:to-orange-500 hover:shadow-amber-500/40 hover:shadow-2xl hover:ring-2 hover:ring-amber-400/50 transition-all duration-700"
                />
            </div>
            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                    Sign up
                </a>
            </div>
        </form>
    )
}
