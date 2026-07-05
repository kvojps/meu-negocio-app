import { HelpIcon } from '@components/Icons';
import { PageHeader } from '@components/PageHeader';
import { ExpandMore } from '@mui/icons-material';
import {
  Dashboard as DashboardModuleIcon,
  Edit,
  InfoOutlined,
  Inventory2,
  SettingsOutlined,
  ShoppingCartOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface ModuleCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function ModuleCard({ icon, title, children }: ModuleCardProps) {
  return (
    <Card variant="outlined" sx={{ flex: '1 1 260px' }}>
      <CardContent>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box sx={{ color: 'primary.main', display: 'flex', mt: 0.25 }}>
            {icon}
          </Box>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2">{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {children}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function GuideSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
      sx={{ mb: 1.5 }}
    >
      <InfoOutlined sx={{ color: 'primary.main', fontSize: 18, mt: 0.25 }} />
      <Typography variant="body2" color="text.secondary">
        {children}
      </Typography>
    </Stack>
  );
}

export function HelpPage() {
  const [openSection, setOpenSection] = useState<string | null>('Visão Geral');

  function toggleSection(title: string) {
    setOpenSection((prev) => (prev === title ? null : title));
  }

  function accordionProps(title: string) {
    return {
      expanded: openSection === title,
      onChange: () => toggleSection(title),
    };
  }

  return (
    <Stack spacing={2}>
      <PageHeader
        icon={<HelpIcon />}
        title="Ajuda"
        subtitle="Tire dúvidas e aprenda a usar o Meu Negócio"
      />

      <Accordion {...accordionProps('Visão Geral')}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Visão Geral</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 2 }}>
            O <strong>Meu Negócio</strong> é um sistema de gestão para pequenos
            negócios. Cada seção do aplicativo foi pensada para ajudar no dia a
            dia da sua empresa:
          </Typography>

          <Stack direction="row" flexWrap="wrap" useFlexGap gap={2}>
            <ModuleCard
              icon={<DashboardModuleIcon fontSize="small" />}
              title="Dashboard"
            >
              Visão geral do negócio com indicadores de faturamento, vendas do
              mês, pedidos pendentes e alertas de estoque.
            </ModuleCard>
            <ModuleCard icon={<Inventory2 fontSize="small" />} title="Produtos">
              Cadastro completo do catálogo: nome, descrição, categoria,
              fornecedor, preços e controle de estoque.
            </ModuleCard>
            <ModuleCard
              icon={<ShoppingCartOutlined fontSize="small" />}
              title="Pedidos"
            >
              Registro e acompanhamento de pedidos com fluxo de status:
              Pendente, Em andamento, Concluído ou Cancelado.
            </ModuleCard>
            <ModuleCard icon={<Edit fontSize="small" />} title="Vendas">
              Consulta de pedidos concluídos com indicadores de desempenho:
              faturamento total, ticket médio e produto mais vendido.
            </ModuleCard>
            <ModuleCard
              icon={<SettingsOutlined fontSize="small" />}
              title="Configurações"
            >
              Dados da sua empresa (nome, CNPJ, telefone, endereço) e
              informações do aplicativo.
            </ModuleCard>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion {...accordionProps('Guias Rápidos')}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Guias Rápidos</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <GuideSection title="Como cadastrar um produto">
            <Typography component="ol" variant="body2" sx={{ pl: 2.5, m: 0 }}>
              <li>
                Acesse a seção <strong>Produtos</strong> no menu lateral.
              </li>
              <li>
                Clique no botão <strong>Novo Produto</strong> no canto superior
                direito.
              </li>
              <li>
                Preencha os campos: nome, descrição, categoria, fornecedor,
                preço de custo, preço de venda, estoque atual e estoque mínimo.
              </li>
              <li>
                Clique em <strong>Criar</strong> para salvar.
              </li>
            </Typography>
          </GuideSection>

          <GuideSection title="Como criar um pedido">
            <Typography component="ol" variant="body2" sx={{ pl: 2.5, m: 0 }}>
              <li>
                Acesse a seção <strong>Pedidos</strong> no menu lateral.
              </li>
              <li>
                Clique em <strong>Novo Pedido</strong>.
              </li>
              <li>Informe o nome do cliente.</li>
              <li>
                Adicione os itens selecionando produtos do catálogo e definindo
                as quantidades.
              </li>
              <li>
                O total é calculado automaticamente. Você pode marcá-lo
                manualmente se necessário.
              </li>
              <li>
                Clique em <strong>Criar</strong> para registrar o pedido como
                &quot;Pendente&quot;.
              </li>
            </Typography>
          </GuideSection>

          <GuideSection title="Fluxo de pedidos">
            <Typography variant="body2" sx={{ mb: 1.5 }}>
              Cada pedido segue um fluxo de status. Você pode avançá-lo clicando
              no status atual e selecionando o próximo:
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Typography
                variant="body2"
                sx={{
                  px: 1.5,
                  py: 0.5,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                }}
              >
                Pendente
              </Typography>
              <Typography color="text.secondary">&rarr;</Typography>
              <Typography
                variant="body2"
                sx={{
                  px: 1.5,
                  py: 0.5,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                }}
              >
                Em andamento
              </Typography>
              <Typography color="text.secondary">&rarr;</Typography>
              <Typography
                variant="body2"
                sx={{
                  px: 1.5,
                  py: 0.5,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                }}
              >
                Concluído
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Pedidos também podem ser <strong>cancelados</strong> a qualquer
              momento. Ao concluir um pedido, o estoque dos produtos é baixado
              automaticamente.
            </Typography>
          </GuideSection>

          <GuideSection title="Como configurar a empresa">
            <Typography component="ol" variant="body2" sx={{ pl: 2.5, m: 0 }}>
              <li>
                Acesse a seção <strong>Configurações</strong> no menu lateral.
              </li>
              <li>
                Preencha os campos: nome da empresa, CNPJ, telefone e endereço.
              </li>
              <li>
                Clique em <strong>Salvar</strong> no final da página.
              </li>
              <li>Os dados ficam salvos mesmo após fechar o aplicativo.</li>
            </Typography>
          </GuideSection>
        </AccordionDetails>
      </Accordion>

      <Accordion {...accordionProps('Perguntas Frequentes')}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Perguntas Frequentes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2">
                Os dados são salvos automaticamente?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sim. Todas as informações (produtos, pedidos, configurações) são
                salvas automaticamente na memória do navegador. Não é necessário
                clicar em um botão "Salvar" para cada ação.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">
                Como editar um produto ou pedido?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Na listagem, clique no ícone de três pontos (
                <strong>...</strong>) ao lado do item desejado e selecione{' '}
                <strong>Editar</strong>. As alterações são salvas ao confirmar.
                Pedidos só podem ser editados enquanto estiverem com status
                "Pendente".
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">
                Como cancelar um pedido?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Na página de Pedidos, clique no status atual do pedido (ex:
                "Pendente") e selecione a opção <strong>Cancelar</strong> no
                menu suspenso. Confirme a ação na janela que aparece.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">
                O que significa "estoque crítico"?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Um produto está com estoque crítico quando sua quantidade em
                estoque é igual ou inferior ao <strong>estoque mínimo</strong>{' '}
                definido no cadastro do produto. Esses produtos aparecem com um
                ícone de alerta na listagem e no Dashboard.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">
                Posso excluir um produto?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sim. Clique no ícone de três pontos (<strong>...</strong>) ao
                lado do produto e selecione <strong>Excluir</strong>. Uma
                confirmação será exibida antes da exclusão. A ação não pode ser
                desfeita.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">
                O sistema funciona sem internet?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sim. O Meu Negócio é um aplicativo de desktop que funciona
                completamente offline. Todos os dados ficam armazenados no seu
                computador.
              </Typography>
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion {...accordionProps('Dicas e Boas Práticas')}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Dicas e Boas Práticas</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Tip>
            Mantenha o cadastro de produtos sempre atualizado com preços e
            estoques corretos.
          </Tip>
          <Tip>
            Defina estoques mínimos realistas para receber alertas antes de
            faltar um produto.
          </Tip>
          <Tip>
            Use categorias para organizar os produtos e facilitar a busca.
          </Tip>
          <Tip>
            Avance o status dos pedidos conforme eles progridem para manter o
            controle do fluxo.
          </Tip>
          <Tip>
            Consulte o Dashboard regularmente para acompanhar a saúde do seu
            negócio.
          </Tip>
        </AccordionDetails>
      </Accordion>

      <Accordion {...accordionProps('Suporte')}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Suporte</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Card
            variant="outlined"
            sx={{
              mb: 2,
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <WarningAmberOutlined />
                <Box>
                  <Typography variant="subtitle2">
                    Projeto em desenvolvimento
                  </Typography>
                  <Typography variant="body2">
                    Esta é uma versão de protótipo do Meu Negócio. Os dados são
                    armazenados localmente (no seu computador) e não há
                    sincronização com servidores ou backup externo.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Typography variant="body2" sx={{ mb: 2 }}>
            Para reportar problemas, sugerir melhorias ou contribuir com o
            projeto, abra uma issue no repositório oficial.
          </Typography>

          <Stack spacing={1}>
            <Stack direction="row" spacing={2}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ width: 120 }}
              >
                Aplicativo
              </Typography>
              <Typography variant="body2">Meu Negócio</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ width: 120 }}
              >
                Versão
              </Typography>
              <Typography variant="body2">1.0.0</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ width: 120 }}
              >
                Finalidade
              </Typography>
              <Typography variant="body2">
                Gerenciamento de vendas, produtos e pedidos para pequenos
                negócios
              </Typography>
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
