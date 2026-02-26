import React from 'react'

export const metadata = {
  title: 'Terms of Service',
}

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-2">Terms of Service for Fabely</h1>
      <p className="text-sm text-gray-600 mb-2">Effective Date: February 26, 2026</p>
      <p className="text-sm text-gray-600 mb-6">Last Updated: February 26, 2026</p>

      <section className="prose mb-6">
        <p>
          Welcome to Fabely, a service provided by Symbloom LLC ("we," "us,"
          or "our"). By accessing or using our website and services (the
          "Service"), you agree to be bound by these Terms of Service.
        </p>
      </section>

      <section className="prose mb-6">
        <h2>1. Description of Service</h2>
        <p>
          Fabely is a document management and storage platform. Our Service
          allows users to:
        </p>
        <ul>
          <li>Connect their Google Drive account.</li>
          <li>
            Index specific file types (.txt, .pdf, .docx, .gdoc, .pptx,
            .gslides).
          </li>
          <li>
            Manually select and copy these files to a dedicated "Fabely Drive"
            hosted on our secure infrastructure.
          </li>
        </ul>
      </section>

      <section className="prose mb-6">
        <h2>2. Eligibility & Account Registration</h2>
        <h3>Age</h3>
        <p>
          You must be at least 18 years of age to use this Service.
        </p>
        <h3>Account Security</h3>
        <p>
          You are responsible for maintaining the confidentiality of your login
          credentials provided via our authentication partners (e.g., Google,
          Supabase). You are solely responsible for all activities that occur
          under your account.
        </p>
      </section>

      <section className="prose mb-6">
        <h2>3. Use of Third-Party Services (Google Drive)</h2>
        <h3>Authorization</h3>
        <p>
          By using the "Connect Google Drive" feature, you grant Fabely
          permission to access your Google Drive as specified in our{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>
        <h3>User Control</h3>
        <p>
          You acknowledge that Fabely only acts upon your explicit command to
          copy files. We do not modify or delete files on your Google Drive.
        </p>
        <h3>Compliance</h3>
        <p>
          Your use of Google Drive through Fabely is also subject to Google's
          Terms of Service.
        </p>
      </section>

      <section className="prose mb-6">
        <h2>4. Acceptable Use Policy</h2>
        <p>
          You agree not to use Fabely to:
        </p>
        <ul>
          <li>
            Upload or store any content that is illegal, infringing on
            intellectual property, or contains malicious code (viruses, etc.).
          </li>
          <li>
            Attempt to reverse engineer, scrape, or interfere with the
            Service's infrastructure (hosted via Vercel and Supabase).
          </li>
          <li>
            Exceed the storage limits or API rate limits associated with your
            account tier.
          </li>
        </ul>
      </section>

      <section className="prose mb-6">
        <h2>5. Intellectual Property</h2>
        <h3>Your Content</h3>
        <p>
          You retain full ownership of the intellectual property rights in the
          files you copy to Fabely. By using the Service, you grant Symbloom
          LLC a limited license to host, store, and display your content solely
          for the purpose of providing the Service to you.
        </p>
        <h3>Fabely Property</h3>
        <p>
          The Fabely name, logo, software code, and user interface are the
          exclusive property of Symbloom LLC and are protected by copyright and
          trademark laws.
        </p>
      </section>

      <section className="prose mb-6">
        <h2>6. Termination</h2>
        <h3>By You</h3>
        <p>
          You may stop using the Service and disconnect your Google Drive at
          any time.
        </p>
        <h3>By Us</h3>
        <p>
          We reserve the right to suspend or terminate your access to Fabely
          if you violate these Terms or if your account remains inactive for an
          extended period. Upon termination, we will delete your stored data in
          accordance with our data retention policy.
        </p>
      </section>

      <section className="prose mb-6">
        <h2>7. Limitation of Liability</h2>
        <p className="font-semibold">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, SYMBLOOM LLC SHALL NOT BE
          LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES,
          INCLUDING LOSS OF DATA, RESULTING FROM YOUR USE OF THE SERVICE OR ANY
          THIRD-PARTY INTEGRATIONS (LIKE GOOGLE DRIVE). THE SERVICE IS PROVIDED
          "AS IS" WITHOUT WARRANTIES OF ANY KIND.
        </p>
      </section>

      <section className="prose mb-6">
        <h2>8. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the State where Symbloom LLC is registered, without regard to
          its conflict of law provisions.
        </p>
      </section>

      <section className="prose">
        <h2>9. Contact Information</h2>
        <p>
          For any questions regarding these Terms, please contact:
        </p>
        <address>
          Symbloom LLC
          <br />
          Email: <a href="mailto:reach2symbloom@gmail.com">reach2symbloom@gmail.com</a>
        </address>
      </section>
    </main>
  )
}
