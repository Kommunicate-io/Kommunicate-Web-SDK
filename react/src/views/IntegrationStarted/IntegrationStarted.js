import React, { Component } from 'react';
import './IntegrationStarted.css';

const NotificationIcon = props => (
    <svg width={24} height={24} viewBox="0 0 21 21" {...props}>
      <path
        d="M8.443.49c-3.166.822-5.53 3.7-5.518 7.098l.013 4.892c-.01.442-.381.83-.823.82A1.68 1.68 0 0 0 .47 14.937a1.68 1.68 0 0 0 1.638 1.645l16.294-.001c.907-.013 1.659-.732 1.646-1.638a1.68 1.68 0 0 0-1.638-1.646c-.442-.01-.796-.358-.82-.822l.045-4.902a7.358 7.358 0 0 0-5.5-7.09S11.122.223 10.296.193C9.536.209 8.443.49 8.443.49zM7.435 17.373l5.718.017a2.86 2.86 0 0 1-2.84 2.845 2.836 2.836 0 0 1-2.878-2.862z"
        fillRule="nonzero" 
      />
    </svg>
)
const IntegrationWarningIcon = props => (
    <svg width={47} height={38} viewBox="0 0 47 38" {...props}>
      <g fill="#F8BA36" fillRule="nonzero">
        <path d="M22.992 30.232H3.81a.868.868 0 0 1-.89-.889v-19.18h34.933v5.461c0 .635.508 1.144 1.143 1.144s1.144-.509 1.144-1.144V3.557c0-1.652-1.398-3.049-3.05-3.049H3.812C2.159.508.762 1.905.762 3.557v25.786c0 1.652 1.397 3.049 3.049 3.049h19.18c.636 0 1.144-.508 1.144-1.143s-.508-1.017-1.143-1.017zM2.922 3.557c0-.508.38-.89.889-.89h33.28c.509 0 .89.382.89.89v4.319H2.921v-4.32z" />
        <path d="M9.908 4.065c-.635 0-1.27.508-1.27 1.27 0 .635.635 1.27 1.27 1.27s1.27-.508 1.27-1.27-.635-1.27-1.27-1.27zM14.1 4.065c-.635 0-1.27.508-1.27 1.27 0 .635.635 1.27 1.27 1.27s1.27-.508 1.27-1.27-.635-1.27-1.27-1.27zM5.59 4.065c-.636 0-1.271.508-1.271 1.27 0 .635.508 1.27 1.27 1.27.635 0 1.27-.508 1.27-1.27s-.508-1.27-1.27-1.27zM46.238 32.519l-7.24-12.703a2.493 2.493 0 0 0-1.144-1.143c-.762-.381-1.524-.508-2.413-.254-.89.254-1.525.762-1.906 1.524l-7.24 12.703a3.382 3.382 0 0 0-.381 1.524 3.145 3.145 0 0 0 3.175 3.176h14.608c.508 0 1.017-.127 1.525-.381.762-.381 1.27-1.143 1.524-1.906 0-1.016 0-1.905-.508-2.54zm-1.652 1.778c-.127.254-.254.508-.508.635-.127.127-.38.127-.508.127H28.962c-.635 0-1.016-.508-1.016-1.016 0-.127 0-.38.127-.508l7.24-12.703c.128-.254.382-.38.636-.508h.254c.127 0 .38 0 .508.127l.38.381 7.241 12.703c.254.254.382.508.254.762z" />
        <path d="M35.695 28.708l.254 2.16h.762l.254-2.16c0-.635.127-1.27.127-1.778.127-1.144.127-1.906.127-2.287 0-.635-.381-1.016-.89-1.016-.507 0-.888.381-.888 1.016 0 .381.127 1.143.127 2.287 0 .635.127 1.143.127 1.778zM36.33 32.01c-.508 0-1.016.509-1.016 1.017 0 .635.508 1.016 1.016 1.016s1.016-.508 1.016-1.016-.508-1.016-1.016-1.016z" />
      </g>
    </svg>
  )

export default class IntegrationStarted extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hidePopup: true,
            activeClass: 'km-popup-inactive',
        };
        this.togglePopup = this.togglePopup.bind(this);
    }

    togglePopup = (event) => {
        event.preventDefault();
        this.setState({
            hidePopup: false,
            activeClass: 'km-popup-active'
        }, () => {
            document.addEventListener('click', this.hidePopup);
        })
    }

    hidePopup = (event) => {
        if (this.popupMenu.contains(event.target)) {
            this.setState({ hidePopup: false, activeClass: 'km-popup-active' }, () => {
                document.addEventListener('click', this.hidePopup);
            });
        } else  {
            this.setState({ hidePopup: true, activeClass: 'km-popup-inactive' }, () => {
                document.removeEventListener('click', this.hidePopup);
            });
        }
    }

    goToInstall = () => {
        window.appHistory.push("/settings/install");
        this.setState({ hidePopup: true, activeClass: 'km-popup-inactive' }, () => {
            document.removeEventListener('click', this.hidePopup);
        });
    }


  render() {
    return (
      <div className="km-integration-started-component">
        <div className={`km-integration-notificationn-icon-container ${this.state.activeClass}`} onClick={this.togglePopup}>
            <NotificationIcon />
            <div className="km-notification-pulsing-icon km-pulse"></div>
        </div>

        <div tabIndex="-1" aria-hidden="false" role="menu"  className="km-integration-popup-container" hidden={this.state.hidePopup} ref={(element) => {
                  this.popupMenu = element;
                }}>
            <IntegrationWarningIcon />
            <p>You have not installed Kommunicate in your website</p>
            <button className="km-button km-button--primary" onClick={this.goToInstall}>See how to install</button>
        </div>
      </div>
    )
  }
}
