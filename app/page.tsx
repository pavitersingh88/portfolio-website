"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import {
  Moon,
  Sun,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronDown,
  MapPin,
  Phone,
  ArrowRight,
  Star,
  Zap,
  Award,
  Calendar,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ContactForm } from "@/components/contact-form"

// Performance optimized Intersection Observer hook
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      { threshold: 0.1, rootMargin: "50px", ...options },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasIntersected, options])

  return [ref, isIntersecting, hasIntersected] as const
}

// Optimized Animated Background Component
const AnimatedBackground = ({ darkMode }: { darkMode: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()

    const stars: Array<{ x: number; y: number; size: number; opacity: number; speed: number }> = []
    const meteors: Array<{ x: number; y: number; length: number; speed: number; angle: number }> = []

    // Create stars
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        opacity: Math.random(),
        speed: Math.random() * 0.02,
      })
    }

    // Create meteors
    for (let i = 0; i < 3; i++) {
      meteors.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 80 + 20,
        speed: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2,
      })
    }

    const animate = () => {
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (darkMode) {
        // Draw stars
        stars.forEach((star) => {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
          ctx.fill()

          star.opacity += star.speed
          if (star.opacity > 1 || star.opacity < 0) star.speed *= -1
        })

        // Draw meteors
        meteors.forEach((meteor) => {
          const gradient = ctx.createLinearGradient(
            meteor.x,
            meteor.y,
            meteor.x - Math.cos(meteor.angle) * meteor.length,
            meteor.y - Math.sin(meteor.angle) * meteor.length,
          )
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

          ctx.beginPath()
          ctx.moveTo(meteor.x, meteor.y)
          ctx.lineTo(
            meteor.x - Math.cos(meteor.angle) * meteor.length,
            meteor.y - Math.sin(meteor.angle) * meteor.length,
          )
          ctx.strokeStyle = gradient
          ctx.lineWidth = 2
          ctx.stroke()

          meteor.x += Math.cos(meteor.angle) * meteor.speed
          meteor.y += Math.sin(meteor.angle) * meteor.speed

          if (meteor.x > canvas.width + 100 || meteor.y > canvas.height + 100) {
            meteor.x = -100
            meteor.y = Math.random() * canvas.height
          }
        })
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    const handleResize = () => {
      resizeCanvas()
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("resize", handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [darkMode, isVisible])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: darkMode ? "#000000" : "transparent" }}
    />
  )
}

// Floating Shapes Component
const FloatingShapes = () => {
  const shapes = useMemo(
    () => [
      { color: "bg-blue-500", size: "w-2 h-8", rotation: "45deg", top: "20%", left: "10%", delay: "0s" },
      { color: "bg-red-500", size: "w-2 h-6", rotation: "-30deg", top: "60%", left: "85%", delay: "1s" },
      { color: "bg-yellow-500", size: "w-2 h-10", rotation: "60deg", top: "80%", left: "15%", delay: "2s" },
      { color: "bg-green-500", size: "w-2 h-7", rotation: "-45deg", top: "30%", left: "90%", delay: "0.5s" },
      { color: "bg-purple-500", size: "w-2 h-5", rotation: "30deg", top: "70%", left: "5%", delay: "1.5s" },
      { color: "bg-pink-500", size: "w-2 h-9", rotation: "-60deg", top: "40%", left: "95%", delay: "2.5s" },
    ],
    [],
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={`absolute ${shape.color} ${shape.size} rounded-full opacity-60 animate-float`}
          style={{
            top: shape.top,
            left: shape.left,
            transform: `rotate(${shape.rotation})`,
            animationDelay: shape.delay,
            animationDuration: "6s",
          }}
        />
      ))}
    </div>
  )
}

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    if (darkMode) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [darkMode, mounted])

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const techStack = useMemo(
    () => ({
      frontend: [
        { name: "javascript", label: "JavaScript", color: "bg-yellow-500" },
        { name: "typescript", label: "TypeScript", color: "bg-blue-500" },
        { name: "angular", label: "Angular", color: "bg-red-600" },
        { name: "html5", label: "HTML5", color: "bg-orange-500" },
        { name: "css3", label: "CSS3", color: "bg-blue-600" },
      ],
      backend: [
        { name: "nodejs", label: "NodeJS", color: "bg-green-500" },
        { name: "express", label: "ExpressJS", color: "bg-gray-700" },
        { name: "java", label: "Java", color: "bg-orange-600" },
        { name: "spring-boot", label: "Spring Boot", color: "bg-green-600" },
        { name: "sql", label: "SQL", color: "bg-yellow-600" },
        { name: "mongodb", label: "MongoDB", color: "bg-green-700" },
        { name: "python", label: "Python", color: "bg-green-600" },
      ],
      tools: [
        { name: "aws", label: "AWS", color: "bg-orange-400" },
        { name: "git", label: "Git / GitHub", color: "bg-green-500" },
        { name: "azure", label: "Azure", color: "bg-blue-500" },
      ],
    }),
    [],
  )

  const projects = useMemo(
    () => [
      {
        title: "SherLife",
        description:
          "A community-focused web app designed to connect Sheridan students through events, resources, and social features.",
        tech: ["React", "TypeScript", "Tailwind CSS", "AWS S3"],
        date: "March 2025",
        image: "/projects/sherlife.png",
        github: "https://github.com/pavitersingh88/SherLife",
        demo: "https://sher-life.netlify.app/",
      },
     {
        title: "Product Catalogue Management System",
        description:
          "A full-stack web application for managing product catalogs with CRUD operations. Features user authentication, product categorization, and responsive design for optimal user experience.",
        tech: ["Spring Boot", "Java", "Thymeleaf", "Bootstrap", "H2 Database"],
        date: "2024",
        image: "/projects/product-management.png",
        github: "https://github.com/pavitersingh88/productManagementSystem",
        demo: "https://spring-productmanagementsystem.onrender.com/",
      },
      {
        title: "Spotify Clone",
        description:
          "A music streaming application clone that replicates Spotify's core features including music playback, playlist management, and responsive design. Built with modern frontend technologies.",
        tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
        date: "2024",
        image: "/projects/spotify-clone.png",
        github: "https://github.com/pavitersingh88/spotifyclone",
        demo: "https://spoticy-clone.netlify.app/",
      },
    ],
    [],
  )

    const certifications = useMemo(
    () => [
      {
        name: "Practical Help Desk",
        organization: "TCM Security",
        date: "2024",
        logo: "/tcm-security-logo.png",
        description:
          "IT support fundamentals including hardware troubleshooting, Windows/Linux administration, networking, and cybersecurity basics.",
      },
    ],
    [],
  )


  useEffect(() => {
    // Preload critical images
    const preloadImages = [
      "/profile.png",
      "/projects/sherlife.png",
      "/projects/product-management.png",
      "/projects/spotify-clone.png",
    ]

    preloadImages.forEach((src) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "image"
      link.href = src
      document.head.appendChild(link)
    })
  }, [])

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? "dark" : ""} relative`}>
      <AnimatedBackground darkMode={darkMode} />
      <FloatingShapes />

            {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 dark:bg-black/90 backdrop-blur-md z-[100] border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white transition-colors duration-300">
              Paviter Singh
            </div>
            <div className="hidden md:flex space-x-6 lg:space-x-8">
              {["Home", "About", "Skills", "Projects", "Certifications", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:scale-105 relative group text-sm lg:text-base"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-700 dark:text-gray-300 hover:scale-110 transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10"
            >
              {darkMode ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative z-20 pt-24 pb-8 px-4 sm:pt-20 md:pt-16"
      >
        <div
          className={`text-center w-full max-w-6xl mx-auto transform transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="mb-6 sm:mb-8 relative">
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-6 sm:mb-8 relative group">
              <Image
                src="/profile.png"
                alt="Profile"
                width={200}
                height={200}
                className="rounded-full border-2 sm:border-4 border-white dark:border-gray-700 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl object-cover w-full h-full"
                priority={true}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-2">
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent animate-gradient block sm:inline mt-2 sm:mt-0">
              Paviter Singh
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
            A passionate <span className="text-blue-500 font-semibold">Full-Stack Developer</span> with expertise in
            modern web technologies. I create beautiful, functional, and user-friendly applications that solve
            real-world problems.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
            <Button
              onClick={() => scrollToSection("about")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 sm:px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg group w-full sm:w-auto"
            >
              About me
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("projects")}
              className="border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 px-6 sm:px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              View My Projects
            </Button>
          </div>

          <div className="animate-bounce">
            <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto" />
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">Scroll</p>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section id="about" className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About <span className="text-blue-500">Me</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">My Journey</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                I'm a dedicated 2nd-year Software Development & Network Engineering student at Sheridan College 
                with a GPA of 3.97. I have a strong passion for building innovative web applications and solving
                real-world problems through code.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Alongside my studies, I actively participate in hackathons and personal projects to deepen my 
                skills in full-stack development, especially with JavaScript, Angular, and Node.js. My goal 
                is to become a skilled developer capable of delivering high-impact software solutions.
              </p>

              
              <div className="flex space-x-4 pt-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:scale-110 transition-all duration-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:hover:bg-blue-500 dark:hover:text-white dark:hover:border-blue-500 bg-transparent"
                  onClick={() => window.open("https://github.com/pavitersingh88/", "_blank")}
                >
                  <Github className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:scale-110 transition-all duration-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:hover:bg-blue-500 dark:hover:text-white dark:hover:border-blue-500 bg-transparent"
                  onClick={() => window.open("https://linkedin.com/in/pavitersingh88/", "_blank")}
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:scale-110 transition-all duration-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:hover:bg-blue-500 dark:hover:text-white dark:hover:border-blue-500 bg-transparent"
                  onClick={() => window.open("mailto:sin16405@sheridancollege.ca", "_blank")}
                >
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-8">
              <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="dark:text-white flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 font-semibold">Software Development & Network Engineering</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sheridan College • 2024-2027</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="dark:text-white flex items-center">
                    <Zap className="h-5 w-5 text-blue-500 mr-2" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 font-semibold">Crew Member</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Chipotle Mexican Grill • 2024-Present</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="dark:text-white">Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">Web Development, AI/ML, Learning New Tech, Hackathons</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="text-blue-500">Skills</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Frontend */}
            <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardHeader className="text-center">
                <CardTitle className="dark:text-white text-2xl">Frontend</CardTitle>
                <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full group-hover:w-24 transition-all duration-300"></div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {techStack.frontend.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 group/item"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden group-hover/item:scale-110 transition-all duration-300">
                        <Image
                          src={`/icons/${tech.name}.svg`}
                          alt={tech.label}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{tech.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Backend */}
            <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardHeader className="text-center">
                <CardTitle className="dark:text-white text-2xl">Backend</CardTitle>
                <div className="w-16 h-1 bg-green-500 mx-auto rounded-full group-hover:w-24 transition-all duration-300"></div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {techStack.backend.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 group/item"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden group-hover/item:scale-110 transition-all duration-300">
                        <Image
                          src={`/icons/${tech.name}.svg`}
                          alt={tech.label}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{tech.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure & Tools */}
            <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardHeader className="text-center">
                <CardTitle className="dark:text-white text-2xl">Infrastructure & Tools</CardTitle>
                <div className="w-16 h-1 bg-purple-500 mx-auto rounded-full group-hover:w-24 transition-all duration-300"></div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {techStack.tools.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 group/item"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden group-hover/item:scale-110 transition-all duration-300">
                        <Image
                          src={`/icons/${tech.name}.svg`}
                          alt={tech.label}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{tech.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              My <span className="text-purple-500">Projects</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 group overflow-hidden flex flex-col h-full"
              >
                <div className="relative overflow-hidden h-48">
                  <Image
                    src={project.image  || "/placeholder.svg" }
                    alt={project.title}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-all duration-500"
                    priority={index < 3} // Preload first 3 project images
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>

                <CardHeader className="flex-shrink-0">
                  <CardTitle className="dark:text-white text-xl group-hover:text-purple-500 transition-colors duration-300">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="dark:text-gray-300 text-sm leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="dark:bg-gray-700 dark:text-gray-300 hover:scale-105 transition-all duration-300"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{project.date}</p>
                  </div>
<div className="flex space-x-2 pt-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                       className="hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all duration-300 bg-transparent"
                      onClick={() => window.open(project.github, "_blank")}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                        className="hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 bg-transparent"
                      onClick={() => window.open(project.demo, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      
      {/* Certifications Section */}
      <section id="certifications" className="py-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="text-orange-500">Certifications</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>

          <div className="flex justify-center">
            <div className="max-w-md">
              {certifications.map((cert, index) => (
                <Card
                  key={index}
                  className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
                >
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <div className="w-20 h-20 mx-auto mb-4 relative">
                        <Image
                          src={cert.logo || "/placeholder.svg"}
                          alt={`${cert.organization} logo`}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain rounded-lg"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                      </div>
                      <Award className="h-8 w-8 text-orange-500 mx-auto mb-4" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors duration-300">
                      {cert.name}
                    </h3>

                    <div className="flex items-center justify-center space-x-4 text-gray-600 dark:text-gray-300 mb-4">
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span className="text-sm font-medium">{cert.organization}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{cert.date}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{cert.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Let's <span className="text-green-500">Connect</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Ready to bring your ideas to life? Let's discuss how we can work together to create something amazing!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div>
              <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Mail className="h-6 w-6 text-green-500 mr-3" />
                    Send Me a Message
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Fill out the form below and I'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            {/* Contact Info & Social Links */}
            <div className="space-y-8">
              {/* Contact Information */}
              <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">sin16405@sheridancollege.ca</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Location</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Oakville, Ontario, Canada</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media Links */}
              <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Star className="h-5 w-5 text-blue-500 mr-2" />
                    Connect With Me
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center space-x-6">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-110 h-16 w-16 bg-transparent"
                      onClick={() => window.open("https://linkedin.com/in/pavitersingh88/", "_blank")}
                    >
                      <Linkedin className="h-7 w-7" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all duration-300 hover:scale-110 h-16 w-16 bg-transparent"
                      onClick={() => window.open("https://github.com/pavitersingh88/", "_blank")}
                    >
                      <Github className="h-7 w-7" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 hover:scale-110 h-16 w-16 bg-transparent"
                      onClick={() => window.open("mailto:sin16405@sheridancollege.ca", "_blank")}
                    >
                      <Mail className="h-7 w-7" />
                    </Button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-center mt-6 text-sm">
                    Feel free to reach out through any of these platforms. I'm always open to discussing new
                    opportunities and interesting projects!
                  </p>
                </CardContent>
              </Card>

              {/* Availability Status */}
              <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm hover:shadow-xl transition-all duration-500 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Available for Work</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Open to freelance projects and full-time opportunities
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Currently Available</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-800/50 py-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">© 2025 Paviter Singh. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
