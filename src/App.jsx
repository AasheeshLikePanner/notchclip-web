import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlay, FiX, FiClipboard } from 'react-icons/fi'
import { FaApple, FaWindows, FaUbuntu } from 'react-icons/fa'

function App() {
  const [hoveredPlatform, setHoveredPlatform] = useState(null)
  const [showVideo, setShowVideo] = useState(false)
  const [showNotch, setShowNotch] = useState(false)
  const [clipboardItems, setClipboardItems] = useState([])

  // Listen for Ctrl+Shift+V to show the notch clipboard
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault()
        setShowNotch(true)
        // Try to read clipboard text (browser support required)
        try {
          const text = await navigator.clipboard.readText()
          setClipboardItems(text ? [text] : [])
        } catch {
          setClipboardItems(['Clipboard access not supported in this browser.'])
        }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e3e7ee] flex items-center justify-center relative">
      {/* Top Notch (shows only when showNotch is true) */}
      <AnimatePresence>
        {showNotch && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50"
          >
            {/* Big Notch with clipboard content inside */}
            <div className="w-[480px] h-[100px] bg-[#18181b] rounded-b-[48px] shadow-2xl flex items-center px-8 relative">
              <FiClipboard className="text-white text-2xl mr-4" />
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-white text-[16px] font-semibold mb-1 flex items-center gap-2">
                  Clipboard
                </span>
                <div className="text-[#e5e5e5] text-[15px] min-h-[32px] max-h-[48px] overflow-y-auto pr-2">
                  {clipboardItems.length > 0
                    ? clipboardItems.map((item, i) => (
                        <div key={i} className="break-words">{item}</div>
                      ))
                    : <span>Your copied items show here.</span>
                  }
                </div>
              </div>
              <button
                className="absolute top-2 right-4 px-2 py-1 rounded-lg bg-[#232326] text-[#fff] text-[13px] hover:bg-[#333] transition cursor-pointer"
                onClick={() => setShowNotch(false)}
              >
                Close
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
        className="relative w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl px-7 py-10 flex flex-col items-center"
        style={{ boxShadow: '0 8px 40px 0 rgba(0,0,0,0.10)' }}
      >
        {/* Logo */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f5f5f5] to-[#e3e7ee] flex items-center justify-center shadow mb-4 mt-2">
          <span className="text-[30px] font-black text-[#1a1a1a] tracking-tight">N</span>
        </div>
        {/* Title */}
        <h1 className="text-[30px] font-bold tracking-tight mb-1 text-[#18181b]">NotchClip</h1>
        <p className="text-[15px] text-[#6e6e73] font-light text-center mb-6 max-w-xs">
          <span className="font-medium text-[#1a1a1a]">Clipboard access</span> <span className="opacity-60">made fast & easy.</span>
        </p>
        {/* Shortcut instruction */}
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
            className="aspect-video bg-[#f5f5f5] rounded-xl overflow-hidden cursor-pointer border border-[#ececec] flex items-center justify-center transition-shadow hover:shadow-lg"
            onClick={() => setShowVideo(true)}
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center mb-2">
                <FiPlay className="text-[#18181b] text-[20px]" />
              </div>
              <p className="text-[#6e6e73] text-[14px] tracking-wide">Watch demo</p>
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
                <p className="text-[#6e6e73] text-[15px] tracking-wide">Product demo video</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App