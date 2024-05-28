import { Route, Switch } from "wouter";
import HomeScreen from "./screens/HomeScreen";
import QuizListScreen from "./screens/QuizListScreen";
import LoginScreen from "./screens/LoginScreen";
import ExamScreen from "./screens/ExamScreen";

function App() {
  return (
    <div className="flex flex-1 w-full h-full justify-center ">
      <Switch>
        <Route path="/" component={HomeScreen} />
        <Route path="/admin" component={QuizListScreen} />
        <Route path="/login" component={LoginScreen} />
        <Route path="/play/:id" component={ExamScreen} />
      </Switch>
    </div>
  );
}

export default App;
