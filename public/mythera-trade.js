/* Community WhatsApp invitation, visible only in the Mythera context. */
(()=>{'use strict';
const invite='https://chat.whatsapp.com/JJlMfV35vr9BMMefMkmVAJ';
const symbol='<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M27 15a11 11 0 0 1-16 10L5 27l2-6A11 11 0 1 1 27 15Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9c-.8-.4-2 1.4-2 2.5 0 4.3 6 10 10 10 1.2 0 3-1.7 2.5-2.4l-3-1.5c-.5-.2-1.3 1.2-1.8 1-2.2-.8-4.2-2.8-5-5-.2-.6 1.3-1.2 1-1.8L12 9Z" fill="currentColor"/></svg>';
function markup(size='full'){
 if(!window.ServerContext?.isMythera)return '';
 const compact=size==='compact';
 return `<section class="mythera-trade ${compact?'mythera-trade-compact':''}" data-mythera-trade aria-label="Grupo de trade do Mythera"><span class="mythera-trade-symbol">${symbol}</span><div class="mythera-trade-copy"><p class="eyebrow">TIBIA COMMAND · COMUNIDADE MYTHERA</p><h2>${compact?'Trade Mythera no WhatsApp':'Seu próximo trade começa aqui.'}</h2><p>${compact?'Prefere conversar com outros jogadores? Entre no nosso grupo de compra, venda e troca de itens.':'Um ponto de encontro para comprar, vender e trocar itens com outros jogadores do Mythera.'}</p>${compact?'':'<ul class="mythera-trade-tags" aria-label="Negociações de itens"><li>Comprar</li><li>Vender</li><li>Trocar</li></ul>'}<small>Grupo independente da comunidade Tibia Command. As negociações são feitas entre jogadores.</small></div><div class="mythera-trade-actions"><a class="mythera-trade-join" href="${invite}" target="_blank" rel="noopener noreferrer" aria-label="Entrar no grupo de trade do Mythera no WhatsApp (abre em nova aba)">${symbol}<span>Entrar no grupo</span><span aria-hidden="true">↗</span></a><span>Trade Mythera · WhatsApp</span></div></section>`;
}
function mountHome(root){if(!window.ServerContext?.isMythera||root.querySelector('[data-mythera-trade]'))return;const community=root.querySelector('.home-community');if(community)community.insertAdjacentHTML('afterend',markup());}
window.MytheraTrade={markup,mountHome};
})();
