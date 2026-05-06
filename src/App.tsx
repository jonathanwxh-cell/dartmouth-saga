import './index.css';
import Game from './components/Game';
import { useEraAttribute } from './styles/useEraAttribute';

function App() {
  useEraAttribute();

  return <Game />;
}

export default App;
