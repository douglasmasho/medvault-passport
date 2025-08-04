import {
  Menu,
  BadgeInfo,
  LayoutDashboard,
  Search,
  BrainCircuit,
  User,
  Sun,
  Moon,
  Users,
  Microscope,
  Settings,
  Bell,
  Home,
  Clock,
  FileQuestion
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/svg/logowhite.svg";
import { ReactComponent as Logo2 } from "../../assets/svg/logoblack.svg";
import { useDarkMode } from "../../contexts/darkModeContext";


const SIDEBAR_ITEMS = [
  {
    name: "Home",
    icon: Home,
    color: "#56BB6E",
    href: "/",
  },
  // { name: "Dashboard", icon: LayoutDashboard, color: "#56BB6E", href: "/overview", submenu: false },
  // { name: "Appointments", icon: Clock, color: "#56BB6E", href: "/appointments", submenu: false },
  { name: "Questionnaires", icon: FileQuestion, color: "#56BB6E", href: "/questionnaires", submenu: false },

];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [subMenuOpen1, setIsSubMenuOpen1] = useState(false);
  const [subMenuOpen2, setIsSubMenuOpen2] = useState(false);
  const [subMenuOpen3, setIsSubMenuOpen3] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(()=>{
    const firstVal = location.pathname.split("/")[1];
    switch(firstVal){
      case "brain": 
      setIsSubMenuOpen1(true)
      break;
      default:
    }

    console.log(location.pathname)
  }, [location])


  const { isDarkMode, toggleDarkMode } = useDarkMode(); // Use dark mode context
  

  // Use bg-white for a light sidebar background in light mode
  const backgroundColor = isDarkMode ? "bg-gray-800" : "u-white-bg";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const hoverColor = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200";
  const hoverColor2 = isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-300";
  const activeColor = isDarkMode ? "bg-gray-700" : "bg-gray-200";
  const activeColor2 = isDarkMode ? "bg-gray-900" : "bg-gray-300";
  const subMenuFunctions = {
    one: {
      set: setIsSubMenuOpen1,
      state: subMenuOpen1
    },
    two: {
      set: setIsSubMenuOpen2,
      state: subMenuOpen2
    },
    three: {
      set: setIsSubMenuOpen3,
      state: subMenuOpen3
    }
  }

  const subMenuItems = {
    // brain
    one: [
      { icon: Search ,
        href:"/brain/detect",
        name: "Detect"
      },
      {
        icon: BrainCircuit,
        href: "/brain/grade",
        name: "Grade"
      },
    ],
    //breast
    two: [
      { icon: Search ,
        href:"/breast/detect",
        name: "Detect"
      },
    
    ],
    //skin
    three: [
      { icon: Search ,
        href:"/detect",
        name: "Detect"
      },
      {
        icon: Microscope,
        href: "/breast/biopsy",
        name: "Biopsy Analysis"
      },
    ]
      
     
  }


  return (
    <motion.div
      className={`relative z-10 sidenav transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div
        className={`h-full  ${backgroundColor} bg-opacity-50 backdrop-blur-md p-4 flex flex-col ${borderColor} border-r`}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Toggle Sidebar Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-full ${hoverColor} transition-colors max-w-fit`}
          >
            <Menu size={24} className={textColor} />
          </motion.button>

          {/* Logo */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                {isDarkMode ? (
                  <Logo style={{ width: "120px" }} />
                ) : (
                  <Logo2 style={{ width: "120px" }} />
                )}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${hoverColor} transition-colors max-w-fit`}
          ></motion.button>
        </div>

        {/* Sidebar Navigation */}



        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => !item.submenu ? (
            <Link key={item.href} to={item.href}>
              <motion.div
                className={`flex items-center p-4 text-sm font-medium rounded-lg ${hoverColor} transition-colors mb-2 ${location.pathname === item.href ? activeColor : ""}`}
              >
                <item.icon
                  size={20}
                  style={{ color: item.color, minWidth: "20px" }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className={`ml-4 whitespace-nowrap ${textColor}`}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ) : 

        
          <motion.div
            className={`flex p-4 text-sm font-medium rounded-lg ${hoverColor} transition-colors mb-2 transition-all duration-100 ease-in-out ${
              subMenuFunctions[item.number].state ? "h-64" : "h-20"
            }`}
            style={{flexDirection: "column", cursor: "pointer"}}
            animate={{ height: subMenuFunctions[item.number].state ? 100 : 20 }}
            onClick={()=>{
              subMenuFunctions[item.number].set(!subMenuFunctions[item.number].state)
            }}
          >
            <div style={{display: "flex", alignItems: "center", marginBottom: "5px"}} >
            <item.icon
              size={20}
              style={{ color: item.color, minWidth: "20px" }}
            />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  className={`ml-4 whitespace-nowrap ${textColor}`}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>
            </div>
            
            {/* submenu items */}
            <AnimatePresence
            >
              {
                subMenuFunctions[item.number].state &&
                subMenuItems[item.number].map(el=>(
                  <Link key={el.href} to={el.href} onClick={(e)=>{
                    e.stopPropagation()
                  }}>
                  <motion.div style={{display: "flex", alignItems: "center", marginTop: "5px", marginLeft: "5px", padding: "8px", borderRadius: "10px"}} className={`${hoverColor2} ${location.pathname === el.href && isSidebarOpen ? activeColor2 : ""}`}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}

                  >
                  <el.icon
                    size={15}
                    style={{ color: item.color, minWidth: "20px" }}
                  />
                    {isSidebarOpen && (
                      <motion.span
                        className={`ml-4 whitespace-nowrap ${textColor}`}
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        {el.name}
                      </motion.span>
                    )}
                    </motion.div>
                  </Link>
                  
                ))
         
              }
            </AnimatePresence>
          </motion.div>
          )}



          {/* <motion.div
            className={`flex items-center p-4 text-sm font-medium rounded-lg ${hoverColor} transition-colors mb-2`}
            onClick={toggleDarkMode}
            style={{ cursor: "pointer" }}
          >
            {isDarkMode ? (
              <Sun size={20} style={{ color: "#56BB6E", minWidth: "20px" }} />
            ) : (
              <Moon size={20} style={{ color: "#56BB6E", minWidth: "20px" }} />
            )}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  className={`ml-4 whitespace-nowrap ${textColor}`}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div> */}

          <div style={{position: "absolute", bottom: "50px"}}>
          <motion.div
            className={`flex items-center p-4 text-sm font-medium rounded-lg ${hoverColor} transition-colors mb-2`}
            // onClick={toggleDarkMode}
            style={{ cursor: "pointer" }}
          >
          
            <Bell size={20} className="mr-1" style={{ color: "#56BB6E", minWidth: "20px" }} /> <span className="notifications-span">3</span>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  className={`ml-4 whitespace-nowrap ${textColor}`}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                 Notifications 
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>


          <motion.div
            className={`flex items-center p-4 text-sm font-medium rounded-lg ${hoverColor} transition-colors mb-2`}
            onClick={()=>{
              navigate("/settings")
            }}
            style={{ cursor: "pointer" }}
          >
          
            <Settings size={20} style={{ color: "#56BB6E", minWidth: "20px" }} />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  className={`ml-4 whitespace-nowrap ${textColor}`}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                 Settings
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
          </div>
          
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
