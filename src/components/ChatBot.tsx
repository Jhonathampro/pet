import React, { useEffect, useRef, useState } from 'react';
import type { Pet, ONG, AbandonmentReport, FoodBankItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { getBotReply, getWelcome, type BotAction, type BotReply } from '../chatbot/botEngine';
import { ChevronRight, PawPrint, Send, X, ScoobyDogIcon } from './Icons';
import './ChatBot.css';

interface ChatMessage extends BotReply {
  id: number;
  from: 'bot' | 'user';
}

interface ChatBotProps {
  pets: Pet[];
  ongs: ONG[];
  reports: AbandonmentReport[];
  foodItems: FoodBankItem[];
  onNavigate: (tab: string, meta?: string) => void;
  onSelectPet: (pet: Pet) => void;
  onSelectONG: (ong: ONG) => void;
  onOpenAuthorities: () => void;
}

/** Renderiza **negrito** e quebras de linha de forma segura */
const RichText: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split('\n').map((line, i) => (
      <p key={i}>
        {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part
        )}
      </p>
    ))}
  </>
);

let nextId = 1;

export const ChatBot: React.FC<ChatBotProps> = ({
  pets, ongs, reports, foodItems, onNavigate, onSelectPet, onSelectONG, onOpenAuthorities,
}) => {
  const { user, isLoggedIn, isONG } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const suggRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateSuggArrows = () => {
    const el = suggRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  const scrollSugg = (dir: 1 | -1) => {
    const el = suggRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' });
  };

  const ctx = { pets, ongs, reports, foodItems, user, isLoggedIn, isONG };

  const toggleOpen = () => {
    if (!open) {
      // Mensagem de boas-vindas ao abrir pela primeira vez
      if (messages.length === 0) setMessages([{ id: nextId++, from: 'bot', ...getWelcome(ctx) }]);
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    setOpen(!open);
  };

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setMessages(m => [...m, { id: nextId++, from: 'user', text }]);
    setInput('');
    setTyping(true);
    const reply = getBotReply(text, ctx);
    const delay = Math.min(1200, 400 + reply.text.length * 4);
    timerRef.current = window.setTimeout(() => {
      setMessages(m => [...m, { id: nextId++, from: 'bot', ...reply }]);
      setTyping(false);
    }, delay);
  };

  const runAction = (action: BotAction) => {
    switch (action.type) {
      case 'navigate':
        onNavigate(action.tab);
        break;
      case 'pet': {
        const pet = pets.find(p => p.id === action.petId);
        if (pet) onSelectPet(pet);
        break;
      }
      case 'ong': {
        const ong = ongs.find(o => o.id === action.ongId);
        if (ong) onSelectONG(ong);
        break;
      }
      case 'authorities':
        onOpenAuthorities();
        break;
    }
    // Em telas pequenas, fecha o chat para mostrar o conteúdo
    if (window.innerWidth < 640) setOpen(false);
  };

  const resetChat = () => {
    window.clearTimeout(timerRef.current);
    setTyping(false);
    setMessages([{ id: nextId++, from: 'bot', ...getWelcome(ctx) }]);
  };

  const lastBot = [...messages].reverse().find(m => m.from === 'bot');

  useEffect(() => {
    const el = suggRef.current;
    if (el) el.scrollLeft = 0;
    updateSuggArrows();
    window.addEventListener('resize', updateSuggArrows);
    return () => window.removeEventListener('resize', updateSuggArrows);
  }, [lastBot?.suggestions, typing, open]);

  return (
    <>
      {open && (
        <section className="chatbot-window" role="dialog" aria-label="Assistente virtual Scooby">
          <header className="chatbot-header">
            <div className="chatbot-avatar">
              <ScoobyDogIcon size={34} />
            </div>
            <div className="chatbot-title">
              <strong>Scooby • Mascote PetHub</strong>
              <span><i className="chatbot-online" /> Au au! Pronto para ajudar</span>
            </div>
            <button className="chatbot-icon-btn chatbot-reset" onClick={resetChat} title="Nova conversa">↺</button>
            <button className="chatbot-icon-btn" onClick={() => setOpen(false)} aria-label="Fechar chat"><X size={18} /></button>
          </header>

          <div className="chatbot-messages" ref={listRef} aria-live="polite">
            {messages.map(msg => (
              <div key={msg.id} className={`chatbot-row ${msg.from}`}>
                <div className="chatbot-bubble">
                  <RichText text={msg.text} />

                  {msg.pets && msg.pets.length > 0 && (
                    <div className="chatbot-pets">
                      {msg.pets.map(pet => (
                        <button key={pet.id} className="chatbot-pet" onClick={() => runAction({ type: 'pet', label: '', petId: pet.id })}>
                          <img src={pet.image} alt={pet.name} />
                          <span>
                            <strong>{pet.name}</strong>
                            <small>{pet.breed} · {pet.age}</small>
                            <small>{pet.city}/{pet.state}</small>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.actions && msg.actions.length > 0 && (
                    <div className="chatbot-actions">
                      {msg.actions.map((a, i) => (
                        <button key={i} className="chatbot-action" onClick={() => runAction(a)}>{a.label} →</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="chatbot-row bot">
                <div className="chatbot-bubble chatbot-typing"><span /><span /><span /></div>
              </div>
            )}
          </div>

          {!typing && lastBot?.suggestions && (
            <div className="chatbot-suggestions-wrap">
              {canScrollLeft && (
                <button type="button" className="chatbot-sugg-arrow left" onClick={() => scrollSugg(-1)} aria-label="Ver sugestões anteriores">
                  <ChevronRight size={14} />
                </button>
              )}
              <div className="chatbot-suggestions" ref={suggRef} onScroll={updateSuggArrows}>
                {lastBot.suggestions.map(s => (
                  <button key={s} onClick={() => send(s)}>{s}</button>
                ))}
              </div>
              {canScrollRight && (
                <button type="button" className="chatbot-sugg-arrow right" onClick={() => scrollSugg(1)} aria-label="Ver mais sugestões">
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          )}

          <form className="chatbot-input" onSubmit={e => { e.preventDefault(); send(input); }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              maxLength={300}
              aria-label="Mensagem"
            />
            <button type="submit" disabled={!input.trim() || typing} aria-label="Enviar"><Send size={18} /></button>
          </form>
        </section>
      )}

      <button
        className={`chatbot-fab ${open ? 'is-open' : ''}`}
        onClick={toggleOpen}
        aria-label={open ? 'Fechar Scooby' : 'Abrir chat com o mascote Scooby'}
        title="Fale com o mascote Scooby 🐾"
      >
        {open ? <X size={24} /> : <ScoobyDogIcon size={36} />}
        {!open && unread && <span className="chatbot-badge">1</span>}
      </button>
    </>
  );
};
