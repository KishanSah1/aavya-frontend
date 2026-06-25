import { CONTACT } from './contact'

export type PolicySection = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
  note?: string
}

export type PolicyDocument = {
  title: string
  description: string
  intro?: string[]
  sections: PolicySection[]
  contact?: { title: string; paragraphs: string[] }
}

export const privacyPolicy: PolicyDocument = {
  title: 'Privacy Policy',
  description: 'How Aavya Foods collects, uses, and protects your information.',
  intro: [
    'This Privacy Policy outlines how Aavya Foods collects, uses, and protects any information that you provide when using our website.',
    'At Aavya Foods, we are committed to ensuring that your privacy is protected. Any information you provide will only be used in accordance with this policy.',
    'We may update this policy from time to time by revising this page. We recommend reviewing it periodically to stay informed of any changes.',
  ],
  sections: [
    {
      title: 'Information We Collect',
      paragraphs: ['We may collect the following information:'],
      bullets: [
        'Name and date of birth',
        'Contact information, including email address and phone number',
        'Demographic information such as postcode, preferences, and interests',
        'Other information relevant to customer surveys and offers',
      ],
    },
    {
      title: 'How We Use Your Information',
      paragraphs: [
        'We collect this information to better understand your needs and improve our products and services. Specifically, we use it for:',
      ],
      bullets: [
        'Internal record keeping',
        'Improving our products, services, and website experience',
        'Sending promotional emails, offers, or updates that may interest you',
        'Contacting you for feedback, surveys, or market research',
      ],
    },
    {
      title: 'Security',
      paragraphs: [
        'We are committed to ensuring that your information is secure.',
        'To prevent unauthorized access or disclosure, we have implemented appropriate physical, electronic, and managerial procedures to safeguard the information we collect online.',
      ],
    },
    {
      title: 'Cookies',
      paragraphs: [
        'A cookie is a small file that is placed on your device with your permission. Cookies help us analyze web traffic and improve your browsing experience by tailoring the website to your preferences.',
        'We use cookies for statistical analysis and to understand which pages are most useful to our visitors. This information is used only for internal analysis and is removed after processing.',
        'You can choose to accept or decline cookies. However, declining cookies may limit your ability to fully experience our website.',
      ],
    },
    {
      title: 'Links to Other Websites',
      paragraphs: [
        'Our website may contain links to external websites.',
        'Once you leave our website, we do not have control over those sites and are not responsible for the protection and privacy of any information you provide there.',
      ],
    },
    {
      title: 'Controlling Your Personal Information',
      paragraphs: ['You have the right to control how your personal information is used:'],
      bullets: [
        'You may opt out of direct marketing by indicating your preference in forms',
        'You can withdraw your consent at any time by contacting us',
      ],
      note: 'We will not sell, distribute, or lease your personal information to third parties unless we have your permission or are required by law to do so.',
    },
    {
      title: 'Access to Your Information',
      paragraphs: [
        'You may request details of the personal information we hold about you.',
        'If you believe any information is incorrect or incomplete, please contact us, and we will promptly correct it.',
      ],
    },
    {
      title: 'Consent for Communication',
      paragraphs: [
        'By submitting your details through our website, you agree to receive communication from Aavya Foods, including promotional calls, messages, or emails, which may be facilitated through third-party service providers.',
      ],
    },
  ],
  contact: {
    title: 'Contact Us',
    paragraphs: [
      'If you have any questions regarding this Privacy Policy, please contact us at:',
      `${CONTACT.email} · ${CONTACT.phoneDisplay}`,
    ],
  },
}

export const shippingPolicy: PolicyDocument = {
  title: 'Shipping Policy',
  description: 'How we process, dispatch, and deliver your Aavya Foods orders across India.',
  intro: [
    'At Aavya Foods, we aim to deliver your order with care and efficiency.',
    'We partner with reliable courier services to ensure safe and timely delivery across India.',
  ],
  sections: [
    {
      title: 'Order Processing & Dispatch',
      paragraphs: ['All orders are processed and dispatched within 48 hours of order confirmation.'],
    },
    {
      title: 'Delivery Timeline',
      paragraphs: [
        'Once dispatched, orders are typically delivered within 5–7 business days, depending on your location.',
      ],
    },
    {
      title: 'Shipping Coverage',
      paragraphs: ['Currently, we accept and deliver orders within India only.'],
    },
    {
      title: 'Order Cancellation',
      paragraphs: [
        'Aavya Foods reserves the right to cancel any order within 48 hours of placement, in case of unforeseen circumstances.',
      ],
    },
  ],
}

export const refundPolicy: PolicyDocument = {
  title: 'Refund Policy',
  description: 'Return, exchange, and refund guidelines for Aavya Foods products.',
  intro: [
    'At Aavya Foods, we ensure that every product reaches you in perfect condition. However, in case of any issues, we’re here to help.',
  ],
  sections: [
    {
      title: 'Return & Exchange Window',
      paragraphs: [
        'We offer a 5-day return/exchange policy, which means you can request a return or replacement within 5 days of receiving your order.',
        `To initiate a request, please contact us at ${CONTACT.email}.`,
      ],
    },
    {
      title: 'Eligibility for Return/Exchange',
      paragraphs: ['To be eligible for a return or exchange:'],
      bullets: [
        'The product must be unused, unopened, and in its original packaging',
        'The invoice must be provided at the time of return pickup',
      ],
      note: 'If the product has been opened or used, it will not be eligible for return or refund.',
    },
    {
      title: 'Valid Reasons for Return/Exchange',
      paragraphs: ['Returns or exchanges are only accepted in the following unlikely situations:'],
      bullets: [
        'You received a damaged product',
        'You received the wrong item',
        'The product was not properly sealed at the time of delivery',
        'The product was expired at the time of delivery',
      ],
    },
    {
      title: 'Return Process',
      paragraphs: ['Once your return request is approved:'],
      bullets: [
        'The product will be picked up from the same address',
        'You will be informed about the pickup schedule',
      ],
    },
    {
      title: 'Exchange Timeline',
      paragraphs: [
        'In case of an exchange, the replacement product will be delivered within 3–5 business days after the return pickup is completed.',
      ],
    },
    {
      title: 'Delivery Issues',
      paragraphs: [
        'In case of any delivery-related concerns, please contact us within 48 hours of the order being marked as delivered.',
      ],
    },
    {
      title: 'Order Cancellation',
      bullets: [
        'Cancellation requests are accepted only before the order is shipped',
        'Once the order has been shipped, cancellation is not possible',
      ],
      note: 'Aavya Foods reserves the right to cancel or refuse any order due to reasons such as stock unavailability or unforeseen issues.',
    },
    {
      title: 'Refunds',
      bullets: [
        'Once the returned product is received and inspected, we will notify you regarding approval of your refund',
        'If approved, the refund will be processed to your original payment method',
        'Please allow 5–7 business days for the amount to reflect',
      ],
      note: 'No refunds will be issued for opened or used products.',
    },
  ],
  contact: {
    title: 'Need Help?',
    paragraphs: [
      'For any questions related to returns or refunds, feel free to reach out to us:',
      `${CONTACT.email} · ${CONTACT.phoneDisplay}`,
    ],
  },
}

export const termsOfService: PolicyDocument = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using the Aavya Foods website and services.',
  intro: [
    'This website is operated by Aavya Foods. Throughout the site, the terms “we”, “us” and “our” refer to Aavya Foods. Aavya Foods offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.',
    'By visiting our site and/or purchasing something from us, you engage in our “Service” and agree to be bound by the following Terms of Service (“Terms”), including additional terms, conditions, and policies referenced herein.',
    'These Terms apply to all users of the site, including browsers, customers, merchants, and contributors of content.',
    'If you do not agree to these Terms, please do not use our website or services.',
  ],
  sections: [
    {
      title: 'Section 1 – Online Store Terms',
      paragraphs: [
        'By agreeing to these Terms, you confirm that you are at least the age of majority in your jurisdiction or have consent from a guardian.',
        'You agree not to use our products or services for any illegal or unauthorized purpose and not to violate any laws.',
        'Any breach of these Terms may result in termination of your access to our services.',
      ],
    },
    {
      title: 'Section 2 – General Conditions',
      bullets: [
        'We reserve the right to refuse service to anyone at any time.',
        'Your content (excluding payment details) may be transferred over networks and adapted to technical requirements. Payment information is always encrypted.',
        'You agree not to copy, reproduce, or exploit any part of the service without written permission.',
      ],
    },
    {
      title: 'Section 3 – Accuracy of Information',
      paragraphs: [
        'We strive to ensure that all information on our website is accurate and up to date. However, we do not guarantee completeness or accuracy at all times.',
        'Any reliance on website information is at your own risk.',
      ],
    },
    {
      title: 'Section 4 – Modifications to Service & Pricing',
      bullets: [
        'Prices for our products may change without notice.',
        'We reserve the right to modify or discontinue any part of the service without notice and shall not be liable for such changes.',
      ],
    },
    {
      title: 'Section 5 – Products',
      bullets: [
        'Products available on our website may have limited quantities and are subject to our Return & Exchange Policy.',
        'We aim to display product images and descriptions as accurately as possible, but we cannot guarantee exact representation across all devices.',
        'We reserve the right to limit or discontinue any product at any time.',
      ],
    },
    {
      title: 'Section 6 – Billing & Account Information',
      bullets: [
        'We reserve the right to refuse or cancel any order.',
        'You agree to provide accurate and complete information for all purchases and to update your details as necessary.',
        'Orders that appear fraudulent or intended for resale may be restricted or cancelled.',
      ],
    },
    {
      title: 'Section 7 – Third-Party Tools & Links',
      paragraphs: [
        'We may provide access to third-party tools or links. We are not responsible for their content, policies, or practices.',
        'Use of third-party services is at your own risk.',
      ],
    },
    {
      title: 'Section 8 – User Feedback & Submissions',
      bullets: [
        'Any feedback, suggestions, or content shared with us may be used by Aavya Foods without restriction.',
        'You agree not to submit unlawful, harmful, or misleading content.',
      ],
    },
    {
      title: 'Section 9 – Personal Information',
      paragraphs: ['Your submission of personal information is governed by our Privacy Policy.'],
    },
    {
      title: 'Section 10 – Errors & Omissions',
      paragraphs: [
        'There may occasionally be errors in product descriptions, pricing, or availability. We reserve the right to correct such errors and cancel orders if necessary.',
      ],
    },
    {
      title: 'Section 11 – Prohibited Uses',
      paragraphs: ['You are prohibited from using the website for:'],
      bullets: [
        'Unlawful activities',
        'Violating intellectual property rights',
        'Uploading harmful or malicious content',
        'Misusing or interfering with the website',
      ],
      note: 'Violation may result in termination of access.',
    },
    {
      title: 'Section 12 – Disclaimer of Warranties',
      paragraphs: [
        'We do not guarantee that the service will be uninterrupted, secure, or error-free.',
        'All products and services are provided “as is” and “as available” without warranties of any kind.',
      ],
    },
    {
      title: 'Section 13 – Limitation of Liability',
      paragraphs: [
        'Aavya Foods shall not be liable for any direct, indirect, or incidental damages arising from the use of our website or products, to the fullest extent permitted by law.',
      ],
    },
    {
      title: 'Section 14 – Indemnification',
      paragraphs: [
        'You agree to indemnify and hold Aavya Foods harmless from any claims arising from your violation of these Terms or misuse of our services.',
      ],
    },
    {
      title: 'Section 15 – Termination',
      paragraphs: [
        'We may terminate or suspend access to our services if you violate these Terms.',
      ],
    },
    {
      title: 'Section 16 – Governing Law',
      paragraphs: ['These Terms shall be governed by and interpreted in accordance with the laws of India.'],
    },
    {
      title: 'Section 17 – Changes to Terms',
      paragraphs: [
        'We reserve the right to update or modify these Terms at any time. Continued use of the website implies acceptance of those changes.',
      ],
    },
  ],
  contact: {
    title: 'Section 18 – Contact Information',
    paragraphs: [
      'For any questions regarding these Terms, please contact us:',
      `${CONTACT.email} · ${CONTACT.phoneDisplay}`,
    ],
  },
}
