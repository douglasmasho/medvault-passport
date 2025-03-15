import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../../components/common/Header";
import { Brain, BrainCircuit, CircleX } from "lucide-react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Lottie from "lottie-react";
import animation from "../../assets/animation/loadingbrain.json";
import PieChartCustom from "../../components/charts/PieChartCustom";
import BarGraphCustom from "../../components/charts/BarGraphCustom";
import { gradesData } from "../../data/information";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { useAuth } from "../../contexts/authContext/index";
import { Navigate } from "react-router-dom";
import PatientsTable3 from "../../components/users/PatientsTable3";
import Modal from "react-responsive-modal";
import { useDarkMode } from "../../contexts/darkModeContext";
import { nanoid } from "nanoid";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
registerPlugin(FilePondPluginFileValidateType);

const iconStyle = {
  width: "100px",
};

const AnalysisPage = () => {
  const [files, setFiles] = useState([]);
  const [predictedClass, setPredictedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [niifile, setNiifile] = useState(null);
  const [open, setOpen] = useState(false);
  const { isDarkMode } = useDarkMode(); // Use dark mode context
  const [did, setDid] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Set dynamic colors based on the mode
  const backgroundColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const cardBackgroundColor = isDarkMode ? "bg-gray-800" : "bg-gray-100";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-100";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";
  const secondaryTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";

  const { userLoggedIn } = useAuth();

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("currentUser")));
    setDid(nanoid(12));
  }, []);

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${backgroundColor}`}>
      {!userLoggedIn ? (
        <Navigate to="/login" replace={true} />
      ) : (
        <>
          <Header
            title="Grade"
            icon={
              <BrainCircuit style={{ marginRight: "10px", color: "#56BB6E" }} />
            }
          />

          <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            <motion.div
              className={`bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border ${borderColor} ${backgroundColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 1 }}
            >
              {/* Detect Part */}
              <p className={`u-margin-bottom ${textColor}`}>
                Upload a brain MRI image in .nii (t1ce sequence works best) to
                analzye the class of the tumor and visualize the brain image in
                3D. Please note that this feature only available for Gliomas due
                to data constraints.
              </p>
              <div className="grid grid-2 u-margin-bottom-medium">
                <div
                  className={`bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border ${borderColor} center-text ${backgroundColor}`}
                >
                  <h3 className={`bigish-text mt-3 ${textColor}`}>Input</h3>

                  <div className="px-4 py-5 sm:p-6 ">
                    <FilePond
                      files={files}
                      onupdatefiles={setFiles}
                      allowMultiple={false}
                      maxFiles={1}
                      name="files"
                      acceptedFileTypes={[]} // Accept .nii files
                      server={{
                        process: (
                          fieldName,
                          file,
                          metadata,
                          load,
                          error,
                          progress,
                          abort
                        ) => {
                          // Log the file to inspect its structure
                          console.log("File Object:", file);

                          // Determine the actual file
                          const actualFile = file.file || file; // Use file.file if available, else use file directly
                          if (!actualFile) {
                            error("No valid file provided");
                            return;
                          }

                          // Log the actual file
                          console.log("Actual File:", actualFile);

                          // Prepare form data
                          const formData = new FormData();
                          formData.append(
                            "file",
                            actualFile,
                            actualFile.name || "upload"
                          );

                          // Create a new XMLHttpRequest
                          const request = new XMLHttpRequest();

                          // Open the POST request to the FastAPI server
                          request.open("POST", "http://127.0.0.1:8002/predict");

                          // Expect JSON response from the server
                          request.responseType = "json";

                          // Track upload progress
                          request.upload.onprogress = (e) => {
                            progress(e.lengthComputable, e.loaded, e.total);
                          };

                          // Handle the successful response
                          request.onload = function () {
                            if (request.status >= 200 && request.status < 300) {
                              const response = request.response; // JSON response from FastAPI
                              load(response); // Pass response to FilePond's load
                              setPredictedClass(response.prediction);
                              setLoading(false);
                            } else {
                              error("Upload failed");
                              setLoading(false);
                            }
                          };

                          // Handle errors
                          request.onerror = function () {
                            error("Upload failed");
                          };

                          // Send the form data with the file
                          request.send(formData);

                          // Set loading state
                          setLoading(true);

                          return {
                            abort: () => {
                              request.abort();
                              abort();
                            },
                          };
                        },
                      }}
                      labelIdle='Drag & Drop your .nii file or <span class="filepond--label-action">Browse</span>'
                    />
                  </div>
                </div>

                <div
                  className={`bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border ${borderColor} ${backgroundColor}`}
                >
                  <h3 className={`bigish-text mt-3 ml-5 mr-5 ${textColor}`}>
                    Predicted Grade
                  </h3>

                  <div className="px-4 py-5 sm:p-6">
                    {loading ? (
                      <div style={{ textAlign: "center" }}>
                        <p className={`${textColor}`}>
                          Medalgo is processing your image...
                        </p>
                        <Lottie animationData={animation} />
                      </div>
                    ) : predictedClass == "" ? (
                      <div className="center-text">
                        <Brain
                          style={{ color: "#3B82F6" }}
                          size={100}
                          className="u-margin-bottom-small"
                        />
                      </div>
                    ) : (
                      <div>
                        <h3
                          className={`bigger-text capitalize-text ${textColor}`}
                        >
                          {predictedClass === "HGG"
                            ? "High-Grade Glioma"
                            : "Low-Grade Glioma"}
                        </h3>
                        {loggedInUser?.role === "medical" ? (
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto mt-5"
                            onClick={onOpenModal}
                          >
                            Save to Patient
                          </button>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </main>

          <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            <motion.div
              className={`bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border ${borderColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <div className="u-margin-bottom-medium">
                <div
                  className={`${backgroundColor} ${borderColor} bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border p-5`}
                  style={{
                    maxHeight: "400px",
                    overflowY: "scroll",
                    overflowX: "hidden",
                  }}
                >
                  <p className={textColor}>Information Panel</p>
                  {loading ? (
                    <Lottie animationData={animation} />
                  ) : (
                    <div className="">
                      {predictedClass === "" ? (
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
                      ) : (
                        <>
                          <h3
                            className={`bigger-text capitalize-text ${textColor}`}
                          >
                            {gradesData[predictedClass].name}{" "}
                            <span className="blue-text">Information</span>
                          </h3>
                          <p className={`u-margin-bottom-small ${textColor}`}>
                            Sources:
                            {gradesData[predictedClass].sources.map(
                              (item, index) => (
                                <a
                                  href={item.link}
                                  key={index}
                                  target="_blank"
                                  style={{
                                    color: isDarkMode ? "#61DBFB" : "blue",
                                  }}
                                >
                                  {" "}
                                  | {item.name}
                                </a>
                              )
                            )}
                          </p>
                          <h2
                            className={`${textColor} u-margin-bottom-small medium-text`}
                          >
                            What is a {gradesData[predictedClass].name}?
                          </h2>
                          {gradesData[predictedClass].description
                            .split("\n\n")
                            .map((para, index) => (
                              <p
                                className={`u-margin-bottom-small ${textColor}`}
                                key={index}
                              >
                                {para}
                              </p>
                            ))}

                          <h2
                            className={`u-margin-bottom-small mt-10 medium-text ${textColor}`}
                          >
                            Causes
                          </h2>
                          <p className={`u-margin-bottom-small ${textColor}`}>
                            {gradesData[predictedClass].causes}
                          </p>

                          <h2
                            className={`u-margin-bottom-small mt-10 medium-text ${textColor}`}
                          >
                            Symptoms
                          </h2>
                          {gradesData[predictedClass].symptoms.map(
                            (item, index) => (
                              <li className={`pl-5 ${textColor}`} key={index}>
                                {item}
                              </li>
                            )
                          )}
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
          },
        }}
        closeIcon={<CircleX style={{ color: "white" }} />}
      >
        <h2
          className={`text-2xl font-semibold ${textColor} u-margin-bottom-small`}
        >
          Choose Patient
        </h2>
        <PatientsTable3
          grade={predictedClass}
          blob={niifile}
          did={did}
          closeModal={onCloseModal}
        />
      </Modal>
    </div>
  );
};
export default AnalysisPage;
