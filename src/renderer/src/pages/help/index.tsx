import { useState } from 'react';
import './styles.css';

function AccordionSection({
  title,
  children,
  isOpen,
  onToggle
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`help-accordion${isOpen ? ' help-accordion--open' : ''}`}>
      <button className="help-accordion-summary" onClick={onToggle} type="button">
        {title}
      </button>
      {isOpen && <div className="help-accordion-content">{children}</div>}
    </div>
  );
}

export function HelpPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  function toggleSection(title: string) {
    setOpenSection((prev) => (prev === title ? null : title));
  }

  return (
    <div className="help">
      <h1 className="page-title">Ajuda</h1>
      <p className="help-subtitle">
        Tire dúvidas e aprenda a usar o Meu Negócio
      </p>

      <AccordionSection
        title="Visão Geral"
        isOpen={openSection === 'Visão Geral'}
        onToggle={() => toggleSection('Visão Geral')}
      >
        <p className="help-paragraph">
          O <strong>Meu Negócio</strong> é um sistema de gestão para pequenos
          negócios. Cada seção do aplicativo foi pensada para ajudar no dia a
          dia da sua empresa:
        </p>

        <div className="help-modules">
          <div className="help-module-card">
            <span className="help-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </span>
            <div>
              <strong>Dashboard</strong>
              <p>Visão geral do negócio com indicadores de faturamento, vendas do mês, pedidos pendentes e alertas de estoque.</p>
            </div>
          </div>
          <div className="help-module-card">
            <span className="help-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </span>
            <div>
              <strong>Produtos</strong>
              <p>Cadastro completo do catálogo: nome, descrição, categoria, fornecedor, preços e controle de estoque.</p>
            </div>
          </div>
          <div className="help-module-card">
            <span className="help-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </span>
            <div>
              <strong>Pedidos</strong>
              <p>Registro e acompanhamento de pedidos com fluxo de status: Pendente, Em andamento, Concluído ou Cancelado.</p>
            </div>
          </div>
          <div className="help-module-card">
            <span className="help-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </span>
            <div>
              <strong>Vendas</strong>
              <p>Consulta de pedidos concluídos com indicadores de desempenho: faturamento total, ticket médio e produto mais vendido.</p>
            </div>
          </div>
          <div className="help-module-card">
            <span className="help-module-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </span>
            <div>
              <strong>Configurações</strong>
              <p>Dados da sua empresa (nome, CNPJ, telefone, endereço) e informações do aplicativo.</p>
            </div>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Guias Rápidos"
        isOpen={openSection === 'Guias Rápidos'}
        onToggle={() => toggleSection('Guias Rápidos')}
      >
        <div className="help-guide">
          <h4 className="help-guide-title">Como cadastrar um produto</h4>
          <ol className="help-guide-steps">
            <li>Acesse a seção <strong>Produtos</strong> no menu lateral.</li>
            <li>Clique no botão <strong>Novo Produto</strong> no canto superior direito.</li>
            <li>Preencha os campos: nome, descrição, categoria, fornecedor, preço de custo, preço de venda, estoque atual e estoque mínimo.</li>
            <li>Clique em <strong>Criar</strong> para salvar.</li>
          </ol>
        </div>

        <div className="help-guide">
          <h4 className="help-guide-title">Como criar um pedido</h4>
          <ol className="help-guide-steps">
            <li>Acesse a seção <strong>Pedidos</strong> no menu lateral.</li>
            <li>Clique em <strong>Novo Pedido</strong>.</li>
            <li>Informe o nome do cliente.</li>
            <li>Adicione os itens selecionando produtos do catálogo e definindo as quantidades.</li>
            <li>O total é calculado automaticamente. Você pode marcá-lo manualmente se necessário.</li>
            <li>Clique em <strong>Criar</strong> para registrar o pedido como "Pendente".</li>
          </ol>
        </div>

        <div className="help-guide">
          <h4 className="help-guide-title">Fluxo de pedidos</h4>
          <p className="help-paragraph">
            Cada pedido segue um fluxo de status. Você pode avançá-lo clicando no
            status atual e selecionando o próximo:
          </p>
          <div className="help-flow">
            <span className="help-flow-step">Pendente</span>
            <span className="help-flow-arrow">&rarr;</span>
            <span className="help-flow-step">Em andamento</span>
            <span className="help-flow-arrow">&rarr;</span>
            <span className="help-flow-step">Concluído</span>
          </div>
          <p className="help-paragraph help-paragraph--small">
            Pedidos também podem ser <strong>cancelados</strong> a qualquer momento.
            Ao concluir um pedido, o estoque dos produtos é baixado automaticamente.
          </p>
        </div>

        <div className="help-guide">
          <h4 className="help-guide-title">Como configurar a empresa</h4>
          <ol className="help-guide-steps">
            <li>Acesse a seção <strong>Configurações</strong> no menu lateral.</li>
            <li>Preencha os campos: nome da empresa, CNPJ, telefone e endereço.</li>
            <li>Clique em <strong>Salvar</strong> no final da página.</li>
            <li>Os dados ficam salvos mesmo após fechar o aplicativo.</li>
          </ol>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Perguntas Frequentes"
        isOpen={openSection === 'Perguntas Frequentes'}
        onToggle={() => toggleSection('Perguntas Frequentes')}
      >
        <div className="help-faq">
          <div className="help-faq-item">
            <h4 className="help-faq-question">Os dados são salvos automaticamente?</h4>
            <p className="help-faq-answer">
              Sim. Todas as informações (produtos, pedidos, configurações) são
              salvas automaticamente na memória do navegador. Não é necessário
              clicar em um botão "Salvar" para cada ação.
            </p>
          </div>
          <div className="help-faq-item">
            <h4 className="help-faq-question">Como editar um produto ou pedido?</h4>
            <p className="help-faq-answer">
              Na listagem, clique no ícone de três pontos (<strong>...</strong>) ao
              lado do item desejado e selecione <strong>Editar</strong>. As
              alterações são salvas ao confirmar. Pedidos só podem ser editados
              enquanto estiverem com status "Pendente".
            </p>
          </div>
          <div className="help-faq-item">
            <h4 className="help-faq-question">Como cancelar um pedido?</h4>
            <p className="help-faq-answer">
              Na página de Pedidos, clique no status atual do pedido (ex:
              "Pendente") e selecione a opção <strong>Cancelar</strong> no menu
              suspenso. Confirme a ação na janela que aparece.
            </p>
          </div>
          <div className="help-faq-item">
            <h4 className="help-faq-question">O que significa "estoque crítico"?</h4>
            <p className="help-faq-answer">
              Um produto está com estoque crítico quando sua quantidade em estoque
              é igual ou inferior ao <strong>estoque mínimo</strong> definido no
              cadastro do produto. Esses produtos aparecem com um ícone de alerta
              na listagem e no Dashboard.
            </p>
          </div>
          <div className="help-faq-item">
            <h4 className="help-faq-question">Posso excluir um produto?</h4>
            <p className="help-faq-answer">
              Sim. Clique no ícone de três pontos (<strong>...</strong>) ao lado
              do produto e selecione <strong>Excluir</strong>. Uma confirmação
              será exibida antes da exclusão. A ação não pode ser desfeita.
            </p>
          </div>
          <div className="help-faq-item">
            <h4 className="help-faq-question">O sistema funciona sem internet?</h4>
            <p className="help-faq-answer">
              Sim. O Meu Negócio é um aplicativo de desktop que funciona
              completamente offline. Todos os dados ficam armazenados no seu
              computador.
            </p>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Dicas e Boas Práticas"
        isOpen={openSection === 'Dicas e Boas Práticas'}
        onToggle={() => toggleSection('Dicas e Boas Práticas')}
      >
        <div className="help-tips">
          <div className="help-tip">
            <span className="help-tip-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
            <p>Mantenha o cadastro de produtos sempre atualizado com preços e estoques corretos.</p>
          </div>
          <div className="help-tip">
            <span className="help-tip-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
            <p>Defina estoques mínimos realistas para receber alertas antes de faltar um produto.</p>
          </div>
          <div className="help-tip">
            <span className="help-tip-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
            <p>Use categorias para organizar os produtos e facilitar a busca.</p>
          </div>
          <div className="help-tip">
            <span className="help-tip-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
            <p>Avance o status dos pedidos conforme eles progridem para manter o controle do fluxo.</p>
          </div>
          <div className="help-tip">
            <span className="help-tip-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
            <p>Consulte o Dashboard regularmente para acompanhar a saúde do seu negócio.</p>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Suporte"
        isOpen={openSection === 'Suporte'}
        onToggle={() => toggleSection('Suporte')}
      >
        <div className="help-support">
          <div className="help-support-banner">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <div>
              <strong>Projeto em desenvolvimento</strong>
              <p>
                Esta é uma versão de protótipo do Meu Negócio. Os dados são
                armazenados localmente (no seu computador) e não há sincronização
                com servidores ou backup externo.
              </p>
            </div>
          </div>

          <p className="help-paragraph">
            Para reportar problemas, sugerir melhorias ou contribuir com o
            projeto, abra uma issue no repositório oficial.
          </p>

          <div className="help-about">
            <div className="help-about-row">
              <span className="help-about-label">Aplicativo</span>
              <span className="help-about-value">Meu Negócio</span>
            </div>
            <div className="help-about-row">
              <span className="help-about-label">Versão</span>
              <span className="help-about-value">1.0.0</span>
            </div>
            <div className="help-about-row">
              <span className="help-about-label">Finalidade</span>
              <span className="help-about-value">
                Gerenciamento de vendas, produtos e pedidos para pequenos negócios
              </span>
            </div>
          </div>
        </div>
      </AccordionSection>
    </div>
  );
}
