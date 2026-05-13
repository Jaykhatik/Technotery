import type { FormDataType } from "../Types/types";

const STORAGE_KEY = "pendingForms";

//Save new failed form into localStorage queue
export const saveOfflineForm = (form: FormDataType): void => {
  const existingForms = getOfflineForms();

  existingForms.push(form);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingForms));
};

//Get all pending offline forms
export const getOfflineForms = (): FormDataType[] => {
  const forms = localStorage.getItem(STORAGE_KEY);

  return forms ? JSON.parse(forms) : [];
};

//Replace old queue with new queue
export const updateOfflineForms = (forms: FormDataType[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
};
