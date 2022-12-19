import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { mycontext } from "../contextApi/Authcontext";
const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [signUpError, setSignUPError] = useState("");
  const { signup, updateuser, logout } = useContext(mycontext);
  const neviget = useNavigate();
  const handleSignup = (data) => {
    setSignUPError("");
    const email = data.email;
    const password = data.password;
    const name = data.name;
    console.log(name);

    signup(email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        const userName = {
          displayName: name,
        };

        const storeuserinfoInDB = {
          name,
          email,
          totalpoint: 0,
          totalQuize: 0,
          totalWrong: 0,
        };

        updateuser(userName)
          .then((result) => {
            logout()
              .then(() => {
                neviget('/login')
              })
              .catch(() => {});
            fetch(`http://localhost:5000/storeuser`, {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(storeuserinfoInDB),
            })
              .then((res) => res.json())
              .then((result) => {
                console.log(result);
              });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="h-[800px] flex justify-center items-center">
      <div className="w-96 p-7">
        <h2 className="text-xl text-center">Sign Up</h2>
        <form onSubmit={handleSubmit(handleSignup)}>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Name is Required",
              })}
              className="input input-bordered w-full max-w-xs"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: true,
              })}
              className="input input-bordered w-full max-w-xs"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be 6 characters long",
                },
                pattern: {
                  value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/,
                  message:
                    "Password must have uppercase, number and special characters",
                },
              })}
              className="input input-bordered w-full max-w-xs"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <input
            className="btn btn-accent w-full mt-4"
            value="Register"
            type="submit"
          />
          {signUpError && <p className="text-red-600">{signUpError}</p>}
        </form>
        <p>
          Already have an account{" "}
          <Link className="text-secondary" to="/login">
            Please Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
