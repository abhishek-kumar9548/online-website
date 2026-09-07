import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, MessageSquare, ShieldCheck } from 'lucide-react';
import { api } from '../services/api.ts';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Festive Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setFeedback({ text: 'Please complete all required fields.', type: 'error' });
      return;
    }
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await api.submitContact({
        name,
        email,
        phone,
        subject,
        message
      });
      setFeedback({ text: res.message, type: 'success' });
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setFeedback({ text: err.message || 'Failed to submit your message. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#8B0000] uppercase tracking-widest bg-[#FDFCF8] px-3 py-1 rounded-sm border border-[#E5E1D8]">
          We Are Here To Assist
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#333333] mt-3">
          Contact Utsav Veda Support
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] mt-2 leading-relaxed">
          Have a question regarding your festive order, bulk gifting for weddings/corporate celebrations, or custom artisan requests? Reach out to our dedicated festive team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Information & Hours (Left) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-lg border border-[#E5E1D8] p-6 sm:p-8 shadow-2xs space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#333333] border-b border-[#E5E1D8] pb-3">
              Festive Care Channels
            </h3>

            <div className="space-y-4 text-xs text-[#555555]">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] flex items-center justify-center shrink-0 text-[#8B0000]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#333333]">Toll-Free Phone</h4>
                  <p className="text-[#8B0000] font-bold mt-0.5">+91 1800 887 2899</p>
                  <p className="text-[11px] text-[#777777]">Available 9:00 AM - 9:00 PM IST (Mon - Sun)</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] flex items-center justify-center shrink-0 text-[#8B0000]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#333333]">Customer Support Email</h4>
                  <p className="text-[#8B0000] font-bold mt-0.5">care@utsavveda.com</p>
                  <p className="text-[11px] text-[#777777]">We typically respond within 3 business hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] flex items-center justify-center shrink-0 text-[#8B0000]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#333333]">Artisan House & Experience Centre</h4>
                  <p className="mt-0.5 text-[#666666]">44 Heritage Way, MI Road, Jaipur, Rajasthan 302001, India</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] flex items-center justify-center shrink-0 text-[#8B0000]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#333333]">Festive Dispatch Centre</h4>
                  <p className="mt-0.5 text-[#666666]">Operating 7 days a week during major festive months (Diwali, Navratri, Ganesh Utsav).</p>
                </div>
              </div>
            </div>

            {/* Bulk Gifting Note */}
            <div className="p-4 rounded-md bg-[#FDFCF8] border border-[#E5E1D8]">
              <h4 className="font-serif font-bold text-xs text-[#8B0000] uppercase tracking-wider mb-1">
                Corporate & Wedding Gifting
              </h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                Need 50+ custom gift boxes with personalized branding or custom brass engraving? Choose "Bulk & Corporate Gifting" in the form.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form (Right) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-lg border border-[#E5E1D8] p-6 sm:p-8 shadow-2xs space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#333333]">
                Send Us a Message
              </h3>
              <p className="text-xs text-[#666666] mt-1">
                Fill out the details below and a festive representative will get in touch with you.
              </p>
            </div>

            {feedback && (
              <div className={`p-4 rounded-md text-xs flex items-center gap-2 ${
                feedback.type === 'success' 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}>
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#333333] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Vikramaditya Mehta"
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] text-[#333333] focus:outline-hidden focus:border-[#8B0000]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#333333] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] text-[#333333] focus:outline-hidden focus:border-[#8B0000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#333333] mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] text-[#333333] focus:outline-hidden focus:border-[#8B0000]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#333333] mb-1">Inquiry Topic</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] text-[#333333] focus:outline-hidden focus:border-[#8B0000]"
                  >
                    <option value="General Festive Inquiry">General Festive Inquiry</option>
                    <option value="Bulk & Corporate Gifting">Bulk & Corporate Gifting</option>
                    <option value="Transit Damage or Replacement">Transit Damage or Replacement</option>
                    <option value="Artisan Partnership Proposal">Artisan Partnership Proposal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="How can we help make your festive celebration special?"
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] text-[#333333] focus:outline-hidden focus:border-[#8B0000]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3 rounded-md bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Transmitting...' : 'Send Festive Message'}</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};
