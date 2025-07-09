import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiX, FiShare, FiTwitter, FiGithub, FiCheck } from 'react-icons/fi';
import { FaApple, FaWindows, FaUbuntu } from 'react-icons/fa';
import icon from '../public/icon.png'
import { toast } from 'react-hot-toast';
import demo from './assets/demo.mp4'

// Animated Grid Background Component
const AnimatedGrid = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const time = timestamp * 0.001;
      const gridSize = 60;
      const offsetX = (time * 20) % gridSize;
      const offsetY = (time * 15) % gridSize;

      // Grid lines with smooth moving effect
      ctx.strokeStyle = 'rgba(24, 24, 27, 0.08)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = -gridSize + offsetX; x < canvas.width + gridSize; x += gridSize) {
        const opacity = 0.05 + Math.sin(time + x * 0.01) * 0.03;
        ctx.strokeStyle = `rgba(24, 24, 27, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = -gridSize + offsetY; y < canvas.height + gridSize; y += gridSize) {
        const opacity = 0.05 + Math.cos(time + y * 0.01) * 0.03;
        ctx.strokeStyle = `rgba(24, 24, 27, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Floating dots at intersections
      ctx.fillStyle = 'rgba(24, 24, 27, 0.15)';
      for (let x = -gridSize + offsetX; x < canvas.width + gridSize; x += gridSize) {
        for (let y = -gridSize + offsetY; y < canvas.height + gridSize; y += gridSize) {
          const dotSize = 2 + Math.sin(time + x * 0.01 + y * 0.01) * 1;
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-90"
      style={{ pointerEvents: 'none' }}
    />
  );
};

function App() {
  const [hoveredPlatform, setHoveredPlatform] = useState(null)
  const [showVideo, setShowVideo] = useState(false)
  const [showNotch, setShowNotch] = useState(false)
  const [copied, setCopied] = useState(false)
  const videoRef = useRef(null);

  // Listen for Ctrl+Shift+V to show the notch clipboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault()
        setShowNotch(true)
      }
      // Hide on Escape
      if (e.key === 'Escape') setShowNotch(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const platforms = [
    { id: 'mac', name: 'macOS', icon: <FaApple className="text-[22px]" /> },
    { id: 'windows', name: 'Windows', icon: <FaWindows className="text-[22px]" /> },
    { id: 'linux', name: 'Linux', icon: <FaUbuntu className="text-[22px]" /> }
  ]

  const handleShare = () => {
    if (copied) return
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleDownload = (platform) => {
    switch (platform) {
      case 'windows':
        window.open('https://github.com/AasheeshLikePanner/clipboard/releases/download/v1.0.0/notch-clipboard-setup-0.0.0-x64.msi', '_blank');
        break;
      case 'linux':
        window.open('https://github.com/AasheeshLikePanner/clipboard/releases/download/v1.0.0/NotchClipboard-linux-x64.AppImage', '_blank');
        break;
      case 'mac':
        toast.error('The macOS version will be available soon.');
        break;
      default:
        break;
    }
  };

  const socialCards = [
    {
      id: 'share',
      icon: copied ? <FiCheck className="text-xl" /> : <FiShare className="text-xl" />,
      text: copied ? 'Copied!' : 'Share',
      action: handleShare,
    },
    {
      id: 'twitter',
      icon: <FiTwitter className="text-xl" />,
      text: 'Twitter',
      action: () => window.open('https://x.com/aasheeshLike', '_blank'),
    },
    {
      id: 'github',
      icon: <FiGithub className="text-xl" />,
      text: 'GitHub',
      action: () => window.open('https://github.com/AasheeshLikePanner', '_blank'),
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      
      <AnimatedGrid />
      
      {/* Top Notch */}
      <AnimatePresence>
        {showNotch && (
          <motion.div
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="w-auto h-auto bg-black/90 backdrop-blur-xl rounded-b-[32px] shadow-2xl flex items-center justify-center px-6 py-4 relative space-x-3">
              {socialCards.map((card) => {
                const isShareCard = card.id === 'share';
                const isCopied = isShareCard && copied;
                return (
                  <motion.div
                    key={card.id}
                    whileHover={{ y: -2, scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    onClick={card.action}
                    className={`flex flex-col items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-xl w-20 h-20 text-center transition-all duration-200 ${
                      isCopied ? 'cursor-default' : 'cursor-pointer hover:bg-white/20'
                    }`}
                  >
                    <div className={`mb-1 transition-colors ${isCopied ? 'text-green-400' : 'text-white'}`}>{card.icon}</div>
                    <span className={`text-xs font-medium transition-colors ${isCopied ? 'text-green-400' : 'text-white/90'}`}>{card.text}</span>
                  </motion.div>
                )
              })}
              <button
                className="absolute top-2 right-3 p-1 rounded-full bg-white/10 text-white/70 text-xs hover:bg-white/20 hover:text-white transition-all cursor-pointer"
                onClick={() => setShowNotch(false)}
              >
                <FiX />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-md px-7 py-10 flex flex-col items-center z-10"
        style={{ boxShadow: '0 8px 40px 0 rgba(0,0,0,0.10)' }}
      >
        {/* App Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow mb-4 mt-2">
          <img src={icon} draggable={false} alt="" />
        </div>

        {/* Title */}
        <h1 className="text-[30px] font-bold tracking-tight mb-1 text-[#18181b]">NotchClip</h1>
        <p className="text-[15px] text-[#6e6e73] font-light text-center mb-6 max-w-xs">
          <span className="font-medium text-[#1a1a1a]">Clipboard access</span> <span className="opacity-60">made fast & easy.</span>
        </p>

        {/* Keyboard Shortcut */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <span className="text-[#18181b] text-[15px] font-medium">Press these keys to open the notch of clipboard:</span>
          <div className="flex items-center gap-1">
            <kbd className="bg-[#18181b] text-white px-3 py-2 rounded-lg text-[16px] font-semibold tracking-wide shadow cursor-pointer select-none">⌃</kbd>
            <span className="text-[#b0b0b0] text-[20px] font-bold">+</span>
            <kbd className="bg-[#18181b] text-white px-3 py-2 rounded-lg text-[16px] font-semibold tracking-wide shadow cursor-pointer select-none">⇧</kbd>
            <span className="text-[#b0b0b0] text-[20px] font-bold">+</span>
            <kbd className="bg-[#18181b] text-white px-3 py-2 rounded-lg text-[16px] font-semibold tracking-wide shadow cursor-pointer select-none">V</kbd>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex gap-3 w-full justify-center mb-8">
          {platforms.map((platform) => (
            <motion.button
              key={platform.id}
              whileHover={{ y: -2, scale: 1.05 }}
              onHoverStart={() => setHoveredPlatform(platform.id)}
              onHoverEnd={() => setHoveredPlatform(null)}
              onClick={() => handleDownload(platform.id)}
              className={`flex flex-col items-center px-4 py-3 rounded-xl transition-all duration-200 shadow-sm cursor-pointer ${
                hoveredPlatform === platform.id
                  ? 'bg-[#18181b] text-white scale-105'
                  : 'bg-white/80 text-[#18181b]'
              }`}
              style={{
                border: hoveredPlatform === platform.id ? '1.5px solid #18181b' : '1.5px solid #ececec',
                boxShadow: hoveredPlatform === platform.id ? '0 4px 16px rgba(24,24,27,0.08)' : 'none'
              }}
            >
              <span className="mb-1">{platform.icon}</span>
              <span className="text-[13px] mb-0.5 tracking-wide">Download</span>
              <span className="text-[15px] font-semibold tracking-tight">{platform.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <div
            className="aspect-video bg-black rounded-xl overflow-hidden cursor-pointer border border-[#ececec] flex items-center justify-center transition-shadow hover:shadow-lg relative"
            onClick={() => setShowVideo(true)}
            onMouseEnter={() => {
              if (videoRef.current) {
                videoRef.current.play();
              }
            }}
            onMouseLeave={() => {
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
            }}
          >
            <video
              ref={videoRef}
              src={demo}
              muted
              loop
              playsInline
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center transition-opacity opacity-100 hover:opacity-0">
              <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center mb-2">
                <FiPlay className="text-[#18181b] text-[20px]" />
              </div>
              <p className="text-white text-[14px] tracking-wide font-medium">Watch demo</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-50 flex items-center justify-center p-5"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.10)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                onClick={() => setShowVideo(false)}
              >
                <FiX className="text-[#1a1a1a] text-[18px]" />
              </button>
              <div className="aspect-video bg-[#f5f5f5] flex items-center justify-center">
                <video src={demo} autoPlay autoFocus></video>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App;