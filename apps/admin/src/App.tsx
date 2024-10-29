import { Route, Switch } from "wouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/authen";
import { ThemeProvider } from "./components/ThemeProvider";

import Header from "./components/Header";
import { Dashboard } from "./screens/DashBoard";
import { AdminLogin } from "./screens/LoginScreen";

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
          <Route path="/" component={Dashboard} />
          <Route path="/login" component={AdminLogin} />
        </Switch>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
