import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VaultFAQ = () => {
  const faqs = [
    {
      question: "Is Vault really free to try?",
      answer: "Yes! You get 14 days of full Athlete+ access with no credit card required. After your trial, you can continue with our free Lite plan or upgrade to unlock more features."
    },
    {
      question: "Can I use Vault without an internet connection?",
      answer: "Absolutely. You can log jumps and sessions offline. Data syncs automatically when you're back online."
    },
    {
      question: "How is this different from general fitness tracking apps?",
      answer: "Vault is built specifically for pole vault. We understand the unique needs of pole vaulters - from tracking pole specifications to analyzing jump videos. Generic apps can't capture the details that matter for our sport."
    },
    {
      question: "Can coaches use Vault to track multiple athletes?",
      answer: "Currently, Vault is designed for individual athletes. However, we're working on coach features for future updates. Coaches can still use the app to demonstrate tracking to their athletes."
    },
    {
      question: "What if I switch phones?",
      answer: "All your data is safely stored in the cloud. Simply log in to your account on your new device and everything will be there."
    },
    {
      question: "Do you plan to add more features?",
      answer: "Definitely! We're actively developing new features based on user feedback. Some upcoming features include competition tracking, team functionality, and enhanced analytics."
    },
    {
      question: "Is my data secure?",
      answer: "Yes. We use enterprise-grade security to protect your data. Your information is encrypted and stored securely. We will never share your personal data with third parties."
    },
    {
      question: "Can I export my training data?",
      answer: "Athlete+ subscribers can export their data in various formats. This is perfect for sharing with coaches or keeping personal records."
    },
    {
      question: "What video formats are supported?",
      answer: "Vault supports all standard video formats that your phone can record. Videos are compressed for storage efficiency while maintaining quality for analysis."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Vault
            </p>
          </div>

          {/* FAQ Accordion */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-900">
                Got questions? We have answers.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                    <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600 py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional help */}
          <div className="text-center mt-12">
            <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                We're here to help! Reach out to our support team for any additional questions.
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email:</strong> support@vaultapp.com
                </p>
                <p className="text-gray-700">
                  <strong>Response time:</strong> Usually within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaultFAQ;