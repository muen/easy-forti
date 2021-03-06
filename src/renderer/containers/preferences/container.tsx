import * as React from 'react';
import {
  Tabs,
  Tab,
  Box,
  SegueHandler,
} from 'lib-react-components';
import { Requests } from './requests';
import { About } from './about';
import { Settings } from './settings';
import { Tools } from './tools';
import { IntlContext } from '../../components/intl';
import './styles/container.css';

export interface IContainerProps {
  logging: {
    onLoggingOpen: () => void;
    onLoggingStatusChange: () => void;
    status: boolean;
  };
  telemetry: {
    onTelemetryStatusChange: () => void;
    status: boolean;
  };
  language: {
    onLanguageChange: (lang: string) => void;
  };
  keys: {
    list: IKey[];
    isFetching: IsFetchingType;
    onKeyRemove: (origin: string) => void;
  };
  theme: {
    value: ThemeType;
    onThemeChange: (theme: ThemeType) => void;
  };
  notification: {
    priority: PriorityType;
    sounds: boolean;
    onPriorityChange: (priority: PriorityType) => void;
    onSoundsChange: () => void;
  };
  application: {
    onRunAtStartupChange: () => void;
    onHostUrlChange: (url: string) => void;
    runAtStartup: boolean;
    hostUrl: string;
  };
  update: {
    isFetching: IsFetchingType;
    info?: UpdateInfoType;
  };
  version: string;
  tab: {
    value: TabType;
    onChange: (value: TabType) => void;
  };
}

export interface IContainerState {
  tab: TabType;
}

export default class Container extends React.Component<IContainerProps, IContainerState> {
  static contextType = IntlContext;

  handleChangeTab = (_: Event, value: string | number) => {
    const { tab } = this.props;

    tab.onChange(value as TabType);
  };

  // eslint-disable-next-line class-methods-use-this
  renderNotificationBadge() {
    return (
      <Box
        className="badge"
        fill="attention"
      />
    );
  }

  render() {
    const {
      language,
      keys,
      logging,
      telemetry,
      version,
      theme,
      update,
      tab,
      notification,
      application,
    } = this.props;
    const { intl } = this.context;

    return (
      <Box
        className="host"
        fill="grey_1"
      >
        <Box
          stroke="grey_2"
          strokeType="bottom"
        >
          <Tabs
            value={tab.value}
            align="left"
            onChange={this.handleChangeTab}
            className="tabs"
            color="black"
            colorOn="primary"
          >
            <Tab
              value="requests"
              className="tab b3"
            >
              {intl('requests')}
              {update.info ? this.renderNotificationBadge() : null}
            </Tab>
            <Tab
              value="settings"
              className="tab b3"
            >
              {intl('settings')}
            </Tab>
            <Tab
              value="tools"
              className="tab b3"
            >
              {intl('tools')}
            </Tab>
            <Tab
              value="about"
              className="tab b3"
            >
              {intl('about')}
            </Tab>
          </Tabs>
        </Box>
        <div className="content">
          <SegueHandler value={tab.value}>
            <Requests
              name="requests"
              keys={keys}
            />
            <Settings
              name="settings"
              language={language}
              logging={logging}
              telemetry={telemetry}
              notification={notification}
              application={application}
              theme={theme}
            />
            <Tools
              name="tools"
            />
            <About
              name="about"
              version={version}
              update={update}
            />
          </SegueHandler>
        </div>
      </Box>
    );
  }
}
