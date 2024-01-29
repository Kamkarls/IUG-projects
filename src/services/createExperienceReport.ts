import {
  addDoc,
  arrayUnion,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getDocs,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import firebase, { db } from "./firebaseConfig";
import { getAuth } from "firebase/auth";
import { allowedLocations, allowedStudyFields } from "../models/allowedValues";
import { useGetUser } from "./useGetUser";

async function CallGetUser(userId: string) {
  return await useGetUser(userId);
}

const storeExperienceReport = async (
  title: string,
  shortTitle: string,
  studyField: string,
  location: string,
  year: number,
  description: string,
  summaryDescription: string,
  projectId: string | undefined,
  studentId: string
) => {
  const customUser = await CallGetUser(studentId);
  if (customUser !== null && customUser.professor === false) {
    const docRef = await addDoc(collection(db, "experienceReport"), {
      title: title,
      shortTitle: shortTitle,
      studyField: studyField,
      location: location,
      year: year,
      description: description,
      summaryDescription: summaryDescription,
      studentId: studentId,
      projectId: projectId,
    });

    const queryGetUser: CollectionReference<DocumentData> = collection(
      db,
      "userProfile"
    );
    const q = query(queryGetUser, where("userID", "==", studentId));
    const userProfileSnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    if (!userProfileSnapshot.empty) {
      const userRef = doc(db, "userProfile", userProfileSnapshot.docs[0].id);
      await updateDoc(userRef, {
        "contributionIds.experienceID": arrayUnion(docRef.id),
      });
      console.log(userProfileSnapshot);
    }
  }
};

export default async function createExperienceReport(
  title: string,
  shortTitle: string,
  studyField: string,
  location: string,
  year: number,
  description: string,
  summaryDescription: string,
  projectId?: string
) {
  const auth = getAuth(firebase);
  if (auth.currentUser?.getIdToken()) {
    if (
      allowedLocations.includes(location) &&
      allowedStudyFields.includes(studyField)
    ) {
      storeExperienceReport(
        title,
        shortTitle,
        studyField,
        location,
        year,
        description,
        summaryDescription,
        projectId ?? "",
        await auth.currentUser.uid
      ).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        throw alert(errorCode + " " + errorMessage);
      });
    } else {
      console.log("not valid location or studyfield");
    }
  }
}
