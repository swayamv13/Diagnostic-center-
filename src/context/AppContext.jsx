import { createContext, useState, useEffect } from "react";
import { healthPackages } from '../assets/assets';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const AppContext = createContext({
    // Initial structure
    tests: [],
    getTestById: () => null,
    user: null, // User object from Firebase
    userData: null, // Data from Firestore
    setUser: () => { },
    token: false,
    setToken: () => { },
    familyMembers: [],
    addFamilyMember: () => { }
});

const AppContextProvider = (props) => {

    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(false);
    const [familyMembers, setFamilyMembers] = useState([]);

    // Monitor Auth State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setToken(true);
                // Fetch User Data
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                    if (docSnap.data().familyMembers) {
                        setFamilyMembers(docSnap.data().familyMembers);
                    }
                } else {
                    // Create basic user doc if not exists
                    const basicData = {
                        name: currentUser.displayName,
                        email: currentUser.email,
                        phone: currentUser.phoneNumber,
                        image: currentUser.photoURL
                    };
                    await setDoc(docRef, basicData);
                    setUserData(basicData);
                }
            } else {
                setUser(null);
                setToken(false);
                setUserData(null);
                setFamilyMembers([]);
            }
        });
        return () => unsubscribe();
    }, []);

    // Helper function to find a specific test/package
    const getTestById = (id) => {
        return healthPackages.find(test => test.id === id);
    };

    const addFamilyMember = async (newMember) => {
        if (!user) return;
        const updatedMembers = [...familyMembers, { ...newMember, id: Date.now() }];
        setFamilyMembers(updatedMembers);

        // Sync with Firestore
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, { familyMembers: updatedMembers }, { merge: true });
    };

    const value = {
        healthPackages,
        getTestById,
        user,
        userData,
        setUser,
        token,
        setToken,
        familyMembers,
        addFamilyMember,
        setUserData,
        logout: async () => {
            await auth.signOut();
            setToken(false);
            setUser(null);
            setUserData(null);
        }
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;