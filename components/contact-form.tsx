"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import emailjs from "@emailjs/browser"

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  // EmailJS Configuration - Your actual values
  const EMAILJS_SERVICE_ID = "service_tp0yqvl"
  const EMAILJS_TEMPLATE_ID = "template_uzi56vb"
  const EMAILJS_PUBLIC_KEY = "pu0KNbhkPuXOfc37I"

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters"
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // This check is no longer needed since we have real values, but keeping for safety
      if (false) {
        // Fallback to email client if not configured
        console.log("EmailJS not configured, using email client fallback")

        const subject = encodeURIComponent(formData.subject)
        const body = encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
        )
        const mailtoLink = `mailto:sin16405@sheridancollege.ca?subject=${subject}&body=${body}`

        window.open(mailtoLink, "_blank")
        setSubmitStatus("success")
        setFormData({ name: "", email: "", subject: "", message: "" })
        return
      }

      // EmailJS configuration
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: "sin16405@sheridancollege.ca",
      }

      // Send email using EmailJS
      const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)

      console.log("EmailJS Success:", response)
      setSubmitStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      console.error("EmailJS Error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEmailJSConfigured = true // Always true now since we have real values

  return (
    <div className="space-y-4">
      {/* Configuration Status */}
      {!isEmailJSConfigured && (
        <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span>EmailJS not configured. Form will use email client fallback.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter your full name"
            className={`transition-all duration-300 ${
              errors.name
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          {errors.name && (
            <div className="flex items-center space-x-1 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email address"
            className={`transition-all duration-300 ${
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          {errors.email && (
            <div className="flex items-center space-x-1 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* Subject Field */}
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Subject *
          </Label>
          <Input
            id="subject"
            type="text"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            placeholder="What's this about?"
            className={`transition-all duration-300 ${
              errors.subject
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          {errors.subject && (
            <div className="flex items-center space-x-1 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.subject}</span>
            </div>
          )}
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Message *
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder="Tell me about your project, ideas, or just say hello!"
            rows={5}
            className={`transition-all duration-300 resize-none ${
              errors.message
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          <div className="flex justify-between items-center">
            {errors.message ? (
              <div className="flex items-center space-x-1 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.message}</span>
              </div>
            ) : (
              <div></div>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">{formData.message.length}/500</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="space-y-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isEmailJSConfigured ? "Sending Message..." : "Opening Email Client..."}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              <span>
                {isEmailJSConfigured
                  ? "Message sent successfully! I'll get back to you soon."
                  : "Email client opened! Please send the pre-filled message."}
              </span>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>Failed to send message. Please try again or email me directly at sin16405@sheridancollege.ca</span>
            </div>
          )}
        </div>

        {/* Form Footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p>Your information is secure and will never be shared with third parties.</p>
          {!isEmailJSConfigured && (
            <p className="mt-1">Using email client fallback. Configure EmailJS for direct sending.</p>
          )}
        </div>
      </form>
    </div>
  )
}
