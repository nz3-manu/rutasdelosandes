import React from 'react';


/**
 * A snippet of an AMP document that links to the full content.
 */
export default class Article extends React.Component {
  render() {
    return (
      <div className='article' style={{backgroundImage: 'url(' + this.props.image + ')'}}>
        <div className='scrim-top'></div>
        <div className='scrim-bottom'></div>
        <h3 className='article-title' >{this.props.title}</h3>
        <h4 className='article-subtitle'>{this.props.subtitle}</h4>
      </div>
    );
  }
}

