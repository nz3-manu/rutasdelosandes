import { Link } from 'react-router';
import Home from './home';
import React from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import TransitionWrapper from './transition-wrapper';
import './shell.css';

/**
 * The (App) Shell contains the web app's entire UI.
 *
 * The navigation bar is always displayed, with either a `Home` or `Article` component beneath it.
 */
export default class Shell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      'documents': [],
      isTransitioning: false,
      sidebarIsOpen: false
    };
  }

  componentDidMount() {
    fetch('/documents.json').then(response => {
      if (response.status !== 200) {
        console.log('AMP document list fetch failed with code: ' + response.status);
        return;
      }
      response.json().then(data => {
        this.setState({'documents': data});
      });
    });
  }
  toggleSideBar(state) { 
    this.setState({sidebarIsOpen:state})
  }
  render() {
    return (
      <div>
        {this.state.sidebarIsOpen &&
          <div>
          <div className="side-bar" open>
            <button onClick={() => { this.toggleSideBar(false) } } className="side-bar__close">
              <img  src="/images/ic_close_black_18dp_2x.png"
                    width="20"
                    height="20"
                    alt="close sidebar"
              />
             </button> 
              <ul>
                {jekyll.pages.map((page,index) =>
                  <li key={index}>
                    <Link to={page.url}>
                      {page.title}  
                    </Link>  
                  </li>)} 
              </ul>    
              </div>
                <div className="side-bar__mask" onClick={() => { this.toggleSideBar(false) }} >
            </div>
          </div>      
        }      
        <div className="header" style={{ backgroundColor: jekyll.brandColor, borderBottom: "solid 1px black" }} >
          <div className='container'>
            <Link to='/'>
              <img src={jekyll.logo} height="50" width="50">
              </img>
            </Link>        
            <button onClick={() => { this.toggleSideBar(true) }} className='menu'>      
               <svg viewBox="0 0 18 15" width="35px" height="45px">
                <path fill="#424242" d="M18,1.484c0,0.82-0.665,1.484-1.484,1.484H1.484C0.665,2.969,0,2.304,0,1.484l0,0C0,0.665,0.665,0,1.484,0 h15.031C17.335,0,18,0.665,18,1.484L18,1.484z"/>
                <path fill="#424242" d="M18,7.516C18,8.335,17.335,9,16.516,9H1.484C0.665,9,0,8.335,0,7.516l0,0c0-0.82,0.665-1.484,1.484-1.484 h15.031C17.335,6.031,18,6.696,18,7.516L18,7.516z"/>
                <path fill="#424242" d="M18,13.516C18,14.335,17.335,15,16.516,15H1.484C0.665,15,0,14.335,0,13.516l0,0 c0-0.82,0.665-1.484,1.484-1.484h15.031C17.335,12.031,18,12.696,18,13.516L18,13.516z"/>
                </svg>              
            </button>
         </div>
        </div>
        <div className='container '>
          <ReactTransitionGroup>
            {
              (this.props.children) ?
                  <TransitionWrapper
                      key='transition-wrapper'
                      contents={this.props.children}
                      isTransitioning={this.state.isTransitioning} /> :
                  <Home key='home'
                      documents={this.state.documents}
                      transitionStateDidChange={this.onTransitionStateChange_.bind(this)} />
            }
          </ReactTransitionGroup>
        </div>
      </div>
    );
  }

  /** @private */
  onTransitionStateChange_(isTransitioning) {
    this.setState({isTransitioning: isTransitioning});
  }
}
