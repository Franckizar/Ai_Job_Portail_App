"use client";
import React from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";

type TeacherFormInputs = {
  email: string;
  password: string;
  address: string;
  phone: string;
  username: string;
  firstName: string;
  lastName: string;
  birthday: string;
  sex: "male" | "female";
 img?: File | null;

};

type TeacherFormProps = {
  type: "create" | "update";
  data?: Record<string, unknown>;
};

const TeacherForm: React.FC<TeacherFormProps> = ({ type, data }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<TeacherFormInputs>({
    defaultValues: {
      email: (data?.email as string) ?? "",
      password: "",
      address: (data?.address as string) ?? "",
      phone: (data?.phone as string) ?? "",
      username: (data?.username as string) ?? "",
      firstName: (data?.firstName as string) ?? "",
      lastName: (data?.lastName as string) ?? "",
      birthday: (data?.birthday as string) ?? "",
      sex: (data?.sex as "male" | "female") ?? "male",
    }
  });

  const onSubmit = (formData: TeacherFormInputs) => {
    // handle submit logic
    alert(`${type === "create" ? "Creating" : "Updating"} teacher: ${formData.firstName} ${formData.lastName}`);
  };

  return (
    <form className="p-4 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="font-semibold mb-2">
        {type === "create" ? "Add Teacher" : "Update Teacher"}
      </h2>
      <InputField
        label="Username"
        name="username"
        type="text"
        defaultValue={data?.username as string || ""}
        register={register}
        error={errors.username}
      />
      <InputField
        label="First Name"
        name="firstName"
        type="text"
        defaultValue={data?.firstName as string || ""}
        register={register}
        error={errors.firstName}
      />
      <InputField
        label="Last Name"
        name="lastName"
        type="text"
        defaultValue={data?.lastName as string || ""}
        register={register}
        error={errors.lastName}
      />
      <InputField
        label="Phone"
        name="phone"
        type="tel"
        defaultValue={data?.phone as string || ""}
        register={register}
        error={errors.phone}
      />
      <InputField
        label="Address"
        name="address"
        type="text"
        defaultValue={data?.address as string || ""}
        register={register}
        error={errors.address}
      />
      {/* Add more fields as needed */}
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default TeacherForm;
