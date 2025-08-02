'use client'

import React from 'react'
import AppBar from '@/components/Layout/AppBar'
import { useRouter } from 'next/navigation'
import {
  CheckCircleIcon,
  PhoneIcon,
  HomeIcon,
  PlusIcon
} from '@heroicons/react/24/solid'

export default function ReportSubmitted() {
  const router = useRouter()
  const nextSteps = [
    'Your report is reviewed by our safety team',
    "We'll contact you to discuss support options",
    'Guidance on further steps and resources'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AppBar with updated title */}
      <AppBar type="internal" title="Report Submitted" />

      <main className="max-w-xl mx-auto mt-8 px-4 space-y-8">
        {/* Confirmation */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-10 h-10 text-green-600"/>
          </div>
          <h1 className="text-2xl font-semibold">Thank You for Your Report</h1>
          <p className="text-gray-600">
            Your incident report has been successfully submitted. We take your
            safety seriously and appreciate you taking the time to report this.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow p-5 flex items-start space-x-4">
            <div className="p-2 bg-indigo-50 rounded-full">
              <HomeIcon className="w-6 h-6 text-indigo-600"/>
            </div>
            <div>
              <h2 className="font-medium">Our Team Will Contact You</h2>
              <p className="text-gray-600 mt-1 text-sm">
                A member of our support team will reach out to you within 24
                hours to guide you through the next steps and provide assistance.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-medium text-lg mb-4 text-center">What Happens Next?</h2>
            <div className="space-y-4">
              {nextSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div
                        className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency CTA */}
        <div className="bg-red-50 rounded-lg p-5 text-center space-y-4">
          <p className="text-red-700 font-medium">⚠️ Emergency Situation?</p>
          <p className="text-red-600 text-sm">
            If you’re in immediate danger, please contact emergency services or use the SOS feature.
          </p>
          <a
              href="tel:112"
              className="w-full inline-flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg"
          >
            <PhoneIcon className="w-5 h-5"/>
            <span>Call Emergency Services</span>
          </a>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
              type="button"
              onClick={() => router.push('/home')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center"
          >
            <HomeIcon className="inline-block w-5 h-5 mr-2 align-middle"/>
            Return to Home
          </button>

          <button
              type="button"
              onClick={() => router.push('/report-incident')}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg flex items-center justify-center hover:bg-gray-100"
          >
            <PlusIcon className="w-5 h-5 mr-2"/>
            Report Another Incident
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-gray-500">
        Need immediate support?&nbsp;
        <a href="mailto:support@guardianx.com" className="underline">
          support@guardianx.com
        </a>
        &nbsp;|&nbsp;24/7 Helpline
      </footer>
    </div>
  )
}
