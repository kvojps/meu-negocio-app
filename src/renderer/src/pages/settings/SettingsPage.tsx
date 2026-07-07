import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DownloadIcon, SettingIcon, UploadIcon } from '@/components/Icons';
import { PageHeader } from '@/components/PageHeader';
import { useDataTransfer } from '@/hooks/settings/useDataTransfer';

const APP_VERSION = '1.0.0';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 120, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}

export function SettingsPage() {
  const {
    exporting,
    importing,
    confirmOpen,
    handleExport,
    requestImport,
    cancelImport,
    confirmImport,
  } = useDataTransfer();

  return (
    <Stack spacing={2}>
      <PageHeader
        icon={<SettingIcon />}
        title="Configurações"
        subtitle="Informações do aplicativo"
      />

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Sobre
          </Typography>
          <Stack spacing={1}>
            <InfoRow label="Aplicativo" value="Meu Negócio" />
            <InfoRow label="Versão" value={APP_VERSION} />
            <InfoRow
              label="Finalidade"
              value="Gerenciamento de vendas, produtos e pedidos para pequenos negócios"
            />
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Exportar e Importar Dados
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Exporte todos os produtos e pedidos para um arquivo de backup, ou importe um arquivo
            existente para restaurar os dados.
          </Typography>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon size={16} />}
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? 'Exportando...' : 'Exportar Dados'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<UploadIcon size={16} />}
              onClick={requestImport}
              disabled={importing}
            >
              {importing ? 'Importando...' : 'Importar Dados'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Importar dados"
        onConfirm={confirmImport}
        onCancel={cancelImport}
        confirmLabel="Importar"
        danger
      >
        Importar um arquivo de backup substituirá todos os produtos e pedidos atuais. Essa ação não
        pode ser desfeita. Deseja continuar?
      </ConfirmDialog>
    </Stack>
  );
}
