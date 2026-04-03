import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Copy, CheckCircle } from 'lucide-react';
import { fontPlayfair } from '../utils/theme';

const easing = [0.16, 1, 0.3, 1];

const LegalSection = ({ title, id, children }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.hash = id;
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id={id} className="scroll-mt-32 mb-16 group">
      <div className="flex items-center justify-between border-b border-stone-200 mb-6 pb-2">
        <h2 className="text-xl md:text-2xl font-light text-stone-800 uppercase tracking-tight">
          {title}
        </h2>
        <button 
          onClick={handleCopyLink}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-stone-400 hover:text-stone-900"
          title="Copy section link"
        >
          {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="text-stone-600 leading-relaxed text-sm md:text-base space-y-4 font-light">
        {children}
      </div>
    </section>
  );
};

const ContactCard = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mt-20 p-8 md:p-12 bg-white border border-stone-200 rounded-sm shadow-sm text-center"
  >
    <Mail className="w-8 h-8 mx-auto text-stone-300 mb-6" />
    <h3 style={fontPlayfair} className="text-2xl mb-4">Legal Inquiries</h3>
    <p className="text-stone-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">
      If you have any questions regarding our legal documents or data practices, please reach out directly to our administration team.
    </p>
    <a 
      href="mailto:legal@leisurelake.com" 
      className="inline-block border border-stone-900 text-stone-900 px-8 py-3 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-stone-900 hover:text-white transition-all duration-500"
    >
      Contact Legal Team
    </a>
  </motion.div>
);

const PrivacyContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: easing }}
    id="privacy-panel"
    role="tabpanel"
    aria-labelledby="privacy-tab"
  >
    <LegalSection title="1. Information We Collect" id="collect">
      <p>At Leisure Lake, we collect information to provide a personalized dining and hospitality experience. This includes:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Personal Identifiers:</strong> Name, email address, phone number, and physical address provided during reservations.</li>
        <li><strong>Financial Information:</strong> Payment details processed securely through our third-party payment providers.</li>
        <li><strong>Usage Data:</strong> Information about how you interact with our website, including IP addresses and device types.</li>
      </ul>
    </LegalSection>

    <LegalSection title="2. How We Use Your Information" id="usage">
      <p>Your information is used strictly for the following purposes:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>To manage and confirm table reservations and event bookings.</li>
        <li>To process transactions and provide receipts.</li>
        <li>To send important updates regarding your visit (e.g., confirmation SMS or email).</li>
        <li>To improve our website functionality and customer service based on feedback.</li>
      </ul>
    </LegalSection>

    <LegalSection title="3. Data Sharing & Disclosure" id="sharing">
      <p>We do not sell your personal data. We only share information with:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Service providers who assist in our operations (e.g., reservation software, payment processors).</li>
        <li>Legal authorities when required by Cambodian law or to protect our rights and safety.</li>
      </ul>
    </LegalSection>

    <LegalSection title="4. Data Security" id="security">
      <p>We implement industry-standard encryption and security measures to protect your personal data from unauthorized access, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>
    </LegalSection>

    <LegalSection title="5. Your Rights" id="rights">
      <p>You have the right to access, correct, or request the deletion of your personal information held by Leisure Lake. To exercise these rights, please contact us via the contact form or email provided below.</p>
    </LegalSection>

    <LegalSection title="6. Cookies & Tracking Technologies" id="cookies">
      <p>We use cookies to enhance your browsing experience, remember your preferences, and analyze our traffic. You can manage cookie settings through your browser preferences at any time.</p>
    </LegalSection>

    <LegalSection title="7. Third-Party Links" id="links">
      <p>Our website may contain links to external sites (e.g., social media). We are not responsible for the privacy practices of these third parties.</p>
    </LegalSection>

    <LegalSection title="8. Children's Privacy" id="children">
      <p>Our services are not intended for individuals under the age of 13. We do not knowingly collect personal data from children.</p>
    </LegalSection>

    <LegalSection title="9. Changes to This Privacy Policy" id="changes">
      <p>We may update this policy periodically. The "Last Updated" date at the top of this page will reflect the most recent changes.</p>
    </LegalSection>

    <LegalSection title="10. Contact Us" id="contact">
      <p>For any privacy-related questions, please email us at <strong>privacy@leisurelake.com</strong> or visit us at our Phnom Penh location.</p>
    </LegalSection>
  </motion.div>
);

const TermsContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: easing }}
    id="terms-panel"
    role="tabpanel"
    aria-labelledby="terms-tab"
  >
    <LegalSection title="1. Acceptance of Terms" id="acceptance">
      <p>By accessing the Leisure Lake website or making a reservation, you agree to comply with and be bound by these Terms of Service. If you do not agree, please refrain from using our services.</p>
    </LegalSection>

    <LegalSection title="2. User Accounts" id="accounts">
      <p>When you create an account on our Guestlist, you are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account.</p>
    </LegalSection>

    <LegalSection title="3. Reservations & Cancellation Policy" id="reservations">
      <p>Reservations are subject to availability. We require at least 24 hours' notice for cancellations. Failure to arrive for a reservation without notice may result in a "No-Show" status on your profile.</p>
    </LegalSection>

    <LegalSection title="4. Payment Terms" id="payment">
      <p>All prices are in Cambodian Riel (KHR) or USD where specified. Payments for event bookings may require a non-refundable deposit as outlined during the booking process.</p>
    </LegalSection>

    <LegalSection title="5. User Conduct" id="conduct">
      <p>Guests are expected to behave in a respectful manner towards staff and other patrons. Leisure Lake reserves the right to refuse service to anyone violating our code of conduct.</p>
    </LegalSection>

    <LegalSection title="6. Intellectual Property" id="ip">
      <p>All content on this website, including logos, images, and text, is the property of Leisure Lake and is protected by copyright laws in Cambodia and internationally.</p>
    </LegalSection>

    <LegalSection title="7. Limitation of Liability" id="liability">
      <p>Leisure Lake is not liable for any indirect, incidental, or consequential damages arising from your use of our website or your dining experience beyond the value of the service provided.</p>
    </LegalSection>

    <LegalSection title="8. Indemnification" id="indemnify">
      <p>You agree to indemnify Leisure Lake against any claims or losses arising from your breach of these terms or misuse of our services.</p>
    </LegalSection>

    <LegalSection title="9. Governing Law" id="law">
      <p>These terms are governed by the laws of the Kingdom of Cambodia.</p>
    </LegalSection>

    <LegalSection title="10. Dispute Resolution" id="dispute">
      <p>Any disputes shall be settled through amicable negotiation first, then referred to the competent courts in Phnom Penh, Cambodia.</p>
    </LegalSection>

    <LegalSection title="11. Modifications to Service" id="modifications">
      <p>We reserve the right to modify our menu, pricing, and operating hours without prior notice.</p>
    </LegalSection>

    <LegalSection title="12. Termination" id="termination">
      <p>We may suspend or terminate your access to our services at our sole discretion if we suspect a violation of these terms.</p>
    </LegalSection>

    <LegalSection title="13. Contact Information" id="contact-info">
      <p>For inquiries regarding these terms, please contact us at <strong>legal@leisurelake.com</strong>.</p>
    </LegalSection>
  </motion.div>
);

const LegalPages = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'terms' ? 'terms' : 'privacy';

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-stone-900 selection:text-white pt-24 md:pt-32">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 relative z-10">
        
        {/* Back Button - Integrated into page flow */}
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-3 text-stone-400 hover:text-stone-900 transition-all duration-500 mb-12 group"
        >
          <div className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-stone-900 transition-colors">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="text-[9px] uppercase font-bold tracking-[0.3em]">Return</span>
        </motion.button>

        {/* Header */}
        <header className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easing }}
          >
            <span className="inline-block px-4 py-1.5 bg-stone-100 text-[9px] uppercase font-bold tracking-[0.2em] text-stone-500 rounded-full mb-6">
              Official Documentation
            </span>
            <h1 
              style={fontPlayfair} 
              className="text-4xl md:text-5xl lg:text-6xl font-light text-stone-800 tracking-tight leading-tight mb-4"
            >
              Legal Information
            </h1>
            <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">
              Last Updated: {lastUpdated}
            </p>
          </motion.div>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-16 md:mb-20 print:hidden" role="tablist" aria-label="Legal documents">
          <div className="flex gap-8 md:gap-16 border-b border-stone-200 w-full justify-center">
            {['privacy', 'terms'].map((tab) => (
              <button
                key={tab}
                id={`${tab}-tab`}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`${tab}-panel`}
                tabIndex={0}
                onClick={() => handleTabChange(tab)}
                className={`relative pb-6 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold transition-all duration-500 outline-none focus:text-stone-900 ${
                  activeTab === tab ? 'text-stone-900' : 'text-stone-300 hover:text-stone-500'
                }`}
              >
                {tab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                {activeTab === tab && (
                  <motion.div
                    layoutId="legal-active-tab"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-stone-900"
                    transition={{ duration: 0.6, ease: easing }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
            >
              {activeTab === 'privacy' ? <PrivacyContent /> : <TermsContent />}
            </motion.div>
          </AnimatePresence>
        </div>

        <ContactCard />

      </div>
    </div>
  );
};

export default LegalPages;
