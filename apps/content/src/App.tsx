import { Route, Switch } from "wouter";
import HomeScreen from "./screens/HomeScreen";
import QuizListScreen from "./screens/QuizListScreen";
import LoginScreen from "./screens/LoginScreen";
import ExamScreen from "./screens/ExamScreen";
import NewQuizScreen from "./screens/NewQuizScreen";
import { NormalScreen } from "./components/NormalScreen";
import Header from "./components/Header";
import RegisterScreen from "./screens/RegisterScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/authen";
export type AppRouterParam = {
  id: string;
};

function App() {
  return (
    <NormalScreen embedded disableDefaultBackground>
      <ToastContainer />
      <AuthProvider>
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
      </AuthProvider>
    </NormalScreen>
  );
}

export default App;
