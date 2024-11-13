import { useCallback, useEffect, useState } from "react";
import {
  Layout,
  List,
  PieChart,
  Users,
  PlusCircle,
  Edit,
  Trash2,
  BarChart,
  Ban,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AdminAPI } from "@/utils/apis/AdminAPI";
import { User } from "@/utils/types";
import { toast } from "react-toastify";

// Mock data for quizzes (unchanged)
const mockQuizzes = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    category: "Programming",
    questions: 15,
    difficulty: "Intermediate",
    participants: 1200,
  },
  {
    id: 2,
    title: "World Geography Challenge",
    category: "Geography",
    questions: 20,
    difficulty: "Hard",
    participants: 850,
  },
  {
    id: 3,
    title: "Basic Chemistry Concepts",
    category: "Science",
    questions: 10,
    difficulty: "Easy",
    participants: 2000,
  },
  {
    id: 4,
    title: "Ancient Civilizations",
    category: "History",
    questions: 25,
    difficulty: "Hard",
    participants: 600,
  },
  {
    id: 5,
    title: "Beginner's Guide to Python",
    category: "Programming",
    questions: 12,
    difficulty: "Easy",
    participants: 3000,
  },
  {
    id: 6,
    title: "Advanced Machine Learning",
    category: "Data Science",
    questions: 30,
    difficulty: "Expert",
    participants: 300,
  },
];

// Mock data for results (unchanged)
const mockResults = [
  {
    id: 1,
    quizTitle: "JavaScript Fundamentals",
    userName: "Alice Johnson",
    score: 90,
    date: "2023-06-15",
  },
  {
    id: 2,
    quizTitle: "World Geography Challenge",
    userName: "Bob Smith",
    score: 75,
    date: "2023-06-14",
  },
  {
    id: 3,
    quizTitle: "Basic Chemistry Concepts",
    userName: "Charlie Brown",
    score: 85,
    date: "2023-06-13",
  },
  {
    id: 4,
    quizTitle: "Ancient Civilizations",
    userName: "Diana Ross",
    score: 70,
    date: "2023-06-12",
  },
  {
    id: 5,
    quizTitle: "Beginner's Guide to Python",
    userName: "Ethan Hunt",
    score: 95,
    date: "2023-06-11",
  },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("Users");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [quizzes, setQuizzes] = useState(mockQuizzes);
  const [users, setUsers] = useState<User[]>([]);
  const [isNewQuizDialogOpen, setIsNewQuizDialogOpen] = useState(false);
  const [isEditQuizDialogOpen, setIsEditQuizDialogOpen] = useState(false);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [newQuizCategory, setNewQuizCategory] = useState("");
  const [newQuizDifficulty, setNewQuizDifficulty] = useState("");
  const [newQuizQuestions, setNewQuizQuestions] = useState("");
  const [onEditUser, setOnEditUser] = useState<User | undefined>(undefined);

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "All" || quiz.category === categoryFilter) &&
      (difficultyFilter === "All" || quiz.difficulty === difficultyFilter)
  );

  const handleCreateQuiz = () => {
    const newQuiz = {
      id: quizzes.length + 1,
      title: newQuizTitle,
      category: newQuizCategory,
      questions: parseInt(newQuizQuestions),
      difficulty: newQuizDifficulty,
      participants: 0,
    };
    setQuizzes([...quizzes, newQuiz]);
    setIsNewQuizDialogOpen(false);
    resetQuizForm();
  };

  const handleEditQuiz = () => {
    const updatedQuizzes = quizzes.map((quiz) =>
      quiz.id === currentQuiz.id
        ? {
            ...quiz,
            title: newQuizTitle,
            category: newQuizCategory,
            questions: parseInt(newQuizQuestions),
            difficulty: newQuizDifficulty,
          }
        : quiz
    );
    setQuizzes(updatedQuizzes);
    setIsEditQuizDialogOpen(false);
    resetQuizForm();
  };

  const handleDeleteQuiz = (id: number) => {
    setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
  };

  const resetQuizForm = () => {
    setNewQuizTitle("");
    setNewQuizCategory("");
    setNewQuizDifficulty("");
    setNewQuizQuestions("");
    setCurrentQuiz(null);
  };

  const openEditDialog = (quiz) => {
    setCurrentQuiz(quiz);
    setNewQuizTitle(quiz.title);
    setNewQuizCategory(quiz.category);
    setNewQuizDifficulty(quiz.difficulty);
    setNewQuizQuestions(quiz.questions.toString());
    setIsEditQuizDialogOpen(true);
  };

  const openStatsDialog = (quiz) => {
    setCurrentQuiz(quiz);
    setIsStatsDialogOpen(true);
  };

  const resetUserForm = () => {
    setOnEditUser(undefined);
  };

  const openEditUserDialog = (user: User) => {
    setOnEditUser(user);
    setIsEditUserDialogOpen(true);
  };

  /////////////////////////////////////////////////
  const fetchUsersList = useCallback(async () => {
    try {
      const res = await AdminAPI.getUsers();
      setUsers(res.users);

      console.log(res.users);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchUsersList();
  }, [fetchUsersList]);

  const addNewUser = useCallback(async () => {
    if (!onEditUser) return;

    const newUser = onEditUser;

    try {
      const req = await AdminAPI.addNewUser(newUser);

      if (req.message) {
        toast.success(req.message || "User added successfully");
        fetchUsersList();
        setIsNewUserDialogOpen(false);
        resetUserForm();
      }
    } catch (e) {
      toast.error(e.response.data.message || "Failed to add user");
    }
  }, [fetchUsersList, onEditUser]);

  const handleCreateUser = () => {
    addNewUser();
    setIsNewUserDialogOpen(false);
    resetUserForm();
  };

  const handleSubmitEditUser = useCallback(async () => {
    if (!onEditUser) return;

    try {
      const req = await AdminAPI.updateUserInfo(onEditUser);

      if (req) {
        toast.success("User updated successfully");
        fetchUsersList();
        setIsEditUserDialogOpen(false);
        resetUserForm();
      }
    } catch (e) {
      toast.error(e.response.data.message || "Failed to update user");
    }
  }, [fetchUsersList, onEditUser]);

  const updateUserStatus = async (
    currentUserData: User,
    isChangeStatus?: boolean
  ) => {
    console.log(currentUserData);
    const updateStatus =
      currentUserData.status === "active" ? "banned" : "active";

    const updateUserData = {
      ...currentUserData,
      status: updateStatus as "active" | "banned",
    };

    try {
      const res = await AdminAPI.updateUserInfo(
        isChangeStatus ? updateUserData : currentUserData
      );
      toast.success(res.message);
      fetchUsersList();
    } catch (error) {
      toast.error(
        error.response.data.message || "Failed to update user status"
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <nav className="p-4">
          <ul className="space-y-2">
            {["Dashboard", "Quizzes", "Results", "Users"].map((item) => (
              <li key={item}>
                <Button
                  variant={activeTab === item ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(item)}
                >
                  {item === "Dashboard" && <Layout className="mr-2 h-4 w-4" />}
                  {item === "Quizzes" && <List className="mr-2 h-4 w-4" />}
                  {item === "Results" && <PieChart className="mr-2 h-4 w-4" />}
                  {item === "Users" && <Users className="mr-2 h-4 w-4" />}
                  {item}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {activeTab === "Quizzes" && (
            <>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4 flex-1">
                  <Input
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      <SelectItem value="Programming">Programming</SelectItem>
                      <SelectItem value="Geography">Geography</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={difficultyFilter}
                    onValueChange={setDifficultyFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Difficulties</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Dialog
                  open={isNewQuizDialogOpen}
                  onOpenChange={setIsNewQuizDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New Quiz
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Quiz</DialogTitle>
                      <DialogDescription>
                        Fill in the details to create a new quiz.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          value={newQuizTitle}
                          onChange={(e) => setNewQuizTitle(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                          Category
                        </Label>
                        <Input
                          id="category"
                          value={newQuizCategory}
                          onChange={(e) => setNewQuizCategory(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid gri d-cols-4 items-center gap-4">
                        <Label htmlFor="difficulty" className="text-right">
                          Difficulty
                        </Label>
                        <Select
                          value={newQuizDifficulty}
                          onValueChange={setNewQuizDifficulty}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="questions" className="text-right">
                          Questions
                        </Label>
                        <Input
                          id="questions"
                          type="number"
                          value={newQuizQuestions}
                          onChange={(e) => setNewQuizQuestions(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateQuiz}>Create Quiz</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{quiz.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="flex justify-between mb-2">
                        <Badge>{quiz.category}</Badge>
                        <Badge variant="outline">{quiz.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        Questions: {quiz.questions}
                      </p>
                      <p className="text-sm text-gray-500">
                        Participants: {quiz.participants}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(quiz)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openStatsDialog(quiz)}
                      >
                        <BarChart className="mr-2 h-4 w-4" />
                        Stats
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteQuiz(quiz.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}

          {activeTab === "Dashboard" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Quizzes
                  </CardTitle>
                  <List className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{quizzes.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {users.filter((user) => user.status === "active").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +3 from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completion Rate
                  </CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">
                    +5% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg. Score
                  </CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">72%</div>
                  <p className="text-xs text-muted-foreground">
                    +2% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "Results" && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Quiz Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quiz Title</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>{result.quizTitle}</TableCell>
                        <TableCell>{result.userName}</TableCell>
                        <TableCell>{result.score}%</TableCell>
                        <TableCell>{result.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === "Users" && (
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>User Management</CardTitle>
                <Dialog
                  open={isNewUserDialogOpen}
                  onOpenChange={setIsNewUserDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add New User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Fill in the details to create a new user account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={onEditUser?.username || ""}
                          onChange={(e) =>
                            setOnEditUser((prev) => ({
                              ...prev,
                              username: e.target.value,
                            }))
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={onEditUser?.email || ""}
                          onChange={(e) => {
                            setOnEditUser((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }));
                          }}
                          className="col-span-3"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={onEditUser?.password || ""}
                          onChange={(e) => {
                            setOnEditUser((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }));
                          }}
                          className="col-span-3"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                          Role
                        </Label>
                        <Select
                          // value={newUserRole}
                          // onValueChange={setNewUserRole}
                          value={onEditUser?.role || "user"}
                          onValueChange={(value) => {
                            setOnEditUser((prev) => ({
                              ...prev,
                              role: value as "user" | "moderator" | "admin",
                            }));
                          }}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateUser}>Create User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user?.status === "active"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {user?.status.charAt(0).toUpperCase() +
                              user?.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditUserDialog(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateUserStatus(user, true)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Edit Quiz Dialog */}
      <Dialog
        open={isEditQuizDialogOpen}
        onOpenChange={setIsEditQuizDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Quiz</DialogTitle>
            <DialogDescription>
              Update the details of the quiz.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                value={newQuizTitle}
                onChange={(e) => setNewQuizTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category
              </Label>
              <Input
                id="edit-category"
                value={newQuizCategory}
                onChange={(e) => setNewQuizCategory(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-difficulty" className="text-right">
                Difficulty
              </Label>
              <Select
                value={newQuizDifficulty}
                onValueChange={setNewQuizDifficulty}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-questions" className="text-right">
                Questions
              </Label>
              <Input
                id="edit-questions"
                type="number"
                value={newQuizQuestions}
                onChange={(e) => setNewQuizQuestions(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditQuiz}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Dialog */}
      <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quiz Statistics</DialogTitle>
            <DialogDescription>
              Detailed statistics for {currentQuiz?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Total Participants</p>
                <p className="text-2xl font-bold">
                  {currentQuiz?.participants}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Average Score</p>
                <p className="text-2xl font-bold">76%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Completion Rate</p>
                <p className="text-2xl font-bold">89%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Avg. Time Taken</p>
                <p className="text-2xl font-bold">12m 30s</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsStatsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details and role.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={onEditUser?.username || ""}
                onChange={(e) =>
                  setOnEditUser((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={onEditUser?.email || ""}
                onChange={(e) => {
                  setOnEditUser((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>
              <Select
                value={onEditUser?.role || "user"}
                onValueChange={(value) => {
                  setOnEditUser((prev) => ({
                    ...prev,
                    role: value as "user" | "moderator" | "admin",
                  }));
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
