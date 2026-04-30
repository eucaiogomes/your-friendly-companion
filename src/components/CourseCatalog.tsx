import React, { useState } from 'react';
import {
  Info, ChevronDown, ChevronUp, AlertCircle, RefreshCw, CreditCard, Clock,
  BookOpen, Play, FileText, Video, Users, Wifi, LayoutGrid, UploadCloud,
  CheckSquare, Star, Award, Lock, Search, Bell, Globe, Menu, PlayCircle,
  Calendar, Wallet, GraduationCap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { CustomFieldsModal } from './CustomFieldsModal';
import { PaymentModalV2 } from './PaymentModalV2';
import { PaymentModal } from './PaymentModal';
import { BoletoModal } from './BoletoModal';

interface CourseCatalogProps {
  onNavigate: (screen: 'catalog' | 'view' | 'design' | 'trilha' | 'trilhaView' | 'treinamentoTrilha') => void;
  enrollmentStatus: 'default' | 'payment' | 'rejected' | 'pending';
  setEnrollmentStatus: (status: 'default' | 'payment' | 'rejected' | 'pending') => void;
  selectedTurmaId: number | null;
  setSelectedTurmaId: (id: number | null) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  isBoletoModalOpen: boolean;
  setIsBoletoModalOpen: (open: boolean) => void;
  isOldPaymentModalOpen: boolean;
  setIsOldPaymentModalOpen: (open: boolean) => void;
}

interface Turma {
  id: number;
  title: string;
  prazo: string;
  price: string;
  vagas: string;
  modo: string;
  recomendada?: boolean;
  hasExtras?: boolean;
  extrasCount?: number;
}

interface ContentItem {
  type: string;
  title: string;
  exclusive?: boolean;
  free?: boolean;
}

const turmas: Turma[] = [
  { id: 1, title: '1ª Gratuita com aprovação do gestor', prazo: 'Indeterminado', price: 'Gratuito', vagas: '50 vagas', modo: 'EaD' },
  { id: 2, title: '2ª Gratuita sem aprovação do gestor', prazo: 'Indeterminado', price: 'Gratuito', vagas: 'Ilimitadas', modo: 'EaD', recomendada: true, hasExtras: true, extrasCount: 2 },
  { id: 3, title: '3ª Paga com aprov. gestor + campos', prazo: 'Indeterminado', price: 'R$ 297,00', vagas: '25 vagas', modo: 'Presencial', hasExtras: true, extrasCount: 2 },
  { id: 4, title: '4ª Noturna EAD', prazo: 'Indeterminado', price: 'Gratuito', vagas: '80 vagas', modo: 'EaD' },
  { id: 5, title: '5ª Presencial SP', prazo: 'Indeterminado', price: 'R$ 450,00', vagas: '25 vagas', modo: 'Presencial' },
  { id: 6, title: '6ª Noturna Rio de Janeiro', prazo: 'Indeterminado', price: 'Gratuito', vagas: '40 vagas', modo: 'Presencial', hasExtras: true, extrasCount: 1 },
  { id: 7, title: '7ª EAD Internacional', prazo: 'Indeterminado', price: 'R$ 597,00', vagas: 'Ilimitadas', modo: 'EaD' },
  { id: 8, title: '8ª Presencial BH', prazo: 'Indeterminado', price: 'R$ 350,00', vagas: '30 vagas', modo: 'Presencial' },
  { id: 9, title: '9ª Aluno aplicando cupom de desconto', prazo: 'Indeterminado', price: 'R$ 49,90', vagas: 'Ilimitadas', modo: 'EaD' },
];

const baseContents: ContentItem[] = [
  { type: 'Tópico', title: 'Módulo 1: Fundamentos', free: true },
  { type: 'Vídeos', title: 'Introdução ao Pensamento Jurídico Brasileiro', free: true },
  { type: 'Documentos', title: 'Material de Apoio (PDF)', free: true },
  { type: 'Gravado', title: 'Aula Magna Gravada' },
  { type: 'Aula presencial', title: 'Encontro Presencial - Polo SP' },
  { type: 'Webconferência', title: 'Tira-dúvidas ao vivo' },
  { type: 'Scorm', title: 'Módulo Interativo SCORM' },
  { type: 'Entrega de atividade', title: 'Trabalho de Conclusão de Módulo' },
  { type: 'Avaliação', title: 'Prova de Conhecimentos' },
  { type: 'Avaliação de reação/pesquisa', title: 'Pesquisa de Satisfação' },
  { type: 'Certificado', title: 'Emissão do Certificado' },
];

const extraContents: ContentItem[] = [
  { type: 'Vídeos', title: 'Masterclass Exclusiva de Encerramento', exclusive: true },
  { type: 'Documentos', title: 'Apostila Premium com Jurisprudência', exclusive: true },
];

const CONTENT_ICONS: Record<string, React.ReactNode> = {
  'Tópico': <BookOpen size={20} strokeWidth={1.75} />,
  'Vídeos': <PlayCircle size={20} strokeWidth={1.75} />,
  'Documentos': <FileText size={20} strokeWidth={1.75} />,
  'Gravado': <Video size={20} strokeWidth={1.75} />,
  'Aula presencial': <Users size={20} strokeWidth={1.75} />,
  'Webconferência': <Wifi size={20} strokeWidth={1.75} />,
  'Scorm': <LayoutGrid size={20} strokeWidth={1.75} />,
  'Entrega de atividade': <UploadCloud size={20} strokeWidth={1.75} />,
  'Avaliação': <CheckSquare size={20} strokeWidth={1.75} />,
  'Avaliação de reação/pesquisa': <Star size={20} strokeWidth={1.75} />,
  'Certificado': <GraduationCap size={20} strokeWidth={1.75} />,
};

const TURMAS_LIMIT = 8;

const tabs = [
  { id: 'conteudos', label: 'CONTEÚDOS' },
  { id: 'resumo', label: 'RESUMO' },
  { id: 'autor', label: 'SOBRE O AUTOR' },
];

// Brand navy used for headings/labels per user request
const NAVY = '#003366';

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  onNavigate,
  enrollmentStatus,
  setEnrollmentStatus,
  selectedTurmaId,
  setSelectedTurmaId,
  isPaymentModalOpen,
  setIsPaymentModalOpen,
  isBoletoModalOpen,
  setIsBoletoModalOpen,
  isOldPaymentModalOpen,
  setIsOldPaymentModalOpen,
}) => {
  const [activeTab, setActiveTab] = useState('conteudos');
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isTurmasExpanded, setIsTurmasExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedTurma = selectedTurmaId ? turmas.find(t => t.id === selectedTurmaId) ?? null : null;

  const visibleTurmas = isTurmasExpanded ? turmas : turmas.slice(0, TURMAS_LIMIT);
  const hiddenCount = turmas.length - TURMAS_LIMIT;

  const displayedContents: ContentItem[] = [
    ...baseContents,
    ...(selectedTurma?.hasExtras ? extraContents : []),
  ];

  const handleTurmaClick = (id: number) => {
    if (enrollmentStatus !== 'default') return;
    setSelectedTurmaId(selectedTurmaId === id ? null : id);
  };

  const handleMainAction = () => {
    if (!selectedTurmaId) return;
    if (selectedTurmaId === 2) {
      onNavigate('view');
    } else if (selectedTurmaId === 9) {
      setIsOldPaymentModalOpen(true);
    } else if (selectedTurmaId === 1 || selectedTurmaId === 7) {
      setEnrollmentStatus('pending');
    } else if ([3, 4, 5, 6].includes(selectedTurmaId)) {
      setIsModalOpen(true);
    } else {
      setEnrollmentStatus('payment');
    }
  };

  const mainButtonLabel = !selectedTurmaId
    ? 'SELECIONE UMA TURMA'
    : selectedTurma?.price === 'Gratuito'
      ? 'FAZER INSCRIÇÃO'
      : `INSCREVER POR ${selectedTurma?.price}`;

  // Default to first turma so the expanded card always shows like the reference
  const expandedTurma = selectedTurma ?? turmas[0];
  const expandedTurmaId = selectedTurmaId ?? turmas[0].id;

  return (
    <div className="flex flex-col h-[100dvh] bg-ice font-sans" style={{ color: NAVY }}>
      {/* ── Header ── */}
      <header className="flex-none flex items-center justify-between border-b border-gray-100 bg-white" style={{ height: 60, padding: '0 24px' }}>
        <div className="flex items-center gap-6">
          <button className="text-gray-500 hover:text-gray-800 transition-colors">
            <Menu size={20} />
          </button>
          {/* Logo placeholder */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center font-black text-white"
              style={{ background: 'var(--brand-color)', fontSize: 14 }}
            >
              L
            </div>
            <div className="leading-none">
              <div className="font-black tracking-tight" style={{ fontSize: 16, color: NAVY }}>Lector</div>
              <div className="font-medium tracking-wide" style={{ fontSize: 8, color: '#9ca3af', marginTop: 2 }}>tecnologia</div>
            </div>
          </div>
        </div>

        {/* Center menu */}
        <nav className="flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {[
            { label: 'Conteúdo', icon: <PlayCircle size={16} />, active: true },
            { label: 'Social', icon: <Users size={16} /> },
            { label: 'Minha Área', icon: <Users size={16} /> },
          ].map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-2 font-bold transition-colors relative pb-1"
              style={{
                fontSize: 13,
                color: item.active ? 'var(--brand-color)' : '#6b7280',
              }}
            >
              {item.icon}
              {item.label}
              {item.active && (
                <span
                  className="absolute -bottom-[19px] left-0 right-0 h-[3px] rounded-t"
                  style={{ background: 'var(--brand-color)' }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:flex items-center">
            <Search size={14} className="absolute left-3 text-gray-400" />
            <input
              placeholder="Pesquisar..."
              className="bg-gray-50 border-0 rounded-full pl-9 pr-14 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-gray-200"
              style={{ width: 240, fontSize: 12 }}
            />
            <span
              className="absolute right-3 text-gray-400 font-medium"
              style={{ fontSize: 10 }}
            >
              ctrl + k
            </span>
          </div>
          {/* Bell */}
          <button className="relative text-gray-500 hover:text-gray-800 transition-colors">
            <Bell size={18} />
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
              style={{ background: 'var(--brand-color)', fontSize: 9 }}
            >
              3
            </span>
          </button>
          <button className="text-gray-500 hover:text-gray-800 transition-colors">
            <Globe size={18} />
          </button>
          {/* Avatar */}
          <button className="flex items-center gap-2">
            <img
              src="https://picsum.photos/seed/caio/100/100"
              alt="Avatar"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-gray-100"
            />
            <span className="font-bold" style={{ fontSize: 12, color: NAVY }}>Caio Gomes</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* ── Main grid ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ──────────── SIDEBAR ──────────── */}
        <aside
          className="relative flex-none flex flex-col border-r border-gray-100 bg-white overflow-y-auto custom-scrollbar"
          style={{ width: 320, padding: '20px 16px' }}
        >
          {/* Section label */}
          <div
            className="font-black uppercase tracking-widest mb-3"
            style={{ fontSize: 10, color: NAVY }}
          >
            Escolha sua turma
          </div>

          {/* Selected turma instruction */}
          {!selectedTurmaId && (
            <div className="flex items-center gap-1.5 mb-3">
              <Info size={11} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-400" style={{ fontSize: 10 }}>
                Selecione uma turma para continuar
              </span>
            </div>
          )}

          {/* Turma list — each one expands in place when selected */}
          {visibleTurmas.map(turma => {
            const isSelected = selectedTurmaId === turma.id;
            return (
              <motion.div
                key={turma.id}
                layout
                onClick={() => handleTurmaClick(turma.id)}
                className="rounded-xl mb-2 cursor-pointer transition-colors"
                style={{
                  border: `${isSelected ? '1.5px' : '1px'} solid ${isSelected ? 'var(--brand-color)' : '#e5e7eb'}`,
                  background: isSelected ? 'color-mix(in srgb, var(--brand-color) 5%, white)' : 'white',
                  padding: isSelected ? 14 : '12px 14px',
                }}
              >
                {/* Header row */}
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{
                      width: 14, height: 14,
                      border: `${isSelected ? '2px' : '1.5px'} solid ${isSelected ? 'var(--brand-color)' : '#d1d5db'}`,
                    }}
                  >
                    {isSelected && <div className="rounded-full" style={{ width: 6, height: 6, background: 'var(--brand-color)' }} />}
                  </div>
                  <span className="font-bold flex-1 truncate" style={{ fontSize: isSelected ? 12 : 11.5, color: NAVY }}>
                    {turma.title}
                  </span>
                  <span className="font-bold" style={{ fontSize: isSelected ? 12 : 11.5, color: NAVY }}>
                    {turma.price}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-gray-500" style={{ fontSize: 10 }}>
                    Prazo {turma.prazo.toLowerCase()} · {turma.vagas}
                  </span>
                  {turma.hasExtras && turma.extrasCount && (
                    <span
                      className="font-black rounded px-1.5 py-0.5 tracking-wider"
                      style={{ fontSize: 8, background: '#E1F5EE', color: '#0F6E56' }}
                    >
                      +{turma.extrasCount} EXTRAS
                    </span>
                  )}
                  {turma.recomendada && (
                    <span
                      className="font-black rounded px-1.5 py-0.5 tracking-wider"
                      style={{ fontSize: 8, background: '#FAEEDA', color: '#854F0B' }}
                    >
                      RECOMENDADA
                    </span>
                  )}
                </div>

                {/* Expanded content */}
                <AnimatePresence initial={false}>
                  {isSelected && (
                    <motion.div
                      key="expanded"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      {/* Detail rows */}
                      <div
                        className="border-t border-dashed mt-3 pt-3 space-y-2"
                        style={{ borderColor: 'color-mix(in srgb, var(--brand-color) 25%, transparent)' }}
                      >
                        {[
                          { icon: <Clock size={12} />, key: 'Prazo', value: turma.prazo },
                          { icon: <Users size={12} />, key: 'Vagas', value: `${turma.vagas.replace(' vagas', '')} disponíveis` },
                          { icon: <Wallet size={12} />, key: 'Valor', value: turma.price },
                          { icon: <GraduationCap size={12} />, key: 'Modo', value: turma.modo },
                        ].map(row => (
                          <div key={row.key} className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-500" style={{ fontSize: 11 }}>
                              {row.icon}
                              <span>{row.key}</span>
                            </div>
                            <span className="font-bold" style={{ fontSize: 11, color: NAVY }}>
                              {row.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTAs inside expanded card */}
                      <div className="mt-4 space-y-2">
                        {enrollmentStatus === 'default' && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleMainAction(); }}
                              className="w-full font-black tracking-wider text-white rounded-lg transition-all hover:opacity-90"
                              style={{ fontSize: 11, padding: '11px', background: 'var(--brand-color)', letterSpacing: '0.06em' }}
                            >
                              {mainButtonLabel}
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="w-full font-black tracking-wider rounded-lg transition-all hover:bg-gray-50"
                              style={{
                                fontSize: 11, padding: '10px',
                                border: `1.5px solid var(--brand-color)`,
                                color: 'var(--brand-color)', background: 'white', letterSpacing: '0.06em',
                              }}
                            >
                              REGISTRAR INTERESSE
                            </button>
                          </>
                        )}
                        {enrollmentStatus === 'pending' && (
                          <div
                            className="w-full flex items-center justify-center gap-2 font-bold rounded-lg"
                            style={{
                              fontSize: 11, padding: '11px',
                              color: 'var(--brand-color)',
                              background: 'color-mix(in srgb, var(--brand-color) 10%, white)',
                              border: '1px solid color-mix(in srgb, var(--brand-color) 25%, transparent)',
                            }}
                          >
                            <Clock size={13} /> AGUARDANDO APROVAÇÃO
                          </div>
                        )}
                        {enrollmentStatus === 'payment' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setIsBoletoModalOpen(true); }}
                            className="w-full flex items-center justify-center gap-2 font-black text-white rounded-lg hover:opacity-90"
                            style={{ fontSize: 11, padding: '11px', background: 'var(--brand-color)' }}
                          >
                            <CreditCard size={13} /> EFETUAR PAGAMENTO
                          </button>
                        )}
                        {enrollmentStatus === 'rejected' && (
                          <div className="space-y-2">
                            <div className="flex items-start gap-2 rounded-lg p-2" style={{ background: '#fef2f2', border: '1px solid #fecaca', fontSize: 11 }}>
                              <AlertCircle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
                              <span className="text-red-700">Matrícula recusada pelo gestor</span>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                              className="w-full flex items-center justify-center gap-2 font-black text-white rounded-lg hover:opacity-90"
                              style={{ fontSize: 11, padding: '11px', background: 'var(--brand-color)' }}
                            >
                              <RefreshCw size={13} /> REENVIAR CAMPOS
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Ver mais */}
          {turmas.length > TURMAS_LIMIT && (
            <button
              onClick={() => setIsTurmasExpanded(v => !v)}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 transition-all hover:bg-gray-50 font-bold"
              style={{ border: '1px solid #e5e7eb', fontSize: 11, color: NAVY }}
            >
              {isTurmasExpanded
                ? <>Mostrar menos <ChevronUp size={13} /></>
                : <>Ver mais {hiddenCount} turma{hiddenCount !== 1 ? 's' : ''} <ChevronDown size={13} /></>
              }
            </button>
          )}
        </aside>

        {/* ──────────── MAIN CONTENT ──────────── */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-ice" style={{ padding: '24px 32px' }}>
          {/* Hero compacto: container retangular destacado com capa quadrada + título/descrição */}
          <div
            className="flex gap-5 mb-5 bg-white rounded-2xl border border-gray-100"
            style={{
              padding: 16,
              boxShadow: '0 8px 24px -12px rgba(0, 51, 102, 0.12), 0 2px 6px -2px rgba(0,0,0,0.04)',
            }}
          >
            {/* Cover quadrada */}
            <div
              className="relative flex-shrink-0 overflow-hidden rounded-xl shadow-md"
              style={{ width: 168, height: 168 }}
            >
              <img
                src="https://picsum.photos/seed/lawnight/400/400"
                alt="Capa do curso"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0) 100%)',
                }}
              />
              <div className="absolute top-2 left-2 flex gap-1.5">
                <span
                  className="bg-white/95 backdrop-blur font-black rounded px-1.5 py-0.5 tracking-wider"
                  style={{ fontSize: 8, color: NAVY }}
                >
                  EXTENSÃO
                </span>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="text-white font-black leading-tight tracking-tight uppercase" style={{ fontSize: 13 }}>
                  Teoria Geral<br />do Direito
                </div>
              </div>
            </div>

            {/* Right: título + descrição + meta */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div
                  className="font-black uppercase tracking-wider"
                  style={{ fontSize: 9.5, color: 'var(--brand-color)' }}
                >
                  Curso de Extensão · Jurídico
                </div>
                <button
                  className="flex-shrink-0 flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50 transition-colors font-bold"
                  style={{ fontSize: 10.5, color: NAVY }}
                >
                  <Info size={12} className="text-gray-400" />
                  Sobre o curso
                </button>
              </div>

              <h1
                className="font-black leading-tight tracking-tight mb-1.5"
                style={{ fontSize: 19, color: NAVY }}
              >
                2º Curso de extensão em Teoria Geral do Direito: formação do pensamento intelectual brasileiro
              </h1>

              <p
                className="text-gray-600"
                style={{
                  fontSize: 12,
                  lineHeight: 1.55,
                  display: isDescExpanded ? 'block' : '-webkit-box',
                  WebkitLineClamp: isDescExpanded ? undefined : 2,
                  WebkitBoxOrient: isDescExpanded ? undefined : 'vertical',
                  overflow: 'hidden',
                }}
              >
                Este curso propõe uma análise profunda das bases do pensamento intelectual brasileiro através da Teoria Geral do Direito.
                Exploramos as conexões entre a formação jurídica e o desenvolvimento social do país, abordando temas fundamentais para a
                compreensão da nossa estrutura institucional contemporânea.
              </p>

              <button
                onClick={() => setIsDescExpanded(v => !v)}
                className="self-start flex items-center gap-1 font-bold mt-1 hover:opacity-80 transition-opacity"
                style={{ fontSize: 11, color: 'var(--brand-color)' }}
              >
                {isDescExpanded ? <>Recolher <ChevronUp size={12} /></> : <>Ler mais <ChevronDown size={12} /></>}
              </button>

              {/* Meta strip */}
              <div className="mt-auto flex items-center gap-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: 11 }}>
                  <Clock size={12} className="text-gray-400" />
                  <span className="font-bold" style={{ color: NAVY }}>36h</span>
                </div>
                <div className="w-px h-3 bg-gray-200" />
                <div className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: 11 }}>
                  <BookOpen size={12} className="text-gray-400" />
                  <span className="font-bold" style={{ color: NAVY }}>11 módulos</span>
                </div>
                <div className="w-px h-3 bg-gray-200" />
                <div className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: 11 }}>
                  <GraduationCap size={12} className="text-gray-400" />
                  <span className="font-bold" style={{ color: NAVY }}>Certificado</span>
                </div>
                <div className="w-px h-3 bg-gray-200" />
                <div className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: 11 }}>
                  <Users size={12} className="text-gray-400" />
                  <span className="font-bold" style={{ color: NAVY }}>9 turmas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-gray-200 mb-2">
            <div className="flex">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="font-black tracking-wider transition-all"
                  style={{
                    fontSize: 11,
                    padding: '12px 22px',
                    marginBottom: -1,
                    color: activeTab === tab.id ? 'var(--brand-color)' : '#9ca3af',
                    borderBottom: `3px solid ${activeTab === tab.id ? 'var(--brand-color)' : 'transparent'}`,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <span className="text-gray-400 font-medium" style={{ fontSize: 11 }}>
              {displayedContents.length} módulos
            </span>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="pt-2"
            >
              {activeTab === 'conteudos' && (
                <div className="flex flex-col">
                  {displayedContents.map((item, index) => {
                    const free = item.free;
                    return (
                      <motion.div
                        key={item.title}
                        initial={index >= baseContents.length ? { opacity: 0, x: -8 } : false}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-4 border-b border-gray-100 hover:bg-white/60 cursor-pointer transition-colors group"
                        style={{ padding: '14px 4px' }}
                      >
                        {/* Big icon tile */}
                        <div
                          className="flex-shrink-0 flex items-center justify-center rounded-xl"
                          style={{
                            width: 44, height: 44,
                            background: 'color-mix(in srgb, var(--brand-color) 10%, white)',
                            color: 'var(--brand-color)',
                          }}
                        >
                          {CONTENT_ICONS[item.type] ?? <FileText size={20} />}
                        </div>

                        {/* Type label */}
                        <div style={{ width: 180 }} className="flex-shrink-0">
                          <div
                            className="font-black tracking-wider uppercase"
                            style={{ fontSize: 11, color: 'var(--brand-color)', lineHeight: 1.25 }}
                          >
                            {item.type}
                          </div>
                        </div>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate" style={{ fontSize: 13, color: NAVY }}>
                            {item.title}
                            {item.exclusive && (
                              <span
                                className="font-black ml-2 rounded px-1.5 py-0.5 tracking-wider"
                                style={{ fontSize: 8, background: '#E1F5EE', color: '#0F6E56' }}
                              >
                                EXCLUSIVO
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className="flex-shrink-0">
                          {free ? (
                            <span
                              className="font-bold rounded-full px-3 py-1.5 inline-block"
                              style={{
                                fontSize: 11,
                                background: '#E1F5EE',
                                color: '#0F6E56',
                              }}
                            >
                              Livre
                            </span>
                          ) : (
                            <span
                              className="font-bold rounded-full px-3 py-1.5 inline-flex items-center gap-1.5"
                              style={{
                                fontSize: 11,
                                background: '#f3f4f6',
                                color: '#9ca3af',
                              }}
                            >
                              <Lock size={11} />
                              Bloqueado
                            </span>
                          )}
                        </div>

                        {/* Chevron */}
                        <ChevronDown
                          size={16}
                          className="text-gray-300 -rotate-90 group-hover:text-gray-500 transition-colors flex-shrink-0"
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'resumo' && (
                <p className="italic text-gray-600" style={{ fontSize: 13, lineHeight: 1.7, paddingTop: 16 }}>
                  Uma jornada intelectual que conecta o passado jurídico do Brasil com os desafios do presente,
                  focando na construção de uma consciência crítica sobre nossas instituições.
                </p>
              )}

              {activeTab === 'autor' && (
                <div className="flex items-center gap-4 pt-4">
                  <img
                    src="https://picsum.photos/seed/professor/100/100"
                    alt="Autor"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                  />
                  <div>
                    <div className="font-black" style={{ fontSize: 14, color: NAVY }}>Dr. Roberto Silva</div>
                    <div className="text-gray-500" style={{ fontSize: 12 }}>Doutor em Teoria do Direito e Pesquisador Sênior</div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      <CustomFieldsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          setEnrollmentStatus('pending');
        }}
      />

      <PaymentModalV2
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        itemName="TEORIA GERAL DO DIREITO"
        itemPrice={parseFloat(
          selectedTurma?.price.replace('R$ ', '').replace('.', '').replace(',', '.') ?? '1000'
        )}
        onSuccess={() => {
          setIsPaymentModalOpen(false);
          setEnrollmentStatus('payment');
          setIsBoletoModalOpen(true);
        }}
      />

      <BoletoModal
        isOpen={isBoletoModalOpen}
        onClose={() => setIsBoletoModalOpen(false)}
        price={parseFloat(
          selectedTurma?.price.replace('R$ ', '').replace('.', '').replace(',', '.') ?? '1000'
        )}
      />

      <PaymentModal
        isOpen={isOldPaymentModalOpen}
        onClose={() => setIsOldPaymentModalOpen(false)}
        itemName={selectedTurma?.title ?? 'TEORIA GERAL DO DIREITO'}
        itemPrice={parseFloat(
          selectedTurma?.price.replace('R$ ', '').replace('.', '').replace(',', '.') ?? '1000'
        )}
        onSuccess={() => {
          setIsOldPaymentModalOpen(false);
          onNavigate('view');
        }}
      />
    </div>
  );
};
