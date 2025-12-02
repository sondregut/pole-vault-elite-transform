import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const VaultAppFAQ = () => {
  const faqs = [
    {
      question: 'Who is VAULT for?',
      answer:
        'VAULT is for every pole vaulter who wants to improve – from beginners just learning the basics to elite athletes chasing world records. Whether you\'re a high school athlete tracking your first season, a college vaulter analyzing technique, a masters athlete staying competitive, or a coach managing multiple athletes, VAULT adapts to your needs. If you\'re serious about pole vault and want to train smarter, VAULT is built for you.',
    },
    {
      question: 'Is the app available on Android?',
      answer:
        'We are launching on iOS first, with Android support coming shortly after. Join our waitlist to be notified when the Android version is available.',
    },
    {
      question: 'Can I use the app without internet?',
      answer:
        'Yes! VAULT is built offline-first. You can log sessions, jumps, and all your data without an internet connection. Everything syncs automatically when you reconnect.',
    },
    {
      question: 'How do I transfer my data from my old notes?',
      answer:
        "We're working on an import feature that will let you bulk upload historical data from spreadsheets. For now, you can manually enter past sessions to build your training history.",
    },
    {
      question: 'Can my coach see my data?',
      answer:
        "Coach Connect is coming soon! This feature will allow you to share your live session data with your coach instantly, even if they're not at the track. Stay tuned for updates.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-vault-bg-warm-start font-roboto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-vault-text mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-vault-text-secondary">
            Everything you need to know about VAULT
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-xl border border-vault-border shadow-vault-sm px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-left text-vault-text font-semibold hover:text-vault-primary py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-vault-text-secondary leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default VaultAppFAQ;
