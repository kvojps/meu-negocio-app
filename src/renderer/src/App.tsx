import { Sidebar } from './components/sidebar/Index';

export function App() {
  const appInfo = window.appInfo;

  return (
    <div className="app">
      <Sidebar />
      <main>
        <h1>Meu Negócio App</h1>
      </main>
    </div>
  );
}
