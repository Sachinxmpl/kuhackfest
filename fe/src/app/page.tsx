import Link from "next/link";
import { Lightbulb, Users, Award, Clock } from "lucide-react";

import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero section */}
      <section className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-900 rounded-full mb-6">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-zinc-900 mb-6">
              Study Beacon
            </h1>
            <p className="text-xl text-zinc-600 mb-8">
              Connect with peers to share knowledge and accelerate learning.
              Create a beacon to get help or offer your expertise to others.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-zinc-900 text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-zinc-200 rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-100 rounded-full mb-4">
                <Lightbulb className="w-6 h-6 text-zinc-900" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                Create a Beacon
              </h3>
              <p className="text-zinc-600">
                Post a help request with your topic, description, and urgency level.
                Your beacon is visible to all potential helpers.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-100 rounded-full mb-4">
                <Users className="w-6 h-6 text-zinc-900" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                Connect with Helpers
              </h3>
              <p className="text-zinc-600">
                Review applications from experienced peers, check their profiles,
                and select the best helper for your needs.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-100 rounded-full mb-4">
                <Award className="w-6 h-6 text-zinc-900" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                Learn and Earn
              </h3>
              <p className="text-zinc-600">
                Collaborate in a private session, rate each other, and earn
                reputation points for helping others succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent beacons feature */}
      <section className="py-20 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">
              Urgent Beacons
            </h2>
            <p className="text-lg text-zinc-600 mb-6">
              Need help fast? Create an urgent beacon with a time limit.
              Urgent beacons are prioritized in the feed and expire automatically,
              ensuring quick responses when you need them most.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-zinc-900 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to start learning together?
            </h2>
            <p className="text-xl text-zinc-300 mb-8">
              Join Study Beacon today and become part of a collaborative learning community.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary">
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-zinc-600">
          <p>&copy; {new Date().getFullYear()} Study Beacon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
