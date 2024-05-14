import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "react-simple-snackbar";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const CreateBlog = () => {
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState();
  const [imageUpload, setImageUpload] = useState();
  const [userData, setUserData] = useState();
  const [loadingData, setLoadingData] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);
    setUserData(parsedUser);
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  const options = {
    position: "bottom-right",
    style: {
      backgroundColor: "gray",
      border: "2px solid lightgreen",
      color: "white",
      fontFamily: "Menlo, monospace",
      fontSize: "20px",
      textAlign: "center",
    },
    closeStyle: {
      color: "lightcoral",
      fontSize: "16px",
    },
  };
  const [openSnackbar] = useSnackbar(options);

  const onSubmit = (data) => {
    setLoading(true);
    uploadImage(data);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImageUpload(file);

    const reader = new FileReader();
    reader.onloadend = function () {
      setImage({ image: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = (data) => {
    let formData = new FormData();
    formData.append("image", imageUpload);
    formData.append("name", imageUpload.name);
    formData.append("userid", userData.id.toString());

    const config = {
      headers: { "content-type": "multipart/form-data" },
      withCredentials: true,
    };

    axios
      .post("https://api.ayushsharma.co.in/api/upload-image", formData, config)
      .then((response) => {
        setLoadingData(false);
        setImageData(response?.data?.url);
        {console.log("Hi" ,response?.data?.url)}
        createBlogPost(data, response?.data?.url);
        openSnackbar("Image uploaded successfully");
      })
      .catch((error) => {
        setLoadingData(false);
        console.error("Error uploading image:", error);
      });
  };

  const createBlogPost = (data, imageUrl) => {
    const body = {
      ...data,
      image: imageUrl,
      userid: userData.id.toString(),
    };

    axios
      .post("https://api.ayushsharma.co.in/api/post", body, {
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false);
        navigate("/personal");
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error creating post:", error);
      });
  };

  return (
    <>
      <div className="max-w-screen-md mx-auto p-5">
        <div className="text-center mb-16">
          <p className="mt-4 text-sm leading-7 text-gray-500 font-regular uppercase">
            Create your Blog
          </p>
          <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
            Express your <span className="text-indigo-600">Feelings</span>
          </h3>
        </div>

        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Title
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="title"
                name="title"
                autoComplete="off"
                {...register("title", {
                  required: true,
                })}
              />
              {errors.title && errors.title.type === "required" && (
                <p className="text-red-500 text-xs italic">
                  Please fill out this field.
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 items-center lg:items-start mb-6">
            <div className="w-full px-3">
              <label title="click to select a picture">
                <input
                  accept="image/*"
                  className="why"
                  id="banner"
                  type="file"
                  name="image"
                  onChange={handleImage}
                  // visibility="hidden"
                />
                <div className="flex flex-col">
                  <div className="pb-2">Select Image</div>

                  {image ? (
                    <div className="pt-4">
                      <div>
                        <img
                          className="-object-contain -mt-8 p-5 w-1/2"
                          src={image ? image.image : ""}
                          alt=""
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="pb-5">
                      <img
                        src="/upload-image.svg"
                        style={{ background: "#EFEFEF" }}
                        className="h-full w-48"
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Description
              </label>
              <textarea
                rows="10"
                name="desc"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                {...register("desc", {
                  required: true,
                })}
              ></textarea>
              {errors.desc && errors.desc.type === "required" && (
                <p className="text-red-500 text-xs italic">
                  Please fill out this field.
                </p>
              )}
            </div>
            <div className="flex justify-between w-full px-3">
              <button
                className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
                type="submit"
                disabled={loading ? true : false}
              >
                {loading ? "Loading..." : "Create Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateBlog;
