import React from "react";
import "isomorphic-fetch";
import { withRouter } from "react-router";
import PushBanner from "../push-banner";
import { loadAmpDocument } from "../../helpers/loadData";

//import {askPermission, subscribeUserToPush,registerTokenOnServer} from '../../messaging'

/**
 * Fetches the AMP document at a given `src` URL and renders it via Shadow DOM.
 */
class AMPDocument extends React.Component {
  constructor(props) {
    super(props);
    //TODO: we can SSR AMP Docs from server from now, but i will look into it
    //if (props.staticContext && props.staticContext.data) {
    //this.state = {
    //data: props.staticContext.data,
    //};
    //} else {
    //this.state = {
    //data: [],
    //};
    //}

    this.state = {
      offline: false,
      loading: false,
    };

    /**
     * `window.AMP` is set by the AMP runtime when it finishes loading.
     * @const
     * @private
     */
    this.ampReadyPromise_ = new Promise((resolve) => {
      if (typeof window !== "undefined") {
        (window.AMP = window.AMP || []).push(resolve);
      }
    });
    /**
     * Child element that will wrap the AMP shadow root.
     * @private
     * @type {Element}
     */
    this.container_ = null;

    /**
     * XMLHTTPRequest that fetches the AMP document.
     * @private
     * @type {XMLHTTPRequest}
     */
    this.xhr_ = null;

    /**
     * Provides AMP functionality on the newly created shadow root after
     * an AMP document is attached.
     * @private
     * @type {Object}
     */
    this.shadowAmp_ = null;

    /**
     * The root node of the shadow AMP.
     * @note A single node must not be reused for multiple shadow AMP docs.
     * @type {Element}
     */
    this.shadowRoot_ = null;

    /** @private */
    this.boundClickListener_ = this.clickListener_.bind(this);
  }
  componentDidMount() {
    this.container_.addEventListener("click", this.boundClickListener_);
    debugger;
    setTimeout(() => {
      if (window.__ROUTE_DATA__[0]) {
        console.log("loading from __ROUTE_DATA__");
        this.attachAmpDoc_(
          new DOMParser().parseFromString(window.__ROUTE_DATA__[0], "text/html")
        ).then(() => {
          this.setState({ loading: false });
        });
        delete window.__ROUTE_DATA__;
      } else {
        this.setState({ loading: true });
        loadAmpDocument(this.props.src)
          .then((text) => new DOMParser().parseFromString(text, "text/html"))
          .then((data) => {
            console.log(`data after calling loadDocument`, data);
            return this.attachAmpDoc_(data);
          })
          .catch((e) => {
            this.setState({ offline: true });
          })
          .finally(() => {
            this.setState({ loading: false });
          });
      }
    }, 0);
  }

  componentWillUnmount() {
    if (!this.AmpDocClosed) {
      this.closeShadowAmpDoc_();
    }
    this.container_ &&
      this.container_.removeEventListener("click", this.boundClickListener_);
    if (this.xhr_) {
      this.xhr_.abort();
      this.xhr_ = null;
    }
  }

  componentWillReceiveProps(nextProps) {
    this.AmpDocClosed = false;
    this.attachAmpDoc_(nextProps.src);
  }

  render() {
    if (this.state.offline) {
      return (
        <div>
          <h2>Houston, tenemos problemas</h2>
          <p>
            parece que estas sin Conexión a internet&mdash; por favor revisala
          </p>
        </div>
      );
    } else {
      return (
        <div>
          {this.state.loading ? (
            <div className="loading">
              <img src="/images/loading.gif" />
            </div>
          ) : (
            ""
          )}
          <div
            className={this.state.loading ? "amp-container-hide" : null}
            ref={(ref) => (this.container_ = ref)}
          >
            {}
          </div>
          <PushBanner />
        </div>
      );
    }
  }
  /**
   * Hides elements (e.g. banners) that would clash with the app shell.
   * @param {!Document} doc
   * @private
   */
  hideUnwantedElementsOnDocument_(doc) {
    // Eliminando todos los hijos de un elemento
    var analitycs = doc.getElementById("google-analitycs");
    if (analitycs) {
      while (analitycs.firstChild) {
        analitycs.removeChild(analitycs.firstChild);
      }
    }
    var categories = doc.getElementById("categories");
    if (categories) {
      while (categories.firstChild) {
        categories.removeChild(categories.firstChild);
      }
    }
  }

  /**
   * Fetches the AMP document at `url` and attaches it as a shadow root.
   * @private
   * @param {string} url
   */
  attachAmpDoc_(doc) {
    this.hideUnwantedElementsOnDocument_(doc);
    return this.ampReadyPromise_.then((amp) => {
      // Replace the old shadow root with a new div element.
      const oldShadowRoot = this.shadowRoot_;
      this.shadowRoot_ = document.createElement("div");
      if (oldShadowRoot) {
        this.container_.replaceChild(this.shadowRoot_, oldShadowRoot);
      } else {
        this.container_.appendChild(this.shadowRoot_);
      }
      // Attach the shadow document to the new shadow root.
      this.shadowAmp_ = amp.attachShadowDoc(
        this.shadowRoot_,
        doc,
        this.props.src
      );
    });
  }

  /**
   * Cleans up internal state of current shadow AMP document.
   * @private
   */
  closeShadowAmpDoc_() {
    if (this.shadowAmp_ && typeof this.shadowAmp_.close === "function") {
      this.shadowAmp_.close();
    }
  }
  /**
   * Fetches and parses HTML at `url`.
   * @private
   * @param {string} url
   * @return {!Promise<!Document|!string>} If fetch succeeds, resolved with {!Document}.
   *         Otherwise, rejects with {!string} error description.
   */
  async fetchDocument_(url) {
    let response;
    let html;
    try {
      response = await fetch(url);
      html = await response.text();
    } catch (e) {
      /* handle error */
    } finally {
      /* be executed regardless of the try / catch result*/
    }
    return html;

    //new Promise((resolve, reject) => {
    //this.xhr_ = new XMLHttpRequest();
    //this.xhr_.open("GET", url, true);
    //this.xhr_.responseType = "document";
    //this.xhr_.setRequestHeader("Accept", "text/html");
    //this.xhr_.onreadystatechange = () => {
    //if (this.xhr_.readyState < [> STATUS_RECEIVED <] 2) {
    //return;
    //}
    //if (this.xhr_.status < 100 || this.xhr_.status > 599) {
    //this.xhr_.onreadystatechange = null;
    //reject(new Error(`Unknown HTTP status ${this.xhr_.status}`));
    //this.xhr_ = null;
    //return;
    //}
    //if (this.xhr_.readyState === [> COMPLETE <] 4) {
    //if (this.xhr_.responseXML) {
    //resolve(this.xhr_.responseXML);
    //} else {
    //reject(new Error("No xhr.responseXML"));
    //}
    //this.xhr_ = null;
    //}
    //};
    //this.xhr_.onerror = () => {
    //reject(new Error("Network failure"));
    //};
    //this.xhr_.onabort = () => {
    //reject(new Error("Request aborted"));
    //};
    //this.xhr_.send();
    //});
  }
  trackEvents(elem) {
    let GAeventsData = {
      gpx: {
        eventName: "descargaRutaGpx",
        extraParams: {
          eventCategory: "Rutas",
          eventAction: "descargaRutaGpx",
        },
      },
      android: {
        eventName: "descargaAppAndroid",
        extraParams: {
          eventCategory: "Rutas",
          eventAction: "descargaAppAndroid",
        },
      },
      ios: {
        eventName: "descargaAppIos",
        extraParams: {
          eventCategory: "Rutas",
          eventAction: "descargaAppIos",
        },
      },
      viewranger: {
        eventName: "clickRutaOnline",
        extraParams: {
          eventCategory: "Rutas",
          eventAction: "clickRutaOnline",
        },
      },
    };

    if (window && window.gtag && Object.keys(GAeventsData).includes(elem.id)) {
      let GAelementData = GAeventsData[elem.id];
      window.gtag("event", GAelementData.eventName, GAelementData.extraParams);
    }

    let FBeventsData = {
      buy: {
        eventName: "AddToCart",
        extraParams: {
          content_name: "Really Fast Running Shoes",
          content_category: "Apparel & Accessories > Shoes",
          content_ids: ["1234"],
          content_type: "product",
          value: 4.99,
          currency: "USD",
        },
      },
    };

    if (window && window.fbq && Object.keys(FBeventsData).includes(elem.id)) {
      let FBelementData = FBeventsData[elem.id];
      window.fbq("track", FBelementData.eventName, FBelementData.extraParams);
    }
  }

  /**
   * Event listener that redirects clicks on same-domain links to react-router.
   * This avoids page reload due to navigation from same-domain links in the AMP document,
   * which affords seamless UX in the style of a single-page app.
   * @private
   * @param e {!Event}
   */
  clickListener_(e) {
    if (e.defaultPrevented) {
      return false;
    }

    let a = null;

    if (e.path) {
      // Check `path` since events that cross the Shadow DOM boundary are retargeted.
      // See http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom-301/#toc-events
      for (let i = 0; i < e.path.length; i++) {
        const node = e.path[i];
        if (node.tagName === "A") {
          a = node;
          break;
        }
      }
    } else {
      // Polyfill for `path`.
      let node = e.target;
      while (node && node.tagName !== "A") {
        node = node.parentNode;
      }
      a = node;
    }
    if (a && a.href && a.target != "_blank") {
      const url = new URL(a.href);
      this.trackEvents(a);
      if (url.origin === window.location.origin) {
        // Perform router push instead of page navigation.
        e.preventDefault();
        // Clean up current shadow AMP document.
        this.closeShadowAmpDoc_();
        this.AmpDocClosed = true;
        // Router push reuses current component with new props.
        this.props.router.push(url.pathname);
        return false;
      }
    }

    return true;
  }
}

export default withRouter(AMPDocument);
