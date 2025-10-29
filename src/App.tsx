/**
 * Simple LinkTree App component
 */

import React from 'react';
import { Layout } from './components/Layout';
import { Profile } from './components/Profile';
import { LinkButton } from './components/LinkButton';
import { ThemeProvider } from './components/ThemeProvider';
import { loadConfig } from './utils/config-loader';
import type { LinkTreeConfig } from './types/config';

function App() {
  const [config, setConfig] = React.useState<LinkTreeConfig | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadConfig().then(data => {
      setConfig(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  if (loading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="loading-spinner mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Layout config={config}>
        <div className="w-full max-w-md mx-auto space-y-8">
          <Profile profile={config.profile} />
          <div className="links-container space-y-4">
            {config.links.map((link, index) => (
              <LinkButton
                key={index}
                link={link}
                theme={config.theme}
              />
            ))}
          </div>
        </div>
      </Layout>
    </ThemeProvider>
  );
}

export default App;