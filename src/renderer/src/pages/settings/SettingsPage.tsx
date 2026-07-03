import { ConfirmDialog } from '@components/ConfirmDialog';
import { DownloadIcon, SettingIcon, UploadIcon } from '@components/Icons';
import { PageHeader } from '@components/PageHeader';
import { useDataTransfer } from '@hooks/settings/useDataTransfer';
import './styles.css';

const APP_VERSION = '1.0.0';

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
    <div className="settings">
      <PageHeader
        icon={<SettingIcon />}
        title="Configurações"
        subtitle="Informações do aplicativo"
      />

      <div className="settings-section">
        <h2>Sobre</h2>

        <div className="settings-about-info">
          <div className="settings-about-row">
            <span className="settings-about-label">Aplicativo</span>
            <span className="settings-about-value">Meu Negócio</span>
          </div>
          <div className="settings-about-row">
            <span className="settings-about-label">Versão</span>
            <span className="settings-about-value">{APP_VERSION}</span>
          </div>
          <div className="settings-about-row">
            <span className="settings-about-label">Finalidade</span>
            <span className="settings-about-value">
              Gerenciamento de vendas, produtos e pedidos para pequenos negócios
            </span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>Exportar e Importar Dados</h2>

        <p className="settings-data-hint">
          Exporte todos os produtos e pedidos para um arquivo de backup, ou
          importe um arquivo existente para restaurar os dados.
        </p>

        <div className="settings-data-actions">
          <button
            className="settings-btn settings-btn--primary"
            onClick={handleExport}
            disabled={exporting}
            type="button"
          >
            <DownloadIcon size={16} />
            {exporting ? 'Exportando...' : 'Exportar Dados'}
          </button>

          <button
            className="settings-btn settings-btn--secondary"
            onClick={requestImport}
            disabled={importing}
            type="button"
          >
            <UploadIcon size={16} />
            {importing ? 'Importando...' : 'Importar Dados'}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Importar dados"
        onConfirm={confirmImport}
        onCancel={cancelImport}
        confirmLabel="Importar"
        danger
      >
        Importar um arquivo de backup substituirá todos os produtos e pedidos
        atuais. Essa ação não pode ser desfeita. Deseja continuar?
      </ConfirmDialog>
    </div>
  );
}
