import React, { Component } from 'react';
import { DispatchProp } from 'react-redux';
import cx from 'classnames';

import styles from './WebBrowser.css';
import { WEBVIEW_PARTITION } from 'constants/http';
import { WebControls } from 'components/browser/Controls';
import { netConnect } from 'lobby';
import { ILobbyNetState } from 'lobby/reducers';
import { server_requestMedia } from 'lobby/actions/mediaPlayer';

const DEFAULT_URL = './homescreen.html';
// const DEFAULT_URL = 'https://www.google.com/';
// const DEFAULT_URL = 'data:text/html,<style>html{color:#fff;font-size:36px}</style>B R O W S E R';

interface IProps {
  className?: string;
  initialUrl?: string;
  onClose?: () => void;
}

type PrivateProps = IProps & DispatchProp<ILobbyNetState>;

export class _WebBrowser extends Component<PrivateProps> {
  private webview?: Electron.WebviewTag | null;
  private controls?: WebControls | null;

  private hasSetupControls?: boolean;

  private setupControls() {
    if (!this.hasSetupControls && this.controls && this.webview) {
      this.controls.setWebview(this.webview);
      this.hasSetupControls = true;
    }
  }

  private setupWebview = (webview: Electron.WebviewTag | null): void => {
    this.webview = webview;
    this.setupControls();
  };

  render(): JSX.Element {
    return (
      <div className={cx(styles.container, this.props.className)}>
        <WebControls
          ref={el => {
            this.controls = el;
            this.setupControls();
          }}
          onClose={this.props.onClose}
          onRequestUrl={url => {
            this.props.dispatch!(server_requestMedia(url));

            if (this.props.onClose) {
              this.props.onClose();
            }
          }}
        />
        {this.renderContent()}
      </div>
    );
  }

  private renderContent() {
    const src = this.props.initialUrl || DEFAULT_URL;

    // TODO: Remove `is` attribute from webview when React 16 is out
    // https://stackoverflow.com/a/33860892/1490006
    return (
      <webview
        is="is"
        ref={this.setupWebview}
        src={src}
        class={styles.content}
        /* Some website embeds are disabled without an HTTP referrer */
        httpreferrer="http://mediaplayer.samuelmaddock.com/"
        plugins="true"
        partition={WEBVIEW_PARTITION}
        transparent
      />
    );
  }
}

export const WebBrowser = netConnect<{}, {}, IProps>()(_WebBrowser);