import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../../components/common/Header";
import { Search, Brain, CircleX } from "lucide-react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Lottie from "lottie-react";
import animation from "../../assets/animation/loadingbrain.json";
import BarGraphCustom from "../../components/charts/BarGraphCustom";
import { tumorData } from "../../data/information";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { useAuth } from "../../contexts/authContext/index";
import { Navigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { addDoc, setDoc, doc } from "firebase/firestore";
import { Modal } from "react-responsive-modal";
import PatientsTable2 from "../../components/users/PatientsTable2";
import { useDarkMode } from "../../contexts/darkModeContext";
import { nanoid } from "nanoid";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
registerPlugin(FilePondPluginFileValidateType);

const iconStyle = {
  width: "100px",
};

const convertToData = (object) => {
  const labelArr = [];
  const dataArr = [];
  for (const x in object) {
    labelArr.push(x);
    dataArr.push(object[x]);
  }
  return {
    labels: ["Glioma", "Meningioma", "No Tumor", "Pituitary"],
    datasets: [
      {
        label: "",
        data: dataArr,
        backgroundColor: "#56BB6E",
      },
    ],
  };
};
// https://randomuser.me/api/portraits/lego/3.jpg
const DetectPage = () => {
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [classifyRes, setClassifyRes] = useState(null);
  const [tumorType, setTumorType] = useState("");
  const [open, setOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const { isDarkMode } = useDarkMode(); // Use dark mode context
  const [did, setDid] = useState("");

  // Set dynamic colors based on the mode
  const backgroundColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const cardBackgroundColor = isDarkMode ? "bg-gray-900" : "bg-gray-100";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";
  const secondaryTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("currentUser")));
    setDid(nanoid(12));
  }, []);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const { userLoggedIn } = useAuth();

  async function downloadBlobFromUrl() {
    try {
      const response = await fetch(url);

      // Check if the fetch was successful
      if (!response.ok) {
        throw new Error(`Failed to fetch blob: ${response.statusText}`);
      }

      // Convert the response to a Blob object
      const blob = await response.blob();

      // Infer the file extension from the blob's MIME type
      const mimeType = blob.type;
      const extension = getFileExtension(mimeType);

      // Create a link element
      const link = document.createElement("a");

      // Create an object URL from the blob
      const blobUrlObject = URL.createObjectURL(blob);

      // Set the href of the link to the object URL
      link.href = blobUrlObject;

      // Set the download attribute with the correct file name and extension
      link.download = `${did}${extension ? "." + extension : ""}`;

      // Programmatically click the link to trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up by revoking the object URL and removing the link element
      URL.revokeObjectURL(blobUrlObject);
      document.body.removeChild(link);

      console.log("Download triggered successfully!");
    } catch (error) {
      console.error("Error fetching or downloading blob:", error);
    }
  }

  // Helper function to get the file extension from MIME type
  function getFileExtension(mimeType) {
    const mimeExtensions = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "application/pdf": "pdf",
      "text/plain": "txt",
      "application/json": "json",
      "application/zip": "zip",
      "audio/mpeg": "mp3",
      "video/mp4": "mp4",
      // Add more mappings as needed
    };

    return mimeExtensions[mimeType] || "";
  }

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${backgroundColor}`}>
      {!userLoggedIn && !loggedInUser ? (
        <Navigate to="/login" replace={true} />
      ) : (
        <>
          <Header
            title="Detect"
            icon={<Search style={{ marginRight: "10px" }} color="#56BB6E" />}
          />

          <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            <motion.div
              className={`${cardBackgroundColor} bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border ${borderColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 1 }}
            >
              {/* Detect Part */}
              <p className={`u-margin-bottom ${secondaryTextColor}`}>
                Upload a brain MRI image to detect the presence of a tumor and
                more information about the tumor if it exists
              </p>
              <div className="grid grid-2 u-margin-bottom-medium">
                <div
                  className={`${cardBackgroundColor} bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border ${borderColor} center-text`}
                >
                  <h3 className={`bigish-text mt-3 ${textColor}`}>Input</h3>

                  <div className="px-4 py-5 sm:p-6 ">
                    <FilePond
                      files={files}
                      onupdatefiles={setFiles}
                      allowMultiple={false}
                      maxFiles={1}
                      name="files"
                      acceptedFileTypes={[
                        "image/jpg",
                        "image/jpeg",
                        "image/png",
                      ]}
                      allowFileTypeValidation
                      labelFileTypeNotAllowed
                      server={{
                        process: (
                          fieldName,
                          file,
                          metadata,
                          load,
                          error,
                          progress,
                          abort,
                          transfer,
                          options
                        ) => {
                          const formData = new FormData();
                          formData.append("file", file);
                          console.log(file);

                          const request = new XMLHttpRequest();
                          const request2 = new XMLHttpRequest();

                          request.open("POST", "http://127.0.0.1:8000/predict");

                          request2.open(
                            "POST",
                            "http://127.0.0.1:8001/predict"
                          );

                          request.responseType = "blob";

                          request.upload.onprogress = (e) => {
                            progress(e.lengthComputable, e.loaded, e.total);
                          };

                          request.onload = function () {
                            if (request.status >= 200 && request.status < 300) {
                              // the load method accepts either a string (id) or an object
                              const blob = request.response;
                              const imgUrl = URL.createObjectURL(blob);
                              load(imgUrl);
                              setUrl(imgUrl);
                              setLoading(false);
                            } else {
                              error("oh no");
                              setLoading(false);
                            }
                          };

                          request2.onload = async function () {
                            if (
                              request2.status >= 200 &&
                              request2.status < 300
                            ) {
                              const respObj = await JSON.parse(
                                request2.response
                              );
                              setClassifyRes(respObj);
                              setTumorType(respObj.predicted_class);
                              setLoading2(false);
                            } else {
                              error("oh no");
                            }
                          };

                          request.send(formData);
                          request2.send(formData);
                          setLoading(true);
                          setLoading2(true);
                          return {
                            abort: () => {
                              request.abort();
                              request2.abort();
                              abort();
                            },
                          };
                        },
                      }}
                      labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
                    />
                  </div>
                </div>

                <div
                  className={`${cardBackgroundColor} bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border ${borderColor} center-text`}
                >
                  <h3 className={`bigish-text mt-3 ${textColor}`}>Output</h3>

                  <div className="px-4 py-5 sm:p-6">
                    {loading ? (
                      <div style={{ textAlign: "center" }}>
                        <p className={textColor}>
                          Medalgo is processing your image...
                        </p>
                        <Lottie animationData={animation} />
                      </div>
                    ) : url == "" ? (
                      <Brain
                        style={{ color: "#3B82F6" }}
                        size={100}
                        className="u-margin-bottom-small"
                      />
                    ) : (
                      <div>
                        <img
                          src={url}
                          className="u-margin-bottom"
                          alt=""
                          style={{ width: "100%", borderRadius: "20px" }}
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200 w-full sm:w-auto mx-5"
                            onClick={downloadBlobFromUrl}
                          >
                            Download Image
                          </button>
                          {loggedInUser?.role === "medical" ? (
                            <button
                              className="bg-green-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200 w-full sm:w-auto mx-5"
                              onClick={onOpenModal}
                            >
                              Save to Patient
                            </button>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </main>

          <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            <motion.div
              className={`${cardBackgroundColor} bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border ${borderColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <div className="grid grid-2 u-margin-bottom-medium">
                <div
                  className={`${cardBackgroundColor} bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border ${borderColor} p-5`}
                >
                  <p className={textColor}>Major class probabilities</p>

                  {loading2 ? (
                    <Lottie animationData={animation} />
                  ) : classifyRes ? (
                    <>
                      <h3
                        className={`bigger2-text capitalize-text ${textColor}`}
                      >
                        {classifyRes.predicted_class}{" "}
                        <span className="blue-text">
                          {classifyRes.class_probabilities[
                            classifyRes.predicted_class
                          ].toFixed(2)}
                          %
                        </span>
                      </h3>
                      <BarGraphCustom
                        dataObj={convertToData(classifyRes.class_probabilities)}
                      />
                    </>
                  ) : (
                    <div
                      className="center-text"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Brain
                        style={{ color: "#3B82F6" }}
                        size={100}
                        className="u-margin-bottom-small"
                      />
                    </div>
                  )}
                </div>

                <div
                  className={`${cardBackgroundColor} bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border ${borderColor} p-5`}
                  style={{
                    maxHeight: "400px",
                    overflowY: "scroll",
                    overflowX: "hidden",
                  }}
                >
                  <p className={textColor}>Information Panel</p>
                  {loading2 ? (
                    <Lottie animationData={animation} />
                  ) : (
                    <div className="">
                      {tumorType === "" ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <Brain
                            style={{ color: "#3B82F6" }}
                            size={100}
                            className="u-margin-bottom-small"
                          />
                        </div>
                      ) : tumorType === "notumor" ? (
                        <h3
                          className={`bigger-text capitalize-text ${textColor}`}
                        >
                          All good here
                        </h3>
                      ) : (
                        <>
                          <h3
                            className={`bigger-text capitalize-text ${textColor}`}
                          >
                            {tumorData[tumorType].name}{" "}
                            <span className="blue-text">Information</span>
                          </h3>
                          <p
                            className={`u-margin-bottom-small ${secondaryTextColor}`}
                          >
                            Sources:
                            {tumorData[tumorType].sources.map((item, index) => (
                              <a
                                href={item.link}
                                key={index}
                                target="_blank"
                                style={{ color: "#61DBFB" }}
                              >
                                {" "}
                                | {item.name}
                              </a>
                            ))}
                          </p>
                          <h2
                            className={`u-margin-bottom-small medium-text ${textColor}`}
                          >
                            What is a {tumorData[tumorType].name}?
                          </h2>
                          {tumorData[tumorType].description
                            .split("\n\n")
                            .map((para, index) => (
                              <p
                                className={`u-margin-bottom-small ${secondaryTextColor}`}
                                key={index}
                              >
                                {para}
                              </p>
                            ))}

                          <h2
                            className={`u-margin-bottom-small mt-10 medium-text ${textColor}`}
                          >
                            Types
                          </h2>
                          {tumorData[tumorType].types.map((item, index) => (
                            <li
                              className={`pl-5 ${secondaryTextColor}`}
                              key={index}
                            >
                              {item}
                            </li>
                          ))}

                          <h2
                            className={`u-margin-bottom-small mt-10 medium-text ${textColor}`}
                          >
                            Symptoms
                          </h2>
                          <p
                            className={`u-margin-bottom-small ${secondaryTextColor}`}
                          >
                            {tumorData[tumorType].symptomsHeader}
                          </p>
                          {tumorData[tumorType].symptoms.map((item, index) => (
                            <li
                              className={`pl-5 ${secondaryTextColor}`}
                              key={index}
                            >
                              {item}
                            </li>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </main>
        </>
      )}

      <Modal
        open={open}
        onClose={onCloseModal}
        center
        classNames={{
          modal: `${cardBackgroundColor} bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border ${borderColor}`,
        }}
        styles={{
          modal: {
            maxWidth: "100%",
            // width: "80%"
          },
        }}
        closeIcon={<CircleX style={{ color: "white" }} />}
      >
        <h2 className={`text-2xl  ${textColor} u-margin-bottom-small`}>
          Choose Patient
        </h2>
        <PatientsTable2
          class_predictions={classifyRes}
          predicted_class={tumorType}
          url={url}
          closeModal={onCloseModal}
          did={did}
        />
      </Modal>
    </div>
  );
};
export default DetectPage;
