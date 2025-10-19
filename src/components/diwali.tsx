import { Share2, Copy, MessageCircle, Download } from "lucide-react";
import html2canvas from "html2canvas-pro";

interface SocialShareProps {
  name: string;
  message: string;
}

const SocialShare = ({ name, message }: SocialShareProps) => {
  const shareText = `Happy Diwali! ${message}`;
  const shareUrl = window.location.href;

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`;
    window.open(url, "_blank");
  };

  const handleInstagram = () => {
    
  };

  const handleLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
     
    } catch (err) {
     
    }
  };

  const handleDownload = async () => {
    try {
      const cardElement = document.getElementById("wish-card-download");
      if (!cardElement) return;


      console.log("hgghfgh")

      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });


      const link = document.createElement("a");
      link.download = `diwali-wish-${name.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

     
    } catch (err) {
    console.log(err)
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 mt-8 animate-slide-up">
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
        <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
          <Share2 className="w-5 h-5 text-primary" />
          Share Your Festive Wish
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button
            onClick={handleDownload}
            className="h-12 font-medium col-span-2 md:col-span-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
          <button
            onClick={handleWhatsApp}
            className="h-12 font-medium hover:border-primary hover:text-primary transition-all"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </button>
          <button
            onClick={handleInstagram}
            className="h-12 font-medium hover:border-accent hover:text-accent transition-all"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Instagram
          </button>
          <button
            onClick={handleLinkedIn}
            className="h-12 font-medium hover:border-primary hover:text-primary transition-all"
          >
            <Share2 className="w-4 h-4 mr-2" />
            LinkedIn
          </button>
          <button
            onClick={handleCopyLink}
            className="h-12 font-medium hover:border-secondary hover:text-secondary transition-all"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialShare;
