import api from "../Services/api";
import type { FormDataType } from "../Types/types";
import { getOfflineForms, updateOfflineForms } from "./storage";

export const syncOfflineForms = async (): Promise<void> => {
  const pendingForms = getOfflineForms();//This reads all failed offline forms from localStorage.

  if (pendingForms.length === 0) {//If queue is empty So function stops immediately
    return;
  }

  const remainingForms: FormDataType[] = [];//This array stores Failed forms during sync

  for (const form of pendingForms) {
    try {
      await api.post("/posts", form);

      console.log("Synced:", form);
    } catch (error) {
      remainingForms.push(form);
    }
  }

  updateOfflineForms(remainingForms);//Only failed forms should remain
};
