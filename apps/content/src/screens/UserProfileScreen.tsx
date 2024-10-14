import { useCallback, useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { postImage } from "@/utils/apis/Image";
import { AuthContext } from "@/context/authen";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuizAppAPI } from "@/utils/apis/QuizAppAPI";
import { toast } from "react-toastify";

export default function UserProfileScreen() {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const { userInfo } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [editUsername, setUserName] = useState<string>(userInfo?.username);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]!));
  };

  const handleConfirm = useCallback(async () => {
    if (image) {
      await postImage({ image });
    }

    if (!editMode) return;

    try {
      const req = await QuizAppAPI.updateProfile({
        username: editUsername,
        currentPassword,
        newPassword,
      });

      if (req.message) {
        toast(req.message, {
          type: "info",
          position: "bottom-right",
          autoClose: 750,
          onClose: () => {
            window.location.reload();
          },
        });
        setIsDialogOpen(false);
        return;
      }
    } catch (e) {
      toast(e.response.data.error, {
        type: "error",
        position: "bottom-right",
        autoClose: 750,
      });
      return;
    }
  }, [currentPassword, editMode, editUsername, image, newPassword]);

  const handleSaveChanges = () => {
    if (editMode) {
      setIsDialogOpen(true);
      return;
    }
  };

  const handleEditUserInfo = (newValue: string) => {
    if (newValue === userInfo?.username) {
      setEditMode(false);
      return;
    }
    setEditMode(true);
    setUserName(newValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-300 to-light-blue-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            Manage your account settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-8">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  className="w-24 h-24 object-cover "
                  src={preview ? preview : `${userInfo?.userData?.imgUrl}`}
                  alt="User avatar"
                />
                <AvatarFallback>
                  {userInfo?.username
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label
                  htmlFor="avatar-upload"
                  className="cursor-pointer text-sm font-medium text-primary hover:underline"
                >
                  Change Avatar
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  //limit file size
                  //onChange={(e) => {
                  //  if (e.target.files[0].size > 5000000) {
                  //    alert("File is too big!");
                  //    e.target.value = "";
                  //  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">Username</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  value={editMode ? editUsername : userInfo?.username || ""}
                  onChange={(e) => handleEditUserInfo(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={userInfo?.email || ""}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="notifications" />
                <Label htmlFor="notifications">Enable notifications</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => {
                  if (!e.target.value.length) {
                    setEditMode(false);
                    setNewPassword("");
                    return;
                  }
                  setEditMode(true);
                  setNewPassword(e.target.value);
                }}
              />
            </div>

            {editMode && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Current password is required to save changes to your profile.
                </AlertDescription>
              </Alert>
            )}

            <Button
              className={`w-full ${editMode ? "bg-primary" : "bg-gray-500"}`}
              onClick={handleSaveChanges}
              type="button"
            >
              Save Changes
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Password</DialogTitle>
            <DialogDescription>
              Please enter your current password to save the changes to your
              profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Current Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!currentPassword}
              type="button"
            >
              Confirm Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
