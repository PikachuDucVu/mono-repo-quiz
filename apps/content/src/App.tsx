import { Route, Switch } from "wouter";
import NewQuizScreen from "./screens/temp/NewQuizScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/authen";
import { ThemeProvider } from "./components/ThemeProvider";
import { HomeScreen } from "./screens/HomeScreen";
import Header from "./components/Header";
import { DashboardQuestionaireScreen } from "./screens/DashboardQuestionaireScreen";
import { EditQuestionaire } from "./screens/EditQuestionaire";
import { ExamScreen } from "./screens/ExamScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";

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
          <Route path="/quizlist/quiz/new" component={EditQuestionaire} />
          <Route path="/quizlist/quiz/:id" component={NewQuizScreen} />
          <Route path="/login" component={LoginScreen} />
          <Route path="/register" component={RegisterScreen} />
          <Route path="/playquiz/:id" component={ExamScreen} />
        </Switch>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
