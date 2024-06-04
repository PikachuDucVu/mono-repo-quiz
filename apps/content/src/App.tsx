import { Route, Switch } from "wouter";
import HomeScreen from "./screens/HomeScreen";
import QuizListScreen from "./screens/QuizListScreen";
import LoginScreen from "./screens/LoginScreen";
import ExamScreen from "./screens/ExamScreen";
import NewQuizScreen from "./screens/NewQuizScreen";

function App() {
  return (
    <div className="flex w-full h-full justify-center ">
      <Switch>
        <Route path="/" component={HomeScreen} />
        <Route path="/admin" component={QuizListScreen} />
        <Route path="/admin/quiz/:id" component={NewQuizScreen} />
        <Route path="/login" component={LoginScreen} />
        <Route path="/play/:id" component={ExamScreen} />
      </Switch>
    </div>
  );
}

export default App;
