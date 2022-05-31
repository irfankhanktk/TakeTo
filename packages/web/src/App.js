import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';

function App({userData}) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.{userData?.isGuest?'hi':'bye'}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userData: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
