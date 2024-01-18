import { getDownloadURL, uploadBytesResumable, ref, list, getMetadata } from "firebase/storage";
import { initializeApp } from "firebase/app"; // Correct import statement
import { getStorage } from "firebase/storage";
import sha256 from "crypto-js/sha256";

// Initialize Firebase outside the functions to avoid reinitializing it multiple times
const initializeFirebase = (fireConfig) => {
    const firebaseConfig = {
        apiKey: fireConfig.apiKey,
        authDomain: fireConfig.authDomain,
        projectId: fireConfig.projectId,
        storageBucket: fireConfig.storageBucket,
        messagingSenderId: fireConfig.messagingSenderId,
        appId: fireConfig.appId,
        measurementId: fireConfig.measurementId
    };

    return initializeApp(firebaseConfig);
};

export const uploadFile = (file, fireConfig) => {
    const app = initializeFirebase(fireConfig);
    const storage = getStorage(app);

    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No file provided");
            return;
        }

        const storageRef = ref(storage, `/files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // You can handle progress here if needed
                // const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            },
            (err) => {
                console.error("Upload error:", err);
                reject(err);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((url) => {
                        const hashurl = hashUrl(url);
                        console.log("hashedUrl:",hashurl);
                        resolve(hashurl);
                    })
                    .catch((err) => {
                        console.error("Error getting download URL:", err);
                        reject(err);
                    });
            }
        );
    });
};

const hashUrl = (url) => {
    const hashedUrl = sha256(url).toString();
    return hashedUrl;
};

export const fetchUploadedFiles = async (fireConfig) => {
    const app = initializeFirebase(fireConfig);
    const storage = getStorage(app);

    try {
        const storageRef = ref(storage, '/files/');
        const filesList = await list(storageRef);

        const filesArray = await Promise.all(filesList.items.map(async (fileRef) => {
            const metadata = await getMetadata(fileRef);
            const downloadURL = await getDownloadURL(fileRef);
            const urlHash = hashUrl(downloadURL);
            return [ urlHash, downloadURL, metadata.timeCreated ];
        }));

        return filesArray;
    } catch (error) {
        console.error('Error fetching uploaded files:', error);
        return error;
    }
};
