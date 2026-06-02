export function App() {
  const appInfo = window.appInfo;

  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Electron + React + TypeScript</p>
        <h1>Renderer pronto para começar</h1>
        <p className="description">
          Esta é a base mínima para evoluir sua interface com Vite e React
          dentro do Electron.
        </p>

        <div className="status-row">
          <span>Electron {appInfo?.electronVersion ?? "n/d"}</span>
          <span>Chrome {appInfo?.chromeVersion ?? "n/d"}</span>
        </div>
      </section>
    </main>
  );
}
