import { Route, Switch } from "wouter";
import HomeScreen from "./screens/HomeScreen";
import QuizListScreen from "./screens/QuizListScreen";

function App() {
  return (
    <div className="flex flex-1 w-full h-full justify-center ">
      <Switch>
        <Route path="/" component={HomeScreen} />
        <Route path="/admin" component={QuizListScreen} />
      </Switch>
    </div>
  );
}

export default App;
