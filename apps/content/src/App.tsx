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
import UserProfileScreen from "./screens/UserProfileScreen";
import { LoadingProvider } from "./context/loading";

export type AppRouterParam = {
  id: string;
};

function App() {
  return (
    <ThemeProvider>
      <ToastContainer />
      <LoadingProvider>
        <AuthProvider>
          <Header />
          <Switch>
            <Route path="/" component={HomeScreen} />
            <Route path="/login" component={LoginScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/profiles" component={UserProfileScreen} />
            <Route path="/quizlist" component={DashboardQuestionaireScreen} />
            <Route path="/quiz/new" component={QuestionnaireEditor} />
            <Route path="/quiz/edit/:id" component={QuestionnaireEditor} />
            <Route path="/play/:id" component={ExamScreen} />
          </Switch>
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
