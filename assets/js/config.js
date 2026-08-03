/* ═══════════════════════════════════════════════════════════
   RADIADORES BRASNAL — ARQUIVO DE CONFIGURAÇÃO
   ───────────────────────────────────────────────────────────
   Este é o ÚNICO arquivo que precisa ser editado no dia a dia.
   Alterou aqui, salvou, subiu: o site inteiro se atualiza.
   ═══════════════════════════════════════════════════════════ */

window.BRASNAL = {

  /* ── WhatsApp ──────────────────────────────────────────────
     Formato: DDI + DDD + número, só dígitos, sem espaço.
     Se ficar vazio (''), o site continua funcionando: todos os
     botões de WhatsApp viram "Ligar" automaticamente.          */
  whatsapp: '5511999446050',
  whatsappExibicao: '(11) 99944-6050',

  /* ── Telefone fixo da oficina ───────────────────────────── */
  telefone: '(11) 4701-3185',
  telefoneLink: '+551147013185',

  /* ── E-mail ─────────────────────────────────────────────── */
  email: 'radiadoresbrasnal@hotmail.com',

  /* ── Horário de funcionamento ────────────────────────────
     0 = domingo ... 6 = sábado. null = fechado.
     Usado no selo "Aberto agora / Fechado" do topo do site.   */
  horarios: {
    0: null,
    1: { abre: '08:00', fecha: '17:00' },
    2: { abre: '08:00', fecha: '17:00' },
    3: { abre: '08:00', fecha: '17:00' },
    4: { abre: '08:00', fecha: '17:00' },
    5: { abre: '08:00', fecha: '17:00' },
    6: { abre: '08:00', fecha: '12:00', obs: 'com agendamento' }
  },

  /* ── Mensagem que já vai escrita ao abrir o WhatsApp ─────── */
  mensagemPadrao: 'Olá! Vim pelo site da Radiadores Brasnal e gostaria de um orçamento.'
};
