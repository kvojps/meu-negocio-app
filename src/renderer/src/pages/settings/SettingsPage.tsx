import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DownloadIcon, SettingIcon, UploadIcon } from '@/components/Icons';
import { PageHeader } from '@/components/PageHeader';
import { useDataTransfer } from '@/hooks/settings/useDataTransfer';

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
