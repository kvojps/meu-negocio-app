import { useRef, useState } from "react";
import type { BackupData } from "../../../shared/models/backup";

type ExportStatus =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; path: string }
  | { type: "error"; message: string };

type ImportStatus =
  | { type: "idle" }
  | { type: "confirm"; data: BackupData; filename: string }
  | { type: "loading" }
  | { type: "error"; message: string };

export function SettingsPage() {
  const [exportStatus, setExportStatus] = useState<ExportStatus>({
    type: "idle",
  });
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    type: "idle",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Export ── */
  async function handleExport() {
    setExportStatus({ type: "loading" });
    try {
      const res = await window.api.exportData();
      if (res.success) {
        setExportStatus({ type: "success", path: res.data.path });
      } else {
        setExportStatus({ type: "error", message: res.error.message });
      }
    } catch (err) {
      setExportStatus({ type: "error", message: String(err) });
    }
  }

  /* ── Import file picker ── */
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as BackupData;
        if (!data || data.version !== 1) {
          setImportStatus({
            type: "error",
            message: "Arquivo inválido ou incompatível com esta versão do app.",
          });
          return;
        }
        setImportStatus({ type: "confirm", data, filename: file.name });
      } catch {
        setImportStatus({
          type: "error",
          message: "Não foi possível ler o arquivo JSON.",
        });
      }
    };
    reader.readAsText(file);

    // reseta o input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /* ── Import confirm ── */
  async function handleImportConfirm() {
    if (importStatus.type !== "confirm") return;
    const { data } = importStatus;
    setImportStatus({ type: "loading" });
    try {
      const res = await window.api.importData({ data });
      if (res.success) {
        // Recarrega o renderer para que os hooks busquem os dados novos do banco
        window.location.reload();
      } else {
        setImportStatus({ type: "error", message: res.error.message });
      }
    } catch (err) {
      setImportStatus({ type: "error", message: String(err) });
    }
  }

  function handleImportCancel() {
    setImportStatus({ type: "idle" });
  }

  /* ── Render ── */
  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Configurações</h1>
        <p className="settings-subtitle">Gerencie o backup dos seus dados</p>
      </header>

      <div className="settings-cards">
        {/* ── Export Card ── */}
        <section className="settings-card">
          <div className="settings-card-icon settings-card-icon--export">
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm3.293-7.707a1 1 0 0 1 1.414 0L9 10.586V3a1 1 0 1 1 2 0v7.586l1.293-1.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414Z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="settings-card-body">
            <h2 className="settings-card-title">Exportar Dados</h2>
            <p className="settings-card-desc">
              Salva todos os seus produtos, vendas e itens em um arquivo{" "}
              <code>.json</code>. Guarde-o em um lugar seguro para usar como
              backup.
            </p>

            <button
              id="btn-export"
              className="settings-btn settings-btn--primary"
              onClick={() => void handleExport()}
              disabled={exportStatus.type === "loading"}
            >
              {exportStatus.type === "loading"
                ? "Exportando…"
                : "Exportar Backup"}
            </button>

            {exportStatus.type === "success" && (
              <div className="settings-feedback settings-feedback--success">
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Backup salvo em: <strong>{exportStatus.path}</strong>
                </span>
              </div>
            )}

            {exportStatus.type === "error" && (
              <div className="settings-feedback settings-feedback--error">
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{exportStatus.message}</span>
              </div>
            )}
          </div>
        </section>

        {/* ── Import Card ── */}
        <section className="settings-card">
          <div className="settings-card-icon settings-card-icon--import">
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM6.707 6.293a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.414L11 4.414V13a1 1 0 1 1-2 0V4.414L7.121 6.293a1 1 0 0 1-1.414 0Z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="settings-card-body">
            <h2 className="settings-card-title">Importar Dados</h2>
            <p className="settings-card-desc">
              Restaura dados a partir de um backup exportado anteriormente.{" "}
              <strong>Atenção:</strong> os dados atuais serão substituídos.
            </p>

            <input
              ref={fileInputRef}
              id="input-import-file"
              type="file"
              accept=".json"
              className="settings-file-input"
              onChange={handleFileChange}
              disabled={
                importStatus.type === "loading" ||
                importStatus.type === "confirm"
              }
            />
            <label
              htmlFor="input-import-file"
              className={`settings-btn settings-btn--secondary ${
                importStatus.type === "loading" ||
                importStatus.type === "confirm"
                  ? "settings-btn--disabled"
                  : ""
              }`}
            >
              Selecionar arquivo…
            </label>

            {/* Modal de confirmação */}
            {importStatus.type === "confirm" && (
              <div className="settings-confirm">
                <div className="settings-confirm-icon">⚠️</div>
                <p className="settings-confirm-text">
                  Você está prestes a importar{" "}
                  <strong>{importStatus.filename}</strong>. Todos os dados
                  atuais serão apagados e substituídos. Deseja continuar?
                </p>
                <div className="settings-confirm-actions">
                  <button
                    id="btn-import-cancel"
                    className="settings-btn settings-btn--ghost"
                    onClick={handleImportCancel}
                  >
                    Cancelar
                  </button>
                  <button
                    id="btn-import-confirm"
                    className="settings-btn settings-btn--danger"
                    onClick={() => void handleImportConfirm()}
                  >
                    Sim, importar
                  </button>
                </div>
              </div>
            )}

            {importStatus.type === "loading" && (
              <p className="settings-loading">
                Importando dados… O app será recarregado automaticamente.
              </p>
            )}

            {importStatus.type === "error" && (
              <div className="settings-feedback settings-feedback--error">
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{importStatus.message}</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
