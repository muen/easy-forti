/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import WindowProvider from '../../components/window_provider';
import Container from './container';

const PACKAGE_PATH = path.join(__dirname, '../../package.json');

interface IRootState {
  activeTab: TabType;
  keys: {
    list: IKey[];
    isFetching: IsFetchingType;
  };
  logging: boolean;
  telemetry: boolean;
  theme: ThemeType;
  notificationPriority: PriorityType;
  notificationSounds: boolean;
  runAtStartup: boolean;
  hostUrl: string;
  update: {
    isFetching: IsFetchingType;
    info?: UpdateInfoType;
  };
}

class Root extends WindowProvider<{}, IRootState> {
  version: string;

  constructor(props: {}) {
    super(props);

    this.state = {
      activeTab: this.params.defaultTab || 'requests',
      keys: {
        list: [],
        isFetching: 'pending',
      },
      logging: false,
      telemetry: false,
      theme: 'system',
      update: {
        isFetching: 'pending',
      },
      notificationPriority: 'normal',
      notificationSounds: false,
      runAtStartup: true,
      hostUrl: 'https://imza.io/esig.hub',
    };

    this.version = Root.getVersion();
  }

  componentWillMount() {
    /**
     * Keys section.
     */
    // this.keysListGet();
    // ipcRenderer.on('ipc-2key-changed', this.keysListGet);

    /**
     * Logging section.
     */
    this.loggingGet();
    ipcRenderer.on('ipc-logging-status-changed', this.onLoggingChangedListener);

    /**
     * Telemetry section.
     */
    this.telemetryGet();
    ipcRenderer.on('ipc-telemetry-status-changed', this.onTelemetryChangedListener);

    /**
     * Theme section.
     */
    this.themeGet();
    ipcRenderer.on('ipc-theme-changed', this.onThemeChangedListener);

    /**
     * Notification section.
     */
    this.notificationPriorityGet();
    this.notificationSoundsGet();
    ipcRenderer.on('ipc-priority-changed', this.onNotificationPriorityChangedListener);
    ipcRenderer.on('ipc-sounds-changed', this.onNotificationSoundsChangedListener);
    /**
     * Application section.
     */
    this.startupGet();
    this.hostUrlGet();
    ipcRenderer.on('ipc-startup-changed', this.onRunAsStartupChangedListener);
    ipcRenderer.on('ipc-host-changed', this.onHostUrlChangedListener);
    /**
     * Update section.
     */
    // ipcRenderer.send('ipc-update-check');
    ipcRenderer.on('ipc-checking-for-update', this.onUpdateChekingListener);
    ipcRenderer.on('ipc-update-available', this.onUpdateAvailableListener);
    ipcRenderer.on('ipc-update-not-available', this.onUpdateNotAvailableListener);
    ipcRenderer.on('ipc-update-error', this.onUpdateErrorListener);

    /**
     * Window section.
     */
    ipcRenderer.on('window-params-changed', this.onWindowParamsChangeListener);
  }

  static getVersion() {
    const json = fs.readFileSync(PACKAGE_PATH, { encoding: 'utf8' });
    const data = JSON.parse(json);

    return data.version;
  }

  /**
   * Keys section.
   */
  private handleKeyRemove = (origin: string) => {
    ipcRenderer.send('ipc-2key-remove', origin);
  };

  private keysListGet = () => {
    const list = ipcRenderer.sendSync('ipc-2key-list-get');

    this.setState({
      keys: {
        list,
        isFetching: 'resolved',
      },
    });
  };

  /**
   * Logging section.
   */
  private loggingGet() {
    const status = ipcRenderer.sendSync('ipc-logging-status-get');

    this.setState({
      logging: status,
    });
  }

  private handleLoggingStatusChange = () => {
    ipcRenderer.send('ipc-logging-status-change');
  };

  private handleLoggingOpen = () => {
    ipcRenderer.send('ipc-logging-open');
  };

  private onLoggingChangedListener = (_: IpcRendererEvent, status: boolean) => {
    this.setState({
      logging: status,
    });
  };

  /**
   * Language section.
   */
  private handleLanguageChange = (lang: string) => {
    ipcRenderer.send('ipc-language-set', lang);
  };

  /**
   * Telemetry section.
   */
  private telemetryGet() {
    const status = ipcRenderer.sendSync('ipc-telemetry-status-get');

    this.setState({
      telemetry: status,
    });
  }

  private onTelemetryChangedListener = (_: IpcRendererEvent, status: boolean) => {
    this.setState({
      telemetry: status,
    });
  };

  private handleTelemetryStatusChange = () => {
    ipcRenderer.send('ipc-telemetry-status-change');
  };

  /**
   * Theme section.
   */
  private themeGet() {
    const theme = ipcRenderer.sendSync('ipc-theme-get');

    this.setState({
      theme,
    });
  }

  private onThemeChangedListener = (_: IpcRendererEvent, theme: ThemeType) => {
    this.setState({
      theme,
    });
  };

  private handleThemeChange = (theme: ThemeType) => {
    ipcRenderer.send('ipc-theme-set', theme);
  };

  /**
   * Notification section
   */

  private notificationPriorityGet() {
    const priority = ipcRenderer.sendSync('ipc-priority-get');

    this.setState({
      notificationPriority: priority,
    });
  }

  private notificationSoundsGet() {
    const sounds = ipcRenderer.sendSync('ipc-sounds-get');

    this.setState({
      notificationSounds: sounds,
    });
  }

  private onNotificationPriorityChangedListener = (_: IpcRendererEvent, priority: PriorityType) => {
    this.setState({
      notificationPriority: priority,
    });
  };

  private onNotificationSoundsChangedListener = (_: IpcRendererEvent, sounds: boolean) => {
    this.setState({
      notificationSounds: sounds,
    });
  };

  private handlePriorityChange = (priority: PriorityType) => {
    ipcRenderer.send('ipc-priority-set', priority);
  };

  private handleSoundsChange = () => {
    ipcRenderer.send('ipc-sounds-set');
  };

  /**
   * Application section
   */

  private startupGet() {
    const startup = ipcRenderer.sendSync('ipc-startup-get');

    this.setState({
      runAtStartup: startup,
    });
  }

  private hostUrlGet() {
    const host = ipcRenderer.sendSync('ipc-host-get');

    this.setState({
      hostUrl: host,
    });
  }

  private onRunAsStartupChangedListener = (_: IpcRendererEvent, runAtStartup: boolean) => {
    this.setState({
      runAtStartup,
    });
  };

  private onHostUrlChangedListener = (_: IpcRendererEvent, hostUrl: string) => {
    this.setState({
      hostUrl,
    });
  };

  private handleRunAtStartupChange = () => {
    ipcRenderer.send('ipc-startup-set');
  };

  private handleHostUrlChange = (url: string) => {
    ipcRenderer.send('ipc-host-set', url);
  };

  /**
   * Update section.
   */
  private onUpdateChekingListener = () => {
    this.setState({
      update: {
        isFetching: 'pending',
      },
    });
  };

  private onUpdateAvailableListener = (_: IpcRendererEvent, info: UpdateInfoType) => {
    this.setState({
      update: {
        isFetching: 'resolved',
        info,
      },
    });
  };

  private onUpdateNotAvailableListener = () => {
    this.setState({
      update: {
        isFetching: 'resolved',
      },
    });
  };

  private onUpdateErrorListener = () => {
    this.setState({
      update: {
        isFetching: 'rejected',
      },
    });
  };

  /**
   * UI section.
   */
  private handleChangeTab = (value: TabType) => {
    this.setState({
      activeTab: value,
    });
  };

  /**
   * Window section.
   */
  private onWindowParamsChangeListener = (_: IpcRendererEvent, params: Assoc<any>) => {
    const { defaultTab } = params;
    const { activeTab } = this.state;

    if (defaultTab !== activeTab) {
      this.handleChangeTab(defaultTab);
    }
  };

  renderChildrens() {
    const {
      activeTab,
      keys,
      logging,
      telemetry,
      runAtStartup,
      hostUrl,
      notificationPriority,
      notificationSounds,
      theme,
      update,
    } = this.state;

    return (
      <Container
        logging={{
          onLoggingOpen: this.handleLoggingOpen,
          onLoggingStatusChange: this.handleLoggingStatusChange,
          status: logging,
        }}
        notification={{
          onPriorityChange: this.handlePriorityChange,
          onSoundsChange: this.handleSoundsChange,
          priority: notificationPriority,
          sounds: notificationSounds,
        }}
        application={{
          onRunAtStartupChange: this.handleRunAtStartupChange,
          onHostUrlChange: this.handleHostUrlChange,
          runAtStartup,
          hostUrl,
        }}
        telemetry={{
          onTelemetryStatusChange: this.handleTelemetryStatusChange,
          status: telemetry,
        }}
        language={{
          onLanguageChange: this.handleLanguageChange,
        }}
        keys={{
          ...keys,
          onKeyRemove: this.handleKeyRemove,
        }}
        theme={{
          value: theme,
          onThemeChange: this.handleThemeChange,
        }}
        update={update}
        version={this.version}
        tab={{
          value: activeTab,
          onChange: this.handleChangeTab,
        }}
      />
    );
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('root'),
);
