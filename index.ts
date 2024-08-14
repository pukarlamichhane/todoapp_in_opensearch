import './index.scss';

import { TodoappPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin() {
  return new TodoappPlugin();
}
export { TodoappPluginSetup, TodoappPluginStart } from './types';
