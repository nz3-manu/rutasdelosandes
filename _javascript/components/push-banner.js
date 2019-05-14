import React from 'react';
import Social from './social';
import Switch from '@material-ui/core/Switch';
import Phone from '@material-ui/icons/PhonelinkRing';

class pushBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suscribed: true,
      ready:false
    };
    this.isNotificationSupported =
      typeof window != 'undefined' &&
      ('PushManager' in window && 'serviceWorker' in navigator);
    if (this.isNotificationSupported) {
      navigator.serviceWorker.ready.then((registration) => {
        this.setState({ ...this.state, ready:true })
        this.pushState().then(isSubscribed => {
          this.setState({ ...this.state, suscribed: isSubscribed });
          // show add to home screen only to users that has notifications allowed
          if (isSubscribed) {
            this.addTohome();
          }
        });
      })
    }
  }
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = self.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  addTohome() {
    let deferredPrompt = window.deferredPrompt;
    if (deferredPrompt !== undefined) {
      // The user has had a positive interaction with our app and Chrome
      // has tried to prompt previously, so let's show the prompt.
      deferredPrompt.prompt();
      // Follow what the user has done with the prompt.
      deferredPrompt.userChoice.then(function(choiceResult) {
        console.log(choiceResult.outcome);
        if (choiceResult.outcome == 'dismissed') {
          gtag('event', 'addedtoHomeScreen', {
            value: 'no'
          });
        } else {
          gtag('event', 'addedtoHomeScreen', {
            value: 'yes'
          });
        }
      });
    }
  }
  askPermission() {
    return new Promise(function(resolve, reject) {
      const permissionResult = Notification.requestPermission(function(result) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }).then(function(permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error("We weren't granted permission.");
      }
    });
  }
  pushSubscribe() {
    return navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration =>
        registration.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(
              'BMYgIYpw8jtC_61DQFh9k0rJP-5XUrWIwsUAOOnJmJQOfdS94jSlk0C2q86F1ebI2Yln5yz6v-cTJ2h10GM-vd4'
            )
          })
          .then(subscription => {
            fetch('/api/save-subscription/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(subscription)
            }).then(() => {
              this.setState({ ...this.state, suscribed: true });
            });
          })
      );
  }
  subscribe() {
    return this.askPermission()
      .then(this.pushSubscribe.bind(this))
      .then(() => { 
        console.log(gtag)
        gtag('event', 'subscribedToPush', {
          value: 'yes'
        });
      })
      .catch(function (reason) {
        gtag('event', 'subscribedToPush', {
          value: 'no'
        });
        console.log('permisions not granted', reason);
      });
  }
  pushState() {
    return navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        if (registration) {
          return registration.pushManager
            .getSubscription()
            .then(function(subscription) {
              let isSubscribed = !(subscription === null);
              if (isSubscribed) {
                return true;
                console.log('User IS subscribed.');
              } else {
                return false;
                console.log('User is NOT subscribed.');
              }
            });
        }
      });
  }
  render() {
    if (this.isNotificationSupported || this.state.ready ) {
      return (
        <div className="bottom-widget">
          <div className="push-widget">
            <div className="amp-web-push-widget">
              <div className="push-widget-content">
                <Phone />
                <span className="push-widget-text">
                  No te pierdas nuestro contenido! suscríbete 
                </span>
                <Switch
                  checked={this.state.suscribed}
                  onChange={this.subscribe.bind(this)}
                  value="checkedB"
                  color="primary"
                />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="push-widget">
            <Social />
        </div>
      );
    }
  }
}
export default pushBanner;
