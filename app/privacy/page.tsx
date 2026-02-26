import React from 'react'

export const metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy for Fabely</h1>
      <p className="mb-6">Last Updated: October 24, 2023</p>

      <section className="prose mb-6">
        <h2>1. Introduction</h2>
        <p>
          Symbloom LLC ("we," "us," or "our") operates the Fabely platform.
          We are committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, and handle your information when you
          use our website and services, particularly concerning our
          integration with Google Drive.
        </p>
      </section>

      <section className="prose mb-6">
        <h2>2. Information We Collect from Google Services</h2>
        <p>
          When you authenticate with Google to use Fabely, we request access to
          your Google Drive.
        </p>
        <h3>Scopes Requested</h3>
        <p>
          We use the <a href="https://www.googleapis.com/auth/drive.readonly">https://www.googleapis.com/auth/drive.readonly</a> or
          <a href="https://www.googleapis.com/auth/drive.file">https://www.googleapis.com/auth/drive.file</a> scopes.
        </p>
        <h3>Data Accessed</h3>
        <p>
          We only index and display the following file types: .txt, .pdf,
          .docx, .gdoc, .pptx, and Google Slides.
        </p>
        <h3>User-Driven Selection</h3>
        <p>
          We do not automatically "scrape" your entire Drive. Our service pulls
          a list of these files to allow you to select which specific documents
          you wish to copy to your Fabely Drive.
        </p>
      </section>

      <section className="prose mb-6">
        <h2>3. How We Use Your Google Data</h2>
        <p>
          Our use of information received from Google APIs will adhere to the
          Google API Services User Data Policy, including the Limited Use
          requirements.
        </p>
        <h3>Service Functionality</h3>
        <p>
          We use your data exclusively to provide the "Transfer to Fabely"
          feature.
        </p>
        <h3>No Internal Mining</h3>
        <p>
          We do not use your Google Drive content for marketing, advertising,
          or profiling.
        </p>
        <h3>Data Transfer</h3>
        <p>
          Files are only copied to Fabely's secure storage (hosted via
          Supabase/Vercel) upon your explicit command for each file.
        </p>
      </section>

      <section className="prose mb-6">
        <h2>4. Data Storage and Security</h2>
        <h3>Storage</h3>
        <p>
          Once a file is copied to "Fabely Drive," it is stored using
          industry-standard encryption.
        </p>
        <h3>Retention</h3>
        <p>
          We retain your copied files only as long as your account is active.
          If you delete a file from Fabely or close your account, the data is
          permanently removed from our servers.
        </p>
        <h3>No Third-Party Sharing</h3>
        <p>
          We do not sell or share your Google user data with third-party tool
          providers or data brokers.
        </p>
      </section>

      <section className="prose mb-6">
        <h2>5. Google OAuth & Limited Use Disclosure</h2>
        <p>
          Fabely's use and transfer to any other app of information received
          from Google APIs will adhere to Google API Services User Data Policy,
          including the Limited Use requirements.
        </p>
      </section>

      <section className="prose mb-6">
        <h2>6. Your Controls</h2>
        <p>
          You can revoke Fabely’s access to your Google Drive at any time
          through your Google Account security settings.
        </p>
      </section>

      <section className="prose">
        <h2>7. Contact Us</h2>
        <p>
          For questions regarding this policy or your data, contact us at:
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
