import * as Yup from "yup";

export const initialValue = {
  title: "",
  description: "",
  amount: "",
  date: null,
};

export const schemaValue = Yup.object().shape({
  title: Yup.string()
    .required("Title is required"),
  description: Yup.string()
    .required("Description is required")
    .min(3, "Description should be minimum 3 characters long"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be a positive number")
    .min(1, "Amount must be at least 1"),
    date: Yup.string().nullable()
});
