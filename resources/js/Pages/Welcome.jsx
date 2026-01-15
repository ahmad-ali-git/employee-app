import { Link, Head } from '@inertiajs/react';
import { Button } from "@/components/ui/button"

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-black">
                
                {/* 1. The Title */}
                <h1 className="text-4xl font-bold mb-8 text-zinc-800">
                    Employee System
                </h1>

                {/* 2. The Buttons */}
                <div className="flex gap-6">
                    {/* Link to Login */}
                    <Link href={route('login')}>
                        <Button size="lg">Log in</Button>
                    </Link>

                    {/* Link to Register */}
                    <Link href={route('register')}>
                        <Button variant="outline" size="lg">Register</Button>
                    </Link>
                </div>

            </div>
        </>
    );
}