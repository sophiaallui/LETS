import NavBar from './components/NavBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css';
import Progress from './pages/Progress';
import Messenger from './pages/Messenger';

function App() {

  return (
    <Router>
      <div >
        <nav>
          <NavBar />
        </nav>
        <Switch>
          <Route path="/" exact>
            <strong style={{color:"pink"}}>Welcome Homeeeee ^.^ </strong>
          </Route>
          <Route path="/progress" >
            <strong style={{color:"pink"}}>progresssss~ 💪🏼🥺</strong>
            <Progress/>
          </Route>
          <Route path="/messenger" >
            <strong style={{color:"#ADB4A2"}}>LETS GET THEM GAINZ BOOOIZ~ 💪🏼🥺💪🏼</strong>
            <Messenger/>
          </Route>

        </Switch>
      </div>
    </Router>

  );
}

export default App;
