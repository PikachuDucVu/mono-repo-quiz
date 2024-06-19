import { Route, Switch } from "wouter";
import HomeScreen from "./screens/HomeScreen";
import QuizListScreen from "./screens/QuizListScreen";
import LoginScreen from "./screens/LoginScreen";
import ExamScreen from "./screens/ExamScreen";
import NewQuizScreen from "./screens/NewQuizScreen";
import { NormalScreen } from "./components/NormalScreen";
import Header from "./components/Header";
import RegisterScreen from "./screens/RegisterScreen";

export type AppRouterParam = {
  id: string;
};

function App() {
  return (
    <NormalScreen embedded disableDefaultBackground>
      <Header />
      <Switch>
        <Route path="/" component={HomeScreen} />
        <Route path="/admin" component={QuizListScreen} />
        <Route path="/admin/quiz/" component={NewQuizScreen} />
        <Route path="/admin/quiz/:id" component={NewQuizScreen} />
        <Route path="/login" component={LoginScreen} />
        <Route path="/register" component={RegisterScreen} />
        <Route path="/play/:id" component={ExamScreen} />
      </Switch>
    </NormalScreen>
  );
}

export default App;
