import { useState, useContext } from "react";
import { API_BASE_URL } from "../config";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import ImageEditor from "../components/ImageEditor"; // Import Editor
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";

function Profile() {
  const { user, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username || "");
  const [dob, setDob] = useState(user.dob ? user.dob.split("T")[0] : "");
  const [bio, setBio] = useState(user.bio || "");
  const [file, setFile] = useState(null);

  // Image Editor State
  const [editorOpen, setEditorOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result);
        setEditorOpen(true);
      });
      reader.readAsDataURL(file);
      // Reset input value to allow re-selecting same file
      e.target.value = null;
    }
  };

  const onCropSave = (croppedBlob) => {
    // Create a File object from the Blob
    const croppedFile = new File([croppedBlob], "profile_pic.jpg", {
      type: "image/jpeg",
    });
    setFile(croppedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("dob", dob);
    formData.append("bio", bio);
    if (file) {
      formData.append("profilePic", file);
    }

    try {
      await updateProfile(formData);
      alert("Profile Updated!");
      setFile(null); // Clear pending file
    } catch (error) {
      alert("Update Failed: " + error.message);
    }
  };

  const getProfileImageUrl = (path) => {
    if (!path) return null;
    let cleanPath = path.replace(/\\/g, "/");
    if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
    return `${API_BASE_URL}/${cleanPath}`;
  };

  const profilePicUrl = file
    ? URL.createObjectURL(file) // Show preview of new crop if exists
    : user.profilePic
    ? getProfileImageUrl(user.profilePic)
    : null;

  // Badge Logic
  const badges = user?.badges || [];
  const BADGE_EMOJIS = {
    "Early Bird": "🌅",
    "Weekend Warrior": "⚔️",
    "Streak Master": "🔥",
  };

  const BADGE_DESCRIPTIONS = {
    "Early Bird": "Completed a task before 8 AM",
    "Weekend Warrior": "Completed a task on the weekend",
    "Streak Master": "Maintained a 3+ day streak",
  };

  return (
    <>
      <ImageEditor
        imageSrc={imageSrc}
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={onCropSave}
      />

      <div className="container max-w-4xl mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 md:max-w-[300px] h-fit space-y-6">
            <Card>
              <CardHeader className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4 ring-4 ring-primary/20 cursor-pointer group relative">
                  {profilePicUrl ? (
                    <AvatarImage
                      src={profilePicUrl}
                      alt={user.name}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>@{user.username || "user"}</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground text-sm italic">
                "{bio || "No bio yet..."}"
              </CardContent>
              <CardFooter className="justify-center pb-6">
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                  Level {user.level || 1}
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🏆</span> Trophy Case
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length === 0 ? (
                  <div className="text-center text-muted-foreground py-4 text-sm">
                    No badges yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {badges.map((badge, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center p-2 bg-muted/30 rounded-lg border border-border text-center"
                      >
                        <div className="text-2xl">
                          {BADGE_EMOJIS[badge] || "🎖️"}
                        </div>
                        <div className="font-bold text-xs mt-1">{badge}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Edit Form */}
          <Card className="flex-1 h-fit">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Make changes to your profile here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="@username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a little bit about yourself"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="picture">Change Profile Picture</Label>
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="cursor-pointer"
                  />
                  {file && (
                    <p className="text-sm text-green-600 font-medium">
                      ✨ Image cropped and ready to upload!
                    </p>
                  )}
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Profile;
