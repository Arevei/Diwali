"use client"

import { useState, useEffect } from "react"
import { Copy, Check } from "lucide-react"
import FireworksCanvas from "@/components/fireworks-canvas"
import { playDiwaliTune } from "@/lib/music"
import Link from "next/link"
import Image from "next/image"

export default function DiwaliWishCreator() {
  const [formData, setFormData] = useState({
    senderName: "",
    recipientName: "",
    message: "Wishing you light, love, and prosperity this Diwali!",
  })

  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [isSharedWish, setIsSharedWish] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    
    const sharedSenderName = params.get("sender")
    const sharedRecipientName = params.get("recipient")
    const sharedMessage = params.get("message")

    if (sharedSenderName && sharedRecipientName && sharedMessage) {
      setFormData({
        senderName: sharedSenderName,
        recipientName: sharedRecipientName,
        message: sharedMessage,
      })
      setSubmitted(true)
      setIsSharedWish(true)
    }

    // Play Diwali tune on load
    let unlocked = false
    const tryPlay = () => {
      if (unlocked) return
      unlocked = true
      playDiwaliTune().catch(() => {})
    }
    playDiwaliTune().catch(() => {})
    window.addEventListener("pointerdown", tryPlay, { once: true })
    const onVis = () => {
      if (document.visibilityState === "visible") playDiwaliTune().catch(() => {})
    }
    document.addEventListener("visibilitychange", onVis)
    return () => {
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [])

  interface FormData {
    senderName: string
    recipientName: string
    message: string
  }

  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name: rawName, value } = e.target
    const name = rawName as keyof FormData
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }))
  }

  interface SubmitHandler {
    (e: React.MouseEvent<HTMLButtonElement>): void
  }

  const handleSubmit: SubmitHandler = (e) => {
    e.preventDefault()
    if (formData.senderName && formData.recipientName && formData.message) {
      setSubmitted(true)
      const params = new URLSearchParams({
        sender: formData.senderName,
        recipient: formData.recipientName,
        message: formData.message,
      })
      setShareLink(`${window.location.origin}?${params.toString()}`)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnPlatform = (platform:"whatsapp" | "instagram" | "linkedin") => {
    const text = `${shareLink}`
    const urls: Record<"whatsapp" | "instagram" | "linkedin", string>= {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      instagram: `https://instagram.com`,
      linkedin: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`,
    }
    if (urls[platform]) window.open(urls[platform], "_blank")
  }

  const FloatingElements = () => {
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 7 + Math.random() * 2,
      type: i % 3 === 0 ? "rocket" :  "anaar",
    }))

    return (
      <>
        {elements.map((el) => (
          <div
            key={el.id}
            className="absolute pointer-events-none"
            style={{
            left: `${el.left}%`,
            animation: `${
              el.type === "anaar" ? "rise-up" : "float-around"
            } ${el.duration}s ease-in-out infinite`,
            animationDelay: `${el.delay}s`,
          }}
          >
            {el.type === "rocket" && (
               <div className="text-3xl " style={{ animationDuration: "0.8s" }}>
                <Image src="/charkhi.gif" className="w-16" alt="" width={300} height={300} />
              </div>
              
            )}
            {el.type === "anaar" && (
              <div className="text-2xl" style={{ animation: "sparkle 0.6s ease-in-out infinite" }}>
                <Image src="/sky.png" className="w-16" alt="" width={300} height={300}/>
              </div>
            )}
            
          </div>
        ))}
        <style>{`
          @keyframes float-up {
            0% {
              transform: translateY(0) rotateZ(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotateZ(360deg);
              opacity: 0;
            }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.3); }
          }
            @keyframes rise-up {
          0% {
            transform: translateY(100vh) scale(0.8);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-20vh) scale(1);
            opacity: 0;
          }
        }

          @keyframes float-around {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-40vh) rotate(15deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(0) rotate(-15deg);
            opacity: 1;
          }
        }
         
        `}</style>
      </>
    )
  }

  return (
    <div className="min-h-screen  overflow-x-hidden relative">
      <FireworksCanvas
        className="pointer-events-none fixed inset-0 z-0"
        autoStart={true}
        density={0.9}
        withSound={true}
      />

      {/* Floating animated elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
        <FloatingElements />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <span className="text-5xl animate-bounce">🎆</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-yellow-500 to-purple-600 mb-3">
            {isSharedWish ? "Diwali Wish for You" : "Create Your Personalized Diwali Wish"}
          </h1>
          <p className="text-lg text-gray-300">
            {isSharedWish
              ? "Someone special sent you a Diwali wish!"
              : "Light up someone inbox and timeline with joy this Diwali!"}
          </p>
        </div>

        {!submitted ? (
          // Form Section
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 md:p-10 mb-8">
            <div className="space-y-6">
              {/* Sender Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:border-orange-500 focus:outline-none transition bg-yellow-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient Name</label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  placeholder="Who are you sending this to?"
                  className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:border-orange-500 focus:outline-none transition bg-yellow-50"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Wishing you light, love, and prosperity this Diwali!"
                  className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:border-orange-500 focus:outline-none transition bg-yellow-50 resize-none h-24"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-4 px-6 rounded-xl transition transform hover:scale-105 shadow-lg hover:shadow-2xl text-lg"
                style={{
                  boxShadow: "0 0 20px rgba(251, 146, 60, 0.5)",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                ✨ Generate My Wish ✨
              </button>
            </div>
          </div>
        ) : (
          // Generated Card & Share Section
          <div className="space-y-8">
            {/* Festive Postcard */}
            <div className="relative">
              <div
                className="bg-gradient-to-br from-purple-600 via-orange-500 to-yellow-400 rounded-3xl p-8 md:p-12 shadow-2xl"
              >
                {/* Card Content */}
                <div className="bg-white/95 backdrop-blur rounded-2xl p-8 md:p-10 text-center space-y-6">
                  {/* Decorative Elements */}
                  <div className="flex justify-between text-3xl opacity-50 mb-4">
                    <span>🎆</span>
                    <span>🪔</span>
                    <span>🎆</span>
                  </div>

                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-purple-600 mb-2">
                      Happy Diwali, {formData.recipientName}!
                    </h2>
                    <p className="text-sm text-gray-600">From {formData.senderName}</p>
                  </div>

                  {/* Message */}
                  <p className="text-lg md:text-xl text-gray-800 italic font-medium leading-relaxed">
                    {formData.message}
                  </p>

                  {/* Decorative Elements */}
                  <div className="flex justify-center gap-4 text-2xl">
                    <span style={{ animation: "flicker 1.5s ease-in-out infinite" }}>🪔</span>
                    <span style={{ animation: "flicker 1.5s ease-in-out infinite", animationDelay: "0.5s" }}>🪔</span>
                    <span style={{ animation: "flicker 1.5s ease-in-out infinite", animationDelay: "1s" }}>🪔</span>
                  </div>

                  {/* Footer */}
                  <p className="text-sm text-gray-600 pt-4">✨ Made with Love ✨</p>
                </div>
              </div>
            </div>

            {!isSharedWish && (
              <div className="bg-white/95 backdrop-blur rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Share Your Diwali Wish! 🌟</h3>

                {/* Share Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <button
                    onClick={() => shareOnPlatform("whatsapp")}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition transform hover:scale-105"
                  >
                    💬 WhatsApp
                  </button>
                  <button
                    onClick={() => shareOnPlatform("instagram")}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl transition transform hover:scale-105"
                  >
                    📸 Instagram
                  </button>
                  <button
                    onClick={() => shareOnPlatform("linkedin")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition transform hover:scale-105"
                  >
                    💼 LinkedIn
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                {/* Link Display */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">Your shareable link:</p>
                  <p className="font-mono text-orange-600 font-bold break-all text-sm">{shareLink}</p>
                </div>
              </div>
            )}

            {/* Create Another */}
            <button
              onClick={() => {
                setSubmitted(false)
                setIsSharedWish(false)
                setFormData({
                  senderName: "",
                  recipientName: "",
                  message: "Wishing you light, love, and prosperity this Diwali!",
                })
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition"
            >
              {isSharedWish ? "Create Your Own Wish" : "Create Another Wish"}
            </button>
          </div>
        )}
      </div>

      <div className=" flex flex-row ">
        <Image src="/diwali.png" className="w-1/2" alt="" width={800} height={800} />
        <Image src="/home2.png" className="w-1/2" alt="" width={800} height={800}/>
      </div>

      {/* Footer */}
      <footer className="relative z-10 flex justify-center items-center text-center py-8 px-4 border-t   ">

       <Link href="https://www.arevei.com/" className="text-orange-600 flex justify-center items-center"> <Image src="/company-logo.png" className="w-14 rounded-b-md" alt="" width={300} height={300}/>
        <p className="text-white font-semibold">✨ Made by Arevei ✨</p>
      </Link>
      </footer>
    </div>
  )
}
