/* global google */
import jwt_decode from 'jwt-decode'
import { useEffect, useState } from 'react';

function GoogleSignIn ({ children }) {

    function oauthSignIn() {
        // Google's OAuth 2.0 endpoint for requesting an access token
        var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
      
        // Create <form> element to submit parameters to OAuth 2.0 endpoint.
        var form = document.createElement('form');
        form.setAttribute('method', 'GET'); // Send as a GET request.
        form.setAttribute('action', oauth2Endpoint);
      
        // Parameters to pass to OAuth 2.0 endpoint.
        var params = {'client_id': '406973865496-ku7knu3jsfebvh44nskk313h8a879cj2.apps.googleusercontent.com',
                      'redirect_uri': 'https://www.adposit.com',
                      'response_type': 'token',
                      'scope': 'https://www.googleapis.com/auth/calendar',
                      'include_granted_scopes': 'true',
                      'state': 'pass-through value'};
      
        // Add form parameters as hidden input values.
        for (var p in params) {
          var input = document.createElement('input');
          input.setAttribute('type', 'hidden');
          input.setAttribute('name', p);
          input.setAttribute('value', params[p]);
          form.appendChild(input);
        }
      
        // Add form to page and submit it to open the OAuth 2.0 endpoint.
        document.body.appendChild(form);
        form.submit();
      }



  // TODO: One Tap has limitations
  const [gsiScriptLoaded, setGsiScriptLoaded] = useState(false)
  const [user, setUser] = useState(undefined)
  const [isSignedIn, setIsSignedIn] = useState(false)

  const initializeGSI = () => {
    if (!window.google || gsiScriptLoaded) return
    setGsiScriptLoaded(true)
    window.google.accounts.id.initialize({
      client_id: '406973865496-ku7knu3jsfebvh44nskk313h8a879cj2.apps.googleusercontent.com',
      callback: handleGoogleSignIn,
    })
    window.google.accounts.id.prompt(notification => {
      console.log('on prompt notification', notification)
    })
  }

  const handleGoogleSignIn = (res) => {
    if (!res.clientId || !res.credential) return
    console.log('on res handleGoogleSignIn',res)
    const decodedToken = jwt_decode(res.credential)
    console.log('decodedToken', decodedToken)
    setUser(decodedToken)
    setIsSignedIn(true)
    }
  
  
  useEffect(() => {
    if (user?._id || gsiScriptLoaded) return
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = initializeGSI
    script.async = true;
    script.id = "google-client-script"
    document.querySelector('body').appendChild(script)
    return () => {
      window.google?.accounts.id.cancel()
      document.getElementById("google-client-script")?.remove()
    }

  }, [handleGoogleSignIn, initializeGSI, user?._id])

  return <div>
    {isSignedIn ? <div>{user.name}</div>: <div><button onClick={oauthSignIn}>Sign in</button></div>}
  </div>
}

export default GoogleSignIn