/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import { Typography, Box } from 'lib-react-components';
import { ModalLayout } from '../../components/layouts';
import { WindowEvent } from '../../components/window_event';
import { IntlContext } from '../../components/intl';

const s = require('./styles/container.sass');

export interface IContainerProps {
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
  origin: string;
  pin: string;
}

export default class Container extends React.Component<IContainerProps> {
  static contextType = IntlContext;

  onKeyDown = (e: KeyboardEvent) => {
    const { onApprove, onReject, onClose } = this.props;

    switch (e.keyCode) {
      case 13: // enter
        onApprove();
        break;

      case 27: // esc
        if (onReject) {
          onReject();
        } else {
          onClose();
        }
        break;

      default:
        // nothing
    }
  };

  render() {
    const {
      onApprove,
      onReject,
      onClose,
      pin,
    } = this.props;
    const { intl } = this.context;

    return (
      <>
        <WindowEvent
          event="keydown"
          onCall={this.onKeyDown}
        />
        <ModalLayout
          title={[
            [<a href={origin}>{origin}</a>, <br />, intl('key-pin.1', '')],
            intl('key-pin.2', intl('approve')),
          ]}
          onApprove={onApprove}
          onReject={onReject}
          onCancel={onClose}
          inProgress={false}
          isValid
        >
          {pin.split('').map((char, index) => (
            <Box
              stroke="grey_2"
              key={index}
              className={s.pin_item}
            >
              <Typography
                type="h4"
                align="center"
                className={s.pin_value}
              >
                {char}
              </Typography>
            </Box>
          ))}
        </ModalLayout>
      </>
    );
  }
}
