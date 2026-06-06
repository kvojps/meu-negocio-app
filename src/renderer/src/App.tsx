import { Sidebar } from './components/sidebar/Index';

export function App() {
  const appInfo = window.appInfo;

  return (
    <div className="app">
      <Sidebar />
      <main></main>
    </div>
  );
}
