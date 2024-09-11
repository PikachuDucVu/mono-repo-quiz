import { Route, Switch } from "wouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/authen";
import { ThemeProvider } from "./components/ThemeProvider";
import { HomeScreen } from "./screens/HomeScreen";
import { DashboardQuestionaireScreen } from "./screens/DashboardQuestionaireScreen";
import { ExamScreen } from "./screens/ExamScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import QuestionnaireEditor from "./screens/QuestionnaireEditor";
import Header from "./components/Header";

export type AppRouterParam = {
  id: string;
};

function App() {
  return (
    <ThemeProvider>
      <ToastContainer />
      <AuthProvider>
        <Header />
        <Switch>
          <Route path="/" component={HomeScreen} />
          <Route path="/quizlist" component={DashboardQuestionaireScreen} />
          <Route path="/quiz/new" component={QuestionnaireEditor} />
          <Route path="/quiz/edit/:id" component={QuestionnaireEditor} />
          <Route path="/login" component={LoginScreen} />
          <Route path="/register" component={RegisterScreen} />
          <Route path="/play/:id" component={ExamScreen} />
        </Switch>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
