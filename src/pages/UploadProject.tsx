import React, { useEffect, useState } from "react";
import "../styles/uploadProject.css";
import UploadProjectForm from "../components/uploadProjectFrom";
import { useFirebaseAuth } from "../services/AuthContext";
import { useGetUser } from "../services/useGetUser";
import { CustomUser } from "../models/user";
const UploadProject = () => {
  //const [user, setUser] = useState<User | null>(null)
  const { user } = useFirebaseAuth();
  const [userUpdatet, setUserUpdatet] = useState<boolean>(false);
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);
  async function CallGetUser(userId: string) {
    return await useGetUser(userId);
  }
  useEffect(() => {
    if (user !== null && !userUpdatet) {
      CallGetUser(user.uid).then((response) => setCustomUser(response));
      setUserUpdatet(true);
    }
  }, [customUser, user, userUpdatet]);

  if (customUser !== null && customUser?.professor === true) {
    return (
      <div className="outline">
        <div className="title"> Upload Project </div>
        <UploadProjectForm />
      </div>
    );
  }
  return <div>You must be logged in, and be a professor</div>;
};

export default UploadProject;
