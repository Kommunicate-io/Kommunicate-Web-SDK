/**
 * Copyright (c) 2018-present, Kommunicate, Inc.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? language + '/' : '') + doc;
  }

  render() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          {/* <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a> */}
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('installation.html', this.props.language)}>
              Web
            </a>
            <a href={this.docUrl('Kommunicate-Android-Chat-SDK-Customer-Support.html', this.props.language)}>
              Android
            </a>
            <a href="https://docs.applozic.com/docs/ios-chat-sdk" target="_blank">
              iOS
            </a>
            <a href="https://docs.applozic.com/docs/ionic-phonegap-cordova-chat-sdk" target="_blank">
            Ionic/Phonegap
            </a>
            <a href="https://docs.applozic.com/docs/xamarin-chat-sdk" target="_blank">
            Xamarin
            </a>
          </div>
          <div>
            <h5>Product</h5>
            {/* <a href={this.pageUrl('users.html', this.props.language)}>
              User Showcase
            </a> */}
            <a href="https://www.kommunicate.io/pricing" className="footer-pricing">Pricing and FAQs</a>
            <a href="https://calendly.com/kommunicate/15min" target="_blank">Request Demo</a>
          </div>
          <div>
            <h5>Social</h5>
            <a href="https://facebook.com/kommunicateio" target="_blank">Facebook</a>
            <a href="https://twitter.com/kommunicateio" target="_blank">Twitter</a>
            <a href="https://www.linkedin.com/company/13623163/" target="_blank">Linkedin</a>
            {/* <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/facebook/docusaurus/stargazers"
              data-show-count={true}
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a> */}
          </div>
        </section>

        <a
          href="https://kommunicate.io"
          target="_blank"
          className="fbOpenSource">
          <img
            src={this.props.config.baseUrl + 'img/km-logos.svg'}
            alt="Facebook Open Source"
            width="170"
            height="45"
          />
        </a>
        <section className="copyright">
          Copyright &copy; {currentYear} Kommunicate.io.
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
