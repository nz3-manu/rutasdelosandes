import { Link } from 'react-router';
import Home from './home';
import Social from './social'
import Cart from './cart'
import React from 'react';
import { connect } from 'react-redux';




/**
 * The (App) Shell contains the web app's entire UI.
 *
 * The navigation bar is always displayed, with either a `Home` or `Article` component beneath it.
 */
class Shell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarIsOpen: false
    };
  }
  toggleSideBar(state) { 
    this.setState({sidebarIsOpen:state})
  }
   // Remove the server-side injected CSS.
   componentDidMount() {
     /* const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      } */
    }
  render() {
   let { jekyll } = this.props
    return (
      <div>
        <div className="side-bar" open = {this.state.sidebarIsOpen}>
          <button onClick={() => { this.toggleSideBar(false) } } className="side-bar__close">
            <img  src="/images/ic_close_black_18dp_2x.png"
                  alt="close sidebar"
                  className="fill-content"
            />
           </button> 
          <Social/>
            <ul className="main-menu">
              {jekyll.pages.map((page,index) =>
                <li key={index}>
                  <Link onClick={() => { this.toggleSideBar(false) } } to={page.url}>
                    {page.title}  
                  </Link>  
                </li>)} 
          </ul>
        </div>
        { this.state.sidebarIsOpen &&
              <div className="side-bar__mask" onClick={() => { this.toggleSideBar(false) }} >
            </div>      
        }      
        <header className="site-header" style={{ backgroundColor: jekyll.brandColor, borderBottom: "solid 1px black" }} >
          <div className='header-wrapper page-content'>
            <Link className="site-logo" to='/'>
              <img src={jekyll.logo} height="50" width="50">
              </img>
            </Link>   
            <div>
            <Cart />
          </div>
            <button onClick={() => { this.toggleSideBar(true) }} className='ampstart-btn caps m2 menu-button'>      
                <svg viewBox="0 0 18 15" width="35px" height="45px">
                  <path fill="#424242" d="M18,1.484c0,0.82-0.665,1.484-1.484,1.484H1.484C0.665,2.969,0,2.304,0,1.484l0,0C0,0.665,0.665,0,1.484,0 h15.031C17.335,0,18,0.665,18,1.484L18,1.484z"/>
                  <path fill="#424242" d="M18,7.516C18,8.335,17.335,9,16.516,9H1.484C0.665,9,0,8.335,0,7.516l0,0c0-0.82,0.665-1.484,1.484-1.484 h15.031C17.335,6.031,18,6.696,18,7.516L18,7.516z"/>
                  <path fill="#424242" d="M18,13.516C18,14.335,17.335,15,16.516,15H1.484C0.665,15,0,14.335,0,13.516l0,0 c0-0.82,0.665-1.484,1.484-1.484h15.031C17.335,12.031,18,12.696,18,13.516L18,13.516z"/>
                  </svg>              
              </button>
         </div>
        </header>
        <div className='container main'>
          <div className='categories' ref={ref => this.categories_ = ref}>
            <ul>
              <li>
              <Link to="/" key="1">
               <span>Rutas</span>
              </Link> 
              </li>
              <li>
              <Link to="/blog" key="2">
                <span>Blog</span>
              </Link> 
              </li>  
              <li>
                {<Link to="/tienda" key="3">
                  <span className="tienda-title">Tienda</span>
                </Link>}
              </li> 
            </ul>
          </div>
            {
              (this.props.children) ?
                  this.props.children :
                  <Home key='home' />
            }
        </div>
            <footer>
             
            </footer>

        </div>
  
    );
  }
}
const mapStateToProps = state => ({
  jekyll: state.jekyll
});

export default connect(mapStateToProps)(Shell);
