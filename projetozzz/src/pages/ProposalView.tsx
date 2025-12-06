import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  MapPin, Calendar, Users, Plane, Hotel, Star, 
  Check, Phone, Mail, MessageCircle, ChevronRight,
  CloudSun, Languages, Coins, Sparkles, Clock,
  Building2
} from 'lucide-react';
import { TravelProposal } from '../types';
import { getProposal, applyTheme, formatDate, formatCurrency, calculateDuration } from '../services/storage';

export const ProposalView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<TravelProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);

  useEffect(() => {
    if (id) {
      const data = getProposal(id);
      setProposal(data);
      if (data) {
        applyTheme(data.agency.theme);
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Proposta não encontrada</h1>
          <p className="text-gray-500">O link pode estar incorreto ou expirado.</p>
        </div>
      </div>
    );
  }

  const duration = calculateDuration(proposal.destination.checkIn, proposal.destination.checkOut);

  const handleWhatsApp = () => {
    const phone = proposal.consultant.phone.replace(/\D/g, '');
    const text = encodeURIComponent(`Olá! Vi a proposta de viagem para ${proposal.destination.name} e gostaria de mais informações!`);
    window.open(`https://wa.me/55${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {proposal.agency.logo ? (
              <img src={proposal.agency.logo} alt={proposal.agency.name} className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 size={20} className="text-primary" />
              </div>
            )}
            <div>
              <h1 className="font-bold text-gray-800">{proposal.agency.name}</h1>
              {proposal.agency.slogan && (
                <p className="text-xs text-gray-500">{proposal.agency.slogan}</p>
              )}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWhatsApp}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors"
          >
            <MessageCircle size={16} />
            <span className="hidden sm:inline">WhatsApp</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0"
        >
          {proposal.destination.heroImage ? (
            <img
              src={proposal.destination.heroImage}
              alt={proposal.destination.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-accent" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4"
        >
          {/* Special Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6"
          >
            <Sparkles size={16} className="text-accent" />
            Proposta Especial
          </motion.div>

          {/* Destination Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            {proposal.destination.name}
          </motion.h1>

          {/* Dates */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/80 mb-8"
          >
            {formatDate(proposal.destination.checkIn)} — {formatDate(proposal.destination.checkOut)}
          </motion.p>

          {/* Mini Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <Calendar size={16} />
              <span>{duration} noites</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <Users size={16} />
              <span>{proposal.investment.travelers} viajante{proposal.investment.travelers > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <Hotel size={16} />
              <span>{proposal.accommodation.name}</span>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-white/60"
            >
              <span className="text-sm">Role para explorar</span>
              <ChevronRight className="w-6 h-6 rotate-90" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12"
          >
            {/* Description */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Sobre o Destino
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {proposal.about.description}
              </p>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                {proposal.about.climate && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <CloudSun className="w-6 h-6 text-primary mb-2" />
                    <p className="text-sm text-gray-500">Clima</p>
                    <p className="font-semibold text-gray-800">{proposal.about.climate}</p>
                  </div>
                )}
                {proposal.about.bestSeason && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <Calendar className="w-6 h-6 text-primary mb-2" />
                    <p className="text-sm text-gray-500">Melhor Época</p>
                    <p className="font-semibold text-gray-800">{proposal.about.bestSeason}</p>
                  </div>
                )}
                {proposal.about.language && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <Languages className="w-6 h-6 text-primary mb-2" />
                    <p className="text-sm text-gray-500">Idioma</p>
                    <p className="font-semibold text-gray-800">{proposal.about.language}</p>
                  </div>
                )}
                {proposal.about.currency && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <Coins className="w-6 h-6 text-primary mb-2" />
                    <p className="text-sm text-gray-500">Moeda</p>
                    <p className="font-semibold text-gray-800">{proposal.about.currency}</p>
                  </div>
                )}
              </div>

              {/* Highlights */}
              {proposal.about.highlights.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-800 mb-3">Destaques</h3>
                  <div className="flex flex-wrap gap-2">
                    {proposal.about.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 gap-4">
              {proposal.about.photos.filter(p => p).map((photo, idx) => (
                <motion.img
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  src={photo}
                  alt={`${proposal.destination.name} ${idx + 1}`}
                  className={`rounded-2xl object-cover shadow-lg ${idx === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Flights Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Plane className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900">Voos</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Outbound */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-2 text-primary mb-4">
                  <Plane size={20} />
                  <span className="font-semibold">Ida</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{proposal.flights.outbound.originCode}</p>
                    <p className="text-sm text-gray-500">{proposal.flights.outbound.origin}</p>
                    <p className="text-sm font-medium text-primary mt-1">{proposal.flights.outbound.time}</p>
                  </div>
                  <div className="flex-1 px-4">
                    <div className="relative">
                      <div className="h-0.5 bg-gray-200 w-full" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                        <div className="flex flex-col items-center text-xs text-gray-400">
                          <Clock size={14} />
                          <span>{proposal.flights.outbound.duration}</span>
                          <span>{proposal.flights.outbound.stops}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{proposal.flights.outbound.destinationCode}</p>
                    <p className="text-sm text-gray-500">{proposal.flights.outbound.destination}</p>
                  </div>
                </div>
                {proposal.flights.outbound.company && (
                  <p className="text-center mt-4 text-sm text-gray-400">{proposal.flights.outbound.company}</p>
                )}
              </div>

              {/* Return */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-2 text-primary mb-4">
                  <Plane size={20} className="rotate-180" />
                  <span className="font-semibold">Volta</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{proposal.flights.return.originCode}</p>
                    <p className="text-sm text-gray-500">{proposal.flights.return.origin}</p>
                    <p className="text-sm font-medium text-primary mt-1">{proposal.flights.return.time}</p>
                  </div>
                  <div className="flex-1 px-4">
                    <div className="relative">
                      <div className="h-0.5 bg-gray-200 w-full" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                        <div className="flex flex-col items-center text-xs text-gray-400">
                          <Clock size={14} />
                          <span>{proposal.flights.return.duration}</span>
                          <span>{proposal.flights.return.stops}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{proposal.flights.return.destinationCode}</p>
                    <p className="text-sm text-gray-500">{proposal.flights.return.destination}</p>
                  </div>
                </div>
                {proposal.flights.return.company && (
                  <p className="text-center mt-4 text-sm text-gray-400">{proposal.flights.return.company}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Accommodation Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Hotel className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900">Hospedagem</h2>
            </div>

            <div className="bg-gray-50 rounded-3xl overflow-hidden">
              {/* Hotel Photos */}
              {proposal.accommodation.photos.filter(p => p).length > 0 && (
                <div className="grid md:grid-cols-2 gap-1">
                  {proposal.accommodation.photos.filter(p => p).map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={proposal.accommodation.name}
                      className="w-full h-64 object-cover"
                    />
                  ))}
                </div>
              )}

              <div className="p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{proposal.accommodation.name}</h3>
                    <p className="text-gray-500 flex items-center gap-2 mt-1">
                      <MapPin size={16} />
                      {proposal.accommodation.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(proposal.accommodation.stars)].map((_, i) => (
                        <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <div className="px-3 py-1 bg-primary text-white rounded-lg font-bold">
                      {proposal.accommodation.rating.toFixed(1)}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{proposal.accommodation.description}</p>

                <div className="flex items-center gap-2 text-primary font-medium mb-4">
                  <Hotel size={18} />
                  {proposal.accommodation.roomType}
                </div>

                {proposal.accommodation.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {proposal.accommodation.amenities.map((amenity, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 border border-gray-200">
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Inclusions Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Check className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900">O que está incluso</h2>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {proposal.inclusions.flights && (
                <InclusionCard icon="✈️" text="Voos" />
              )}
              {proposal.inclusions.accommodation && (
                <InclusionCard icon="🏨" text="Hospedagem" />
              )}
              {proposal.inclusions.breakfast && (
                <InclusionCard icon="☕" text="Café da Manhã" />
              )}
              {proposal.inclusions.meals && (
                <InclusionCard icon="🍽️" text="Refeições" />
              )}
              {proposal.inclusions.airportTransfer && (
                <InclusionCard icon="🚐" text="Transfer Aeroporto" />
              )}
              {proposal.inclusions.tourTransfer && (
                <InclusionCard icon="🚐" text="Transfer Passeios" />
              )}
              {proposal.inclusions.carRental && (
                <InclusionCard icon="🚗" text={`Carro Aluguel${proposal.inclusions.carCategory ? ` (${proposal.inclusions.carCategory})` : ''}`} />
              )}
              {proposal.inclusions.taxes && (
                <InclusionCard icon="💳" text="Taxas Inclusas" />
              )}
              {proposal.inclusions.insurance && (
                <InclusionCard icon="🛡️" text="Seguro Viagem" />
              )}
              {proposal.inclusions.customItems.map((item, idx) => (
                <InclusionCard key={idx} icon="✨" text={item} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experiences Section */}
      {proposal.experiencesEnabled && proposal.experiences.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-12">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900">Experiências Incluídas</h2>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {proposal.experiences.map((exp, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                  >
                    <span className="text-5xl mb-4 block">{exp.emoji}</span>
                    <h3 className="font-bold text-gray-900 mb-2">{exp.name}</h3>
                    {exp.description && (
                      <p className="text-sm text-gray-500">{exp.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Investment Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-8">Investimento</h2>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8">
              <p className="text-gray-300 mb-2">Valor total do pacote</p>
              <p className="text-5xl md:text-6xl font-bold mb-4" style={{ color: 'var(--color-accent)' }}>
                {formatCurrency(proposal.investment.price)}
              </p>
              <p className="text-gray-400">
                para {proposal.investment.travelers} viajante{proposal.investment.travelers > 1 ? 's' : ''} • {formatCurrency(proposal.investment.price / proposal.investment.travelers)} por pessoa
              </p>

              {proposal.investment.installments && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-lg">💳 {proposal.investment.installments}</p>
                </div>
              )}
            </div>

            {proposal.investment.conditions && (
              <p className="text-sm text-gray-400 max-w-2xl mx-auto">
                {proposal.investment.conditions}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vamos transformar esse sonho em realidade?
            </h2>
            <p className="text-lg text-gray-500 mb-8">
              Entre em contato agora e garanta sua viagem
            </p>

            {/* Consultant Card */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {proposal.consultant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="text-left flex-1">
                  <h4 className="font-bold text-gray-800 text-lg">{proposal.consultant.name}</h4>
                  <p className="text-sm text-gray-500">{proposal.consultant.title}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <a
                  href={`tel:${proposal.consultant.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-700 font-medium transition-colors"
                >
                  <Phone size={18} />
                  {proposal.consultant.phone}
                </a>
                {proposal.consultant.email && (
                  <a
                    href={`mailto:${proposal.consultant.email}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-700 font-medium transition-colors"
                  >
                    <Mail size={18} />
                    E-mail
                  </a>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWhatsApp}
              className="w-full py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-xl font-bold flex items-center justify-center gap-3 transition-colors"
            >
              <MessageCircle size={24} />
              Falar pelo WhatsApp
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {proposal.agency.logo ? (
              <img src={proposal.agency.logo} alt={proposal.agency.name} className="h-8 w-auto object-contain" />
            ) : (
              <Building2 size={24} className="text-gray-400" />
            )}
            <span className="text-gray-600">{proposal.agency.name}</span>
          </div>
          <p className="text-sm text-gray-400">
            Proposta gerada com ✨ • ID: {proposal.id.slice(0, 12)}...
          </p>
        </div>
      </footer>
    </div>
  );
};

const InclusionCard: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm"
  >
    <span className="text-2xl">{icon}</span>
    <span className="font-medium text-gray-700">{text}</span>
  </motion.div>
);

export default ProposalView;
