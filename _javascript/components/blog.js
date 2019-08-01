import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Article from './article';
import PushBanner from './push-banner';

class Blog extends React.Component {
  render() {
    return (
      <div>
        <div className="articles" ref={ref => (this.articles_ = ref)}>
          {this.props.documents.blog.map(doc => (
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

export default connect(mapStateToProps)(Blog);
