"use client"

import { useState, useEffect, useRef } from "react"
import { Copy, Check, MessageSquareShare } from "lucide-react"
import FireworksCanvas from "@/components/fireworks-canvas"
import { playDiwaliTune } from "@/lib/music"
import Link from "next/link"
import Image from "next/image"
import {
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappIcon,
  LinkedinIcon,
  TwitterIcon,
} from "react-share"

import { RWebShare } from "react-web-share";
import html2canvas from "html2canvas";

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
  const cardRef = useRef<HTMLDivElement | null>(null)
const [generatingImage, setGeneratingImage] = useState(false)

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

  const generateAndDownload = async () => {
  if (!cardRef.current) return;
  try {
    setGeneratingImage(true);

    // Capture the card area as a canvas
    const canvas = await html2canvas(cardRef.current, {
      useCORS: true, // Allow images to load from other domains
      scale: 2,      // Increases resolution
      backgroundColor: "#000", // Fallback if transparent
    });

    // Convert canvas to blob and trigger download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement("a");
      link.download = `Diwali-Wish-${formData.senderName || "YourWish"}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }, "image/png");

  } catch (err) {
    console.error("Error generating image:", err);
    alert("Something went wrong while generating your image.");
  } finally {
    setGeneratingImage(false);
  }
};





  return (
    <div className="min-h-screen  overflow-x-hidden relative ">
      {/* <div className="flex justify-between items-center  sticky top-0 z-10 max-w-5xl  mx-8 md:mx-auto">
            <div className="my-auto " >
            <Link href="https://www.arevei.com/" className="flex items-center gap-2">
            <Image src="/AR-Wordmark.svg" className="w-14 " alt="" width={300} height={300}/>
          </Link>
            </div>

          <div className="flex justify-center  mt-2">
            <Image src="/company-logo.png" className="w-16 h-16 rounded-full" alt="Arevei" width={300} height={300}/>
          </div>

          <Link
            href="https://www.instagram.com/arevei_official?igsh=MW5ranhrd2J5Njg2aQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white bg-clip-text text-transparent font-semibold flex items-center gap-1"
          >
            📸 Follow
          </Link>
          </div> */}
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

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 md:py-12" ref={cardRef}>
        {/* Header */}
        <div className="text-center mb-12">
           <div className="flex justify-center mb-4">
            <div className="my-auto " >
            <Link href="https://www.arevei.com/" className="flex items-center gap-2">
             <Image src="/company-logo.png" className="w-16 h-16 rounded-full" alt="Arevei" width={300} height={300}/>
            <Image src="/AR-Wordmark.svg" className="w-14 " alt="" width={300} height={300}/>
          </Link>
            </div>

          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold font-canela text-white mb-3">
            {isSharedWish ? "Diwali Wish for You" : "Create Your Personalized Diwali Wish"}
          </h1>
          <p className="text-lg text-gray-200 font-poppins">
            {isSharedWish
              ? "Someone special sent you a Diwali wish!"
              : "Light up someone's inbox and timeline with joy this Diwali!"}
          </p>
        </div>

        {!submitted ? (
          // Form Section
          <div className=" rounded-3xl shadow-2xl p-8 md:p-10 mb-8">
            <div className="space-y-6">
              {/* Sender Name Field */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Your Name</label>
                <input
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className=" bg-gradient-to-r from-[#3fdcff] via-white to-white text-black w-full px-4 py-3 border-2 border-yellow-200  focus:border-[#55ff8f] focus:outline-none transition bg-yellow-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Recipient Name</label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  placeholder="Who are you sending this to?"
                  className="bg-gradient-to-r from-[#3fdcff] from-5% via-white  to-white  text-black w-full px-4 py-3 border-2 border-yellow-200  focus:border-[#55ff8f] focus:outline-none transition bg-yellow-50"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Your Wish Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Wishing you light, love, and prosperity this Diwali!"
                  className="bg-gradient-to-r from-[#3fdcff] via-white to-white text-black w-full px-4 py-3 border-2 border-yellow-200  focus:border-[#55ff8f] focus:outline-none transition bg-yellow-50 resize-none h-24"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className=" cursor-pointer w-full bg-[linear-gradient(135deg,_#3fdcff,_#55ff8f)] hover:from-blue-500 hover:to-green-500 text-black font-semibold py-4 px-6  transition transform hover:scale-105 shadow-lg hover:shadow-2xl text-lg"
                style={{
                  boxShadow: "0 0 20px rgba(251, 146, 60, 0.5)",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                 Generate My Wish 
              </button>
            </div>
          </div>
        ) : (
          // Generated Card & Share Section
          <div className="space-y-8">
            {/* Festive Postcard */}
            <div className="relative" ref={cardRef} >
              <div
                className=" rounded-3xl p-8 md:p-12 shadow-2xl flex justify-center items-center min-h-[46rem]"
                style={{
    background: ` url('/Diwali-Wish-card.webp') no-repeat center/contain`,
  }}
              >
                {/* Card Content */}
                <div className="  rounded-2xl py-8 md:py-10 px-10 md:px-14 text-center space-y-6 max-w-sm  mt-26 mb-16 ">
                
                  
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center max-w-xs mx-auto space-y-3 font-canela ">
                      <p>Happy Diwali </p><p>{formData.recipientName}</p>
                    </h2>
                    <p className="text-lg text-white max-w-sm mx-auto ">From {formData.senderName}</p>
                  

                  {/* Message */}
                  <p className=" max-w-xs mx-auto mt-12  text-base  text-white leading-relaxed">
                    {formData.message}
                  </p>

                  {/* Decorative Elements */}
                  {/* <div className="flex justify-center gap-4 text-2xl">
                    <span style={{ animation: "flicker 1.5s ease-in-out infinite" }}>🪔</span>
                    <span style={{ animation: "flicker 1.5s ease-in-out infinite", animationDelay: "0.5s" }}>🪔</span>
                    <span style={{ animation: "flicker 1.5s ease-in-out infinite", animationDelay: "1s" }}>🪔</span>
                  </div> */}

                  {/* Footer */}
                  {/* <p className="text-sm text-gray-600 pt-4">✨ Made with Love ✨</p> */}
                </div>
              </div>
            </div>

          {/* <button
  onClick={generateAndDownload}
  disabled={generatingImage}
  className={`w-full relative p-[0.8px] rounded-lg transition-all duration-300 
              bg-[linear-gradient(135deg,#3fdcff,#55ff8f)] hover:bg-[linear-gradient(135deg,#3fb0ff,#55ffa8)]
              ${generatingImage ? "opacity-50 cursor-not-allowed" : ""}`}
>
  <span className="block w-full h-full rounded-[10px] bg-black text-white 
                   py-5 px-6 text-center cursor-pointer font-semibold tracking-wide">
    {generatingImage ? "Generating..." : "Download for Free"}
  </span>
</button> */}


           {!isSharedWish && (
              <div className="  rounded-3xl shadow-xl p-8 bg-black">
                <h3 className="text-2xl font-bold font-canela text-white mb-6 text-center">
                  Share Your Diwali Wish with your loved ones
                </h3>

                <div className="flex justify-center gap-4 mb-6 flex-wrap">
                  <Link href={`https://wa.me/?text=${encodeURIComponent(`🎉 Happy Diwali! Create your wish at \n${shareLink}`)}`} target="_blank" rel="noopener noreferrer">
                    <WhatsappIcon size={48} round />
                  </Link>
                  <LinkedinShareButton url={shareLink} title={`Diwali Wish from ${formData.senderName}`}>
                    <LinkedinIcon size={48} round />
                  </LinkedinShareButton>
                 
                  <TwitterShareButton
                    url={shareLink}
                    title={`Happy Diwali! Check out my personalized wish from ${formData.senderName}`}
                  >
                    <TwitterIcon size={48} round />
                  </TwitterShareButton>


                  <RWebShare
                data={{
                    text: "Check out this Diwali Wish I created!",
                    url: shareLink,
                    title: "Arevei | Happy Diwali! Create your wishes",
                }}
            >
               <button
  className=" relative  p-[0.8px] rounded-full  transition-all duration-300 
             bg-[linear-gradient(135deg,_#3fdcff,_#55ff8f)] hover:from-blue-500 hover:to-green-500"
>
  <span className="block w-full rounded-full h-full  bg-black text-white 
                    py-3 px-3 text-center cursor-pointer">
    <MessageSquareShare/>
  </span>
</button>
            </RWebShare>
                </div>
                

                {/* Copy Link Button */}
                <div className="flex gap-2 justify-center mb-6">
                  <button
                    onClick={copyToClipboard}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>

                

                {/* Link Display */}
                {/* <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-2 font-poppins">Your shareable link:</p>
                  <p className="font-mono text-orange-600 font-bold break-all text-sm">{shareLink}</p>
                </div> */}
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
  className="w-full relative  p-[0.8px] rounded-sm transition-all duration-300 
             bg-[linear-gradient(135deg,_#3fdcff,_#55ff8f)] hover:from-blue-500 hover:to-green-500"
>
  <span className="block w-full h-full rounded-[10px] bg-black text-white 
                    py-5 px-6 text-center cursor-pointer">
    {isSharedWish ? "Create Your Own Wish" : "Create Another Wish"}
  </span>
</button>


          </div>
        )}
      </div>

      {/* <div className=" flex flex-row ">
        <Image src="/diwali.png" className="w-1/2" alt="" width={800} height={800} />
        <Image src="/home2.png" className="w-1/2" alt="" width={800} height={800}/>
      </div> */}

      {/* Footer */}
      <footer className="">
       <Link href="https://www.arevei.com/" className="text-orange-600 flex justify-center items-center"> 
        <p className="text-white  px-3 pb-5"> Made With Love ❤️ by Arevei </p>
      </Link>
      </footer>
    </div>
  )
}
