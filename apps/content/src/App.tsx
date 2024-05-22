import { Route, Switch } from "wouter";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";

function App() {
  return (
    <div className="flex flex-1 w-full h-full justify-center ">
      <Switch>
        <Route path="/" component={HomeScreen} />
      </Switch>
    </div>
  );
}

export default App;
