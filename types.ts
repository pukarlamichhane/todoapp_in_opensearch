import { NavigationPublicPluginStart } from '......srcplugins\navigationpublic';

export interface TodoappPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TodoappPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
