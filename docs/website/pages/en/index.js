/**
 * Copyright (c) 2018-present, Kommunicate, Inc.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

function imgUrl(img) {
  return siteConfig.baseUrl + 'img/' + img;
}

function docUrl(doc, language) {
  return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? language + '/' : '') + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button km-button-primary" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} />
  </div>
);

const ProjectTitle = props => (
  <div>
    <h2 className="projectTitle">
      {/* {siteConfig.title} */}
      Help and Documentation
    <small>
        {/* {siteConfig.tagline} */}

      </small>
    </h2>
    <p className="projectSubtexts">
      Kommunicate brings a hybrid chatbots + human powered customer messaging solution for proactive and delightful customer support.
</p>
    <p className="projectSubtexts">
      Installing a free live chat on your website is easy. You can create a free account by <a className="link-para" href="https://dashboard.kommunicate.io/signup">signing up</a> for Kommunicate.
</p>
    <p className="projectSubtexts">
      This setup guide and documentation will guide you through the steps required to integrate Kommunicate in your platforms.
</p>
  </div>

);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || '';
    return (
      <SplashContainer>
        {/* <Logo img_src={imgUrl('km-logos.svg')} /> */}
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl('web-installation.html', language)}>Get Started</Button>
            {/* <Button href={docUrl('doc1.html', language)}>Example Link</Button>
            <Button href={docUrl('doc2.html', language)}>Example Link 2</Button> */}

          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}
class DocsCards extends React.Component {
  render() {
    let language = this.props.language || '';
    return (
      <div className="docs-cards-container text-center">
        <ul className="docs-cards">
          <li>
            <a href={docUrl('web-installation.html', language)} className="cards-link cards-link--web">
              <div className="cards-container">
                <div className="cards-body">
                  <div className="cards-logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 522.468 522.469" >
                      <path fill="#5C5AA7" d="M325.762 70.513l-17.706-4.854c-2.279-.76-4.524-.521-6.707.715-2.19 1.237-3.669 3.094-4.429 5.568L190.426 440.53c-.76 2.475-.522 4.809.715 6.995 1.237 2.19 3.09 3.665 5.568 4.425l17.701 4.856c2.284.766 4.521.526 6.71-.712 2.19-1.243 3.666-3.094 4.425-5.564L332.042 81.936c.759-2.474.523-4.808-.716-6.999-1.238-2.19-3.089-3.665-5.564-4.424zm-159.595 71.952c0-2.474-.953-4.665-2.856-6.567l-14.277-14.276c-1.903-1.903-4.093-2.857-6.567-2.857s-4.665.955-6.567 2.857L2.856 254.666C.95 256.569 0 258.759 0 261.233s.953 4.664 2.856 6.566l133.043 133.044c1.902 1.906 4.089 2.854 6.567 2.854s4.665-.951 6.567-2.854l14.277-14.268c1.903-1.902 2.856-4.093 2.856-6.57 0-2.471-.953-4.661-2.856-6.563L51.107 261.233l112.204-112.201c1.906-1.902 2.856-4.093 2.856-6.567zm353.447 112.198L386.567 121.619c-1.902-1.902-4.093-2.857-6.563-2.857-2.478 0-4.661.955-6.57 2.857l-14.271 14.275c-1.902 1.903-2.851 4.09-2.851 6.567s.948 4.665 2.851 6.567l112.206 112.204-112.206 112.21c-1.902 1.902-2.851 4.093-2.851 6.563 0 2.478.948 4.668 2.851 6.57l14.271 14.268c1.909 1.906 4.093 2.854 6.57 2.854 2.471 0 4.661-.951 6.563-2.854L519.614 267.8c1.903-1.902 2.854-4.096 2.854-6.57 0-2.475-.951-4.665-2.854-6.567z" />
                    </svg>
                  </div>
                </div>
                <div className="cards-footer">
                  <h3 className="cards-title">
                    Web
                  </h3>
                </div>
              </div>
            </a>
          </li>
          <li>
            <a href={docUrl('android-installation.html', language)} className="cards-link cards-link--android">
              <div className="cards-container">
                <div className="cards-body">
                  <div className="cards-logo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 495.7 492.9" width="50" height="50">
                      <path fill="#5c5aa7" d="M370.4 77.7l41.4-64A8.82 8.82 0 1 0 397 4.1l-42.9 66.2a284.2 284.2 0 0 0-212.7 0L98.6 4.1a8.82 8.82 0 0 0-14.8 9.6l41.5 64C50.4 114.4 0 183.4 0 262.6c0 3.9.1 150.3.1 207.7A22.7 22.7 0 0 0 22.8 493h450a22.7 22.7 0 0 0 22.7-22.7c0-57.4.2-203.7.2-207.7-.1-79.2-50.5-148.2-125.3-184.9zM133.2 192.3a23.7 23.7 0 1 1 23.8-23.8 23.7 23.7 0 0 1-23.8 23.8zm229.1 0a23.7 23.7 0 1 1 23.8-23.8 23.7 23.7 0 0 1-23.7 23.7z" />
                    </svg>
                  </div>
                </div>
                <div className="cards-footer">
                  <h3 className=" cards-title">
                    Android
                  </h3>
                </div>
              </div>
            </a>
          </li>
          <li>
            <a href={docUrl('ios-installation.html', language)} className="cards-link cards-link--ios">
              <div className="cards-container">
                <div className="cards-body">
                  <div className="cards-logo">
                    <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 249.3 305" width="50" height="50">
                      <g fill="#5c5aa7" data-name="Group">
                        <path d="M12.8 112.1C-12.9 156.9 3.4 224.8 32 265.9 46.2 286.5 60.6 305 80.3 305h1.1c9.3-.4 16-3.2 22.5-6s14.8-6.3 26.6-6.3 18.4 3.1 25.3 6.1 13.9 6 24.3 5.8c22.2-.4 35.9-20.4 47.9-37.9a168.2 168.2 0 0 0 21-43v-.3a2.5 2.5 0 0 0-1.3-3.1h-.2c-3.9-1.6-38.3-16.8-38.6-58.4-.3-33.7 25.8-51.6 31-54.8l.2-.2a2.5 2.5 0 0 0 .7-3.5C222.9 77 195.3 73 184.2 72.6l-4.9-.2c-13.1 0-25.6 4.9-35.6 8.9-6.9 2.7-12.9 5.1-17.1 5.1S115.9 84 109 81.2c-9.3-3.7-19.9-7.9-31.1-7.9h-.8c-26.1.3-50.7 15.2-64.3 38.8z" data-name="Path" />
                        <path d="M184.2 0c-15.8.6-34.7 10.3-46 23.6-9.6 11.1-19 29.7-16.5 48.4a2.5 2.5 0 0 0 2.3 2.2h3.2c15.4 0 32-8.5 43.4-22.3s18-33.1 16.2-49.8a2.5 2.5 0 0 0-2.6-2.1z" data-name="Path" />
                      </g>
                    </svg>
                  </div>
                </div>
                <div className="cards-footer">
                  <h3 className="cards-title">
                    iOS
                  </h3>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}>
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = props => (
  <Block layout="fourColumn">
    {[
      {
        content: 'This is the content of my feature',
        //image: imgUrl('km-logos.svg'),
        imageAlign: 'top',
        title: 'Feature One',
      },
      {
        content: 'The content of my second feature',
        // image: imgUrl('km-logos.svg'),
        imageAlign: 'top',
        title: 'Feature Two',
      },
    ]}
  </Block>
);

const FeatureCallout = props => (
  <div
    className="productShowcaseSection paddingBottom"
    style={{ textAlign: 'center' }}>
    <h2>Feature Callout</h2>
    <MarkdownBlock>These are features of this project</MarkdownBlock>
  </div>
);

const LearnHow = props => (
  <Block background="light">
    {[
      {
        content: 'Talk about learning how to use this',
        // image: imgUrl('km-logos.svg'),
        imageAlign: 'right',
        title: 'Learn How',
      },
    ]}
  </Block>
);

const TryOut = props => (
  <Block id="try">
    {[
      {
        content: 'Talk about trying this out',
        // image: imgUrl('km-logos.svg'),
        imageAlign: 'left',
        title: 'Try it Out',
      },
    ]}
  </Block>
);

const Description = props => (
  <Block background="dark">
    {[
      {
        content: 'This is another description of how this project is useful',
        //image: imgUrl('km-logos.svg'),
        imageAlign: 'right',
        title: 'Description',
      },
    ]}
  </Block>
);

const Showcase = props => {
  if ((siteConfig.users || []).length === 0) {
    return null;
  }
  const showcase = siteConfig.users
    .filter(user => {
      return user.pinned;
    })
    .map((user, i) => {
      return (
        <a href={user.infoLink} key={i}>
          <img src={user.image} title={user.caption} />
        </a>
      );
    });

  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>{"Who's Using This?"}</h2>
      <p>This project is used by all these people</p>
      <div className="logos">{showcase}</div>
      <div className="more-users">
        <a className="button" href={pageUrl('users.html', props.language)}>
          More {siteConfig.title} Users
        </a>
      </div>
    </div>
  );
};

class Index extends React.Component {
  render() {
    let language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          {/* <Features /> */}
          {/* <FeatureCallout /> */}
          {/* <LearnHow /> */}
          {/* <TryOut /> */}
          {/* <Description /> */}
          {/* <Showcase language={language} /> */}
        </div>
        <DocsCards />
      </div>
    );
  }
}

module.exports = Index;
