/* ═══════════════════════════════════════════════════════════
   RADIADORES BRASNAL — comportamento do site
   Sem dependências externas. Vanilla JS.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CFG = window.BRASNAL || {};
  var TEL_HREF = 'tel:' + (CFG.telefoneLink || '+551147013185');
  var WA = (CFG.whatsapp || '').replace(/\D/g, '');
  var TEM_WA = WA.length >= 12;

  function $(s, ctx) { return (ctx || document).querySelector(s); }
  function $$(s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); }

  /** Monta o link do WhatsApp, ou cai para telefone se não houver número configurado. */
  function linkContato(texto) {
    if (!TEM_WA) return TEL_HREF;
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(texto || CFG.mensagemPadrao || '');
  }

  /* ── 1. Resolve todos os CTAs ──────────────────────────── */
  function ligarCtas() {
    $$('[data-cta="tel"]').forEach(function (el) { el.setAttribute('href', TEL_HREF); });

    $$('[data-cta="whats"]').forEach(function (el) {
      if (TEM_WA) {
        el.setAttribute('href', linkContato());
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      }
      // Sem WhatsApp configurado: o link continua indo para #orcamento,
      // onde o formulário oferece envio por e-mail. O botão flutuante liga.
    });

    var float = $('#floatCta');
    if (float && !TEM_WA) {
      float.setAttribute('href', TEL_HREF);
      var lbl = float.querySelector('span');
      if (lbl) lbl.textContent = CFG.telefone || 'Ligar agora';
    }

    var sendLabel = $('[data-send-label]');
    if (sendLabel && !TEM_WA) sendLabel.textContent = 'Enviar orçamento';
  }

  /* ── 2. Header sticky + menu mobile ────────────────────── */
  function header() {
    var hd = $('#hd'), burger = $('#burger'), nav = $('#nav');

    // Ancora o menu mobile exatamente abaixo do header, que muda de
    // posição conforme a topbar sai da tela.
    var ancorarNav = function () {
      var base = Math.max(0, Math.round(hd.getBoundingClientRect().bottom));
      document.documentElement.style.setProperty('--nav-top', base + 'px');
    };

    var onScroll = function () {
      hd.classList.toggle('is-stuck', window.scrollY > 10);
      var f = $('#floatCta');
      if (f) f.classList.toggle('is-vis', window.scrollY > 520);
      ancorarNav();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', ancorarNav);
    onScroll();

    if (!burger || !nav) return;
    burger.addEventListener('click', function () {
      ancorarNav();
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  /* ── 3. Reveal on scroll ───────────────────────────────── */
  function reveal() {
    var itens = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      itens.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('is-in'); }, Math.min(i * 70, 350));
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    itens.forEach(function (el) { io.observe(el); });
  }

  /* ── 4. Contadores animados ────────────────────────────── */
  function contadores() {
    var alvos = $$('.count:not([data-plain])');
    if (!alvos.length || !('IntersectionObserver' in window)) return;
    var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, fim = parseInt(el.dataset.to, 10) || 0;
        io.unobserve(el);
        if (reduz) { el.textContent = fim; return; }
        var t0 = performance.now(), dur = 1400;
        (function step(now) {
          var p = Math.min((now - t0) / dur, 1);
          el.textContent = Math.round(fim * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.5 });
    alvos.forEach(function (el) { io.observe(el); });
  }

  /* ── 5. Aberto agora / fechado ─────────────────────────── */
  function statusHorario() {
    var box = $('#statusHorario');
    if (!box || !CFG.horarios) return;
    var dot = box.querySelector('.dot'), txt = box.querySelector('[data-status-text]');
    if (!dot || !txt) return;

    var agora = new Date();
    var hoje = CFG.horarios[agora.getDay()];
    var min = agora.getHours() * 60 + agora.getMinutes();

    function toMin(hhmm) { var p = hhmm.split(':'); return (+p[0]) * 60 + (+p[1]); }

    if (hoje && min >= toMin(hoje.abre) && min < toMin(hoje.fecha)) {
      dot.classList.remove('is-closed');
      txt.textContent = 'Aberto agora · até ' + hoje.fecha.replace(':', 'h');
    } else {
      dot.classList.add('is-closed');
      // procura o próximo dia com atendimento
      for (var i = (hoje && min < toMin(hoje.abre)) ? 0 : 1; i <= 7; i++) {
        var d = CFG.horarios[(agora.getDay() + i) % 7];
        if (!d) continue;
        var nomes = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
        var quando = i === 0 ? 'hoje' : (i === 1 ? 'amanhã' : nomes[(agora.getDay() + i) % 7]);
        txt.textContent = 'Fechado · abre ' + quando + ' às ' + d.abre.replace(':', 'h');
        return;
      }
      txt.textContent = 'Seg a Sex 08h–18h';
    }
  }

  /* ── 6. Formulário de orçamento ────────────────────────── */
  function formulario() {
    var form = $('#formOrcamento');
    if (!form) return;
    var msg = $('#formMsg');
    var btnEmail = $('#enviarEmail');

    function aviso(texto, erro) {
      if (!msg) return;
      msg.textContent = texto;
      msg.classList.toggle('is-err', !!erro);
    }

    function valida() {
      var ok = true;
      ['nome', 'telefone'].forEach(function (n) {
        var c = form.elements[n];
        var vazio = !c.value.trim();
        c.classList.toggle('is-err', vazio);
        if (vazio) ok = false;
      });
      if (!ok) aviso('Preencha seu nome e telefone para continuarmos.', true);
      return ok;
    }

    function montarTexto() {
      var d = form.elements;
      var L = [];
      L.push('*Pedido de orçamento — site Radiadores Brasnal*');
      L.push('');
      L.push('Nome: ' + d.nome.value.trim());
      L.push('Telefone: ' + d.telefone.value.trim());
      if (d.veiculo.value.trim()) L.push('Veículo: ' + d.veiculo.value.trim());
      L.push('Serviço: ' + d.servico.value);
      if (d.mensagem.value.trim()) { L.push(''); L.push('Descrição: ' + d.mensagem.value.trim()); }
      return L.join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!valida()) return;
      var texto = montarTexto();

      if (TEM_WA) {
        window.open(linkContato(texto), '_blank', 'noopener');
        aviso('Abrimos o WhatsApp com seu pedido pronto. É só enviar!');
      } else {
        window.location.href = 'mailto:' + (CFG.email || '') +
          '?subject=' + encodeURIComponent('Orçamento pelo site — ' + form.elements.nome.value.trim()) +
          '&body=' + encodeURIComponent(texto.replace(/\*/g, ''));
        aviso('Abrimos seu e-mail com o pedido pronto. Prefere falar agora? Ligue ' + (CFG.telefone || ''));
      }
    });

    if (btnEmail) {
      btnEmail.addEventListener('click', function () {
        if (!valida()) return;
        window.location.href = 'mailto:' + (CFG.email || '') +
          '?subject=' + encodeURIComponent('Orçamento pelo site — ' + form.elements.nome.value.trim()) +
          '&body=' + encodeURIComponent(montarTexto().replace(/\*/g, ''));
        aviso('Abrimos seu programa de e-mail com o pedido preenchido.');
      });
    }

    // limpa o estado de erro ao digitar
    form.addEventListener('input', function (e) {
      if (e.target.classList) e.target.classList.remove('is-err');
    });
  }

  /* ── 7. FAQ: abre um, fecha os outros ──────────────────── */
  function faq() {
    var itens = $$('.faq details');
    itens.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        itens.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  }

  /* ── 8. Ano no rodapé ──────────────────────────────────── */
  function ano() {
    var el = $('#ano');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── Boot ──────────────────────────────────────────────── */
  function init() {
    ligarCtas(); header(); reveal(); contadores();
    statusHorario(); formulario(); faq(); ano();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
