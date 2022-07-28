import logo from './logo.svg';

import './App.css';
import GoogleSignIn from './components/googleSignIn';
import UserName from './components/username';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <GoogleSignIn />
        {/* <UserName /> */}
      </header>
    </div>
  );
}

export default App;
