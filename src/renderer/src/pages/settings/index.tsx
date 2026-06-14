import './styles.css';
import { useSettings } from '../../hooks/settings/useSettings';

const APP_VERSION = '1.0.0';

export function SettingsPage() {
  const { settings, updateField, persist, saved } = useSettings();

  return (
    <div className="settings">
      <div className="settings-header">
        <h1 className="page-title">Configurações</h1>
      </div>

      <div className="settings-section">
        <h2>Dados da Empresa</h2>

        <div className="settings-form">
          <div className="settings-field settings-field--full">
            <label className="settings-field-label">Nome da Empresa</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Ex: Minha Empresa Ltda"
            />
          </div>

          <div className="settings-field">
            <label className="settings-field-label">CNPJ</label>
            <input
              type="text"
              value={settings.cnpj}
              onChange={(e) => updateField('cnpj', e.target.value)}
              placeholder="00.000.000/0000-00"
            />
          </div>

          <div className="settings-field">
            <label className="settings-field-label">Telefone</label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="settings-field settings-field--full">
            <label className="settings-field-label">Endereço</label>
            <textarea
              value={settings.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Rua, número, bairro, cidade, estado"
            />
          </div>

          <div className="settings-field settings-field--full settings-field-actions">
            <button
              className="settings-save-btn"
              onClick={persist}
              type="button"
            >
              Salvar
            </button>
            {saved && <span className="settings-save-feedback">Salvo!</span>}
          </div>
        </div>
      </div>

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
