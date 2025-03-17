import React, {createContext, useContext, useState} from "react";
const UserContext = createContext();
export const useUser = ()=> useContext(UserContext);

const UserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);

    return ( 
        <UserContext.Provider value={{currentUser, setCurrentUser}}>
            {children}
        </UserContext.Provider>
     );
}
 
export default UserProvider;