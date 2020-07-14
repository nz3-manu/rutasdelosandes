import {Link} from 'react-router';
import {TimelineLite, TweenLite, Power2} from 'gsap';
import Article from './article';
import React from 'react';
import {connect} from 'react-redux';
import PushBanner from './push-banner';

/**
 * The app's home page, modulo the navigation bar.
 * Displays a list of `Article`s.
 */
class Home extends React.Component {
  constructor(props) {
    super(props);

    /** @private @type {!Element} */
    this.articles_ = null;

    /** @private @type {!Element} */
    this.categories_ = null;

    /** @private @type {!TimelineLite} */
    this.timeline_ = null;
  }
  render() {
    return (
      <div>
        <div className="articles" ref={ref => (this.articles_ = ref)}>
          {this.props.documents.rutas.filter((doc)=>!doc.draft).map(doc => (
            <Link className="article-link" to={doc.url} key={doc.url}>
              <Article
                title={doc.title}
                subtitle={'Por ' + doc.author + ', ' + doc.date}
                image={doc.image}
                src={doc.url}
              />
            </Link>
          ))}
        </div>
        <PushBanner />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  documents: state.documents,
});

export default connect(mapStateToProps)(Home);
