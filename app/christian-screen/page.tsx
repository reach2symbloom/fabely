"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ChristianScreenPage() {
  const router = useRouter()

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left Sidebar */}
      <div className="w-1/3 border-r border-border p-8 flex flex-col items-center justify-between bg-card">
        {/* Top Section */}
        <div className="w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="text-6xl">📚</div>
          </div>
          <h2 className="text-2xl font-semibold mb-4">This is your Fabely library.</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Your books, essays, and whitepapers will appear here.
          </p>
          <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 py-6">
            <span className="mr-2">+</span> Create new
          </Button>
        </div>

        {/* Bottom User Section */}
        <div className="w-full border-t border-border pt-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
              👤
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Christian Davis</h3>
              <p className="text-sm text-primary hover:underline cursor-pointer">Upgrade plan</p>
            </div>
          </div>
          <button
            onClick={() => router.back()}
            className="w-full mt-4 px-4 py-2 rounded-md border border-border text-sm hover:bg-muted transition"
          >
            Back
          </button>
        </div>
      </div>

      {/* Right Main Content Area */}
      <div className="w-2/3 p-12 overflow-auto flex flex-col">
        <h1 className="text-4xl font-bold mb-12 text-center">Start your next great work</h1>

        {/* Three Cards Grid */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          {/* Card 1: Start from blank page */}
          <div className="border border-border rounded-lg p-8 bg-card hover:shadow-lg transition cursor-pointer">
            <div className="flex justify-center mb-6">
              <div className="text-6xl">📝</div>
            </div>
            <h3 className="text-lg font-semibold text-center mb-3">Start from a blank page</h3>
            <p className="text-sm text-muted-foreground text-center">Description text</p>
            <div className="mt-6 text-center">
              <span className="text-xs text-muted-foreground">txt_docx.pdf</span>
            </div>
          </div>

          {/* Card 2: Bring in your notes */}
          <div className="border border-border rounded-lg p-8 bg-card hover:shadow-lg transition cursor-pointer">
            <div className="flex justify-center mb-6">
              <div className="text-6xl">🔗</div>
            </div>
            <h3 className="text-lg font-semibold text-center mb-3">Bring in your notes</h3>
            <p className="text-sm text-muted-foreground text-center">
              Connect to an app to import your notes and research, or upload via your device.
            </p>
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              <div className="text-2xl">📌</div>
              <div className="text-2xl">💜</div>
              <div className="text-2xl">📦</div>
              <div className="text-2xl">🍏</div>
              <div className="text-2xl">☁️</div>
              <div className="text-2xl">⭐</div>
            </div>
            <div className="mt-6 text-center">
              <span className="text-xs text-muted-foreground">txt_docx.pdf</span>
            </div>
          </div>

          {/* Card 3: Import your manuscript */}
          <div className="border border-border rounded-lg p-8 bg-card hover:shadow-lg transition cursor-pointer">
            <div className="flex justify-center mb-6">
              <div className="text-6xl">📖</div>
            </div>
            <h3 className="text-lg font-semibold text-center mb-3">Import your manuscript</h3>
            <p className="text-sm text-muted-foreground text-center">
              Fabely matches your existing manuscript structure one-to-one.
            </p>
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              <div className="text-2xl">📄</div>
              <div className="text-2xl">➡️</div>
              <div className="text-2xl">Ⓢ</div>
              <div className="text-2xl">🦋</div>
            </div>
            <div className="mt-6 text-center">
              <span className="text-xs text-muted-foreground">txt_docx.pdf</span>
            </div>
          </div>
        </div>

        {/* Bottom Mobile Section */}
        <div className="mt-auto border border-border rounded-lg p-8 bg-card">
          <div className="flex items-center justify-between">
            <div className="text-5xl">📱</div>
            <div className="flex-1 ml-6">
              <h4 className="font-semibold mb-2">Download Fabely on mobile for seamless note taking and manuscript reading.</h4>
              <div className="flex gap-4">
                <button className="px-4 py-2 rounded-md border border-border text-sm hover:bg-muted transition">
                  🍎 Apple store
                </button>
                <button className="px-4 py-2 rounded-md border border-border text-sm hover:bg-muted transition">
                  🎮 Play store
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
