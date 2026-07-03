import { ConfirmDialog } from '@components/ConfirmDialog';
import { FormField } from '@components/FormField';
import { Input } from '@components/FormField/Input';
import { Textarea } from '@components/FormField/Textarea';
import {
  CheckIcon,
  DownloadIcon,
  SettingIcon,
  UploadIcon,
} from '@components/Icons';
import { PageHeader } from '@components/PageHeader';
import { useDataTransfer } from '@hooks/settings/useDataTransfer';
import { useSettings } from '@hooks/settings/useSettings';
import './styles.css';

const APP_VERSION = '1.0.0';

export function SettingsPage() {
  const { settings, updateField, persist, saved } = useSettings();
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
        subtitle="Dados da empresa e informações do aplicativo"
      />

      <div className="settings-section">
        <h2>Dados da Empresa</h2>

        <div className="settings-form">
          <div className="settings-field--full">
            <FormField label="Nome da Empresa">
              <Input
                type="text"
                value={settings.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ex: Minha Empresa Ltda"
              />
            </FormField>
          </div>

          <FormField label="CNPJ">
            <Input
              type="text"
              value={settings.cnpj}
              onChange={(e) => updateField('cnpj', e.target.value)}
              placeholder="00.000.000/0000-00"
            />
          </FormField>

          <FormField label="Telefone">
            <Input
              type="text"
              value={settings.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </FormField>

          <div className="settings-field--full">
            <FormField label="Endereço">
              <Textarea
                rows={3}
                value={settings.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Rua, número, bairro, cidade, estado"
              />
            </FormField>
          </div>

          <div className="settings-field--full settings-field-actions">
            <button
              className="settings-save-btn"
              onClick={persist}
              type="button"
            >
              Salvar
            </button>
            <span
              className={`settings-save-feedback ${saved ? 'settings-save-feedback--visible' : ''}`}
            >
              <CheckIcon size={14} />
              Salvo!
            </span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>Exportar e Importar Dados</h2>

        <p className="settings-data-hint">
          Exporte todos os produtos, pedidos e dados da empresa para um arquivo
          de backup, ou importe um arquivo existente para restaurar os dados.
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
        Importar um arquivo de backup substituirá todos os produtos, pedidos e
        dados da empresa atuais. Essa ação não pode ser desfeita. Deseja
        continuar?
      </ConfirmDialog>

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
    </div>
  );
}
