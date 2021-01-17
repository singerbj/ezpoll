import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import { customAlphabet } from 'nanoid';

const nanoId = customAlphabet('123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

// Configure Firebase.
const firebaseConfig = {
    apiKey: 'AIzaSyAtcu9TOKdeQMdXAUG2iDYcEY9QnJrHwjo',
    authDomain: 'ezpoll-69d61.firebaseapp.com',
    projectId: 'ezpoll-69d61',
    storageBucket: 'ezpoll-69d61.appspot.com',
    messagingSenderId: '902384455443',
    appId: '1:902384455443:web:724561b9e2bfc3568854e6',
    measurementId: 'G-MY9E8H4C0X',
};

// Initialize Firebase App
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const functions = firebase.functions();
const auth = firebase.auth();
if (window.location.hostname.indexOf('localhost') > -1) {
    console.warn('Using local firebase emulators...');
    db.useEmulator('localhost', 8080);
    functions.useEmulator('localhost', 5001);
    auth.useEmulator('http://localhost:9099/');
}

// track watchers to allow for unsubbing
const watchMap = {};

// const snapshotToArray = (snapshot) => {
//     const returnArr = [];
//     snapshot.forEach((childSnapshot) => {
//         const item = childSnapshot.data();
//         item.id = childSnapshot.id;
//         returnArr.push(item);
//     });
//     return returnArr;
// };

export const onAuthStateChanged = (callback) => {
    firebase.auth().onAuthStateChanged(callback);
};

export const getCurrentUser = () => firebase.auth().currentUser;

export const loginAnonymously = async () => {
    let res;
    try {
        if (!getCurrentUser()) {
            res = await firebase.auth().signInAnonymously();
        }
    } catch (e) {
        console.error(e);
    }
    return res;
};

export const logoutOfFirebase = () => {
    Object.keys(watchMap).forEach((docId) => {
        watchMap[docId]();
    });
    firebase.auth().signOut();
};

export const watchDoc = async (collection, docId, onSnapShot, onError) => {
    const doc = db.collection(collection).doc(docId);
    if (watchMap[`${collection}-${docId}`]) {
        console.log(`Unsubbing from doc: ${collection}/${docId}`);
        watchMap[`${collection}-${docId}`]();
    }
    const unsub = doc.onSnapshot((docUpdate) => {
        if (docUpdate.data()) {
            onSnapShot({ id: docUpdate.id, ...docUpdate.data() });
        } else {
            onSnapShot();
        }
    }, onError);
    watchMap[`${collection}-${docId}`] = unsub;
};

export const getPoll = async (pollId) => {
    return await db.collection('polls').doc(pollId).get();
};

export const savePoll = async (pollData) => {
    let validIdFound = false;
    let pollId;
    let pollRef;
    await db.runTransaction(async (t) => {
        while (!validIdFound) {
            pollId = nanoId();
            pollRef = db.collection('polls').doc(pollId);
            // eslint-disable-next-line no-await-in-loop
            const pollDoc = await t.get(pollRef);
            if (!pollDoc.exists) {
                validIdFound = true;
            }
        }
        t.set(pollRef, pollData);
    });
    return pollId;
};

export const vote = async (pollId, uid, answerId) => {
    // TODO: change rules to only allow updates to lastVote and votes object [uid -> answerId]

    const pollRef = db.collection('polls').doc(pollId);
    const updateData = {
        lastVote: Date.now(),
    };
    updateData[`votes.${uid}`] = answerId;
    return await pollRef.update(updateData);
};

// export const getCurrentUserData = async () => {
//     return await db.collection('userData').doc(firebase.auth().currentUser.uid).get();
// };

// export const createMatch = async () => {
//     const createMatchFunc = functions.httpsCallable('createMatch');
//     const result = await createMatchFunc();
//     return result;
// };
// export const joinMatch = async (matchId) => {
//     const joinMatchFunc = functions.httpsCallable('joinMatch');
//     const result = await joinMatchFunc(matchId);
//     return result;
// };

// export const cancelMatch = async (matchId) => {
//     const cancelMatchFunc = functions.httpsCallable('cancelMatch');
//     const result = await cancelMatchFunc(matchId);
//     return result;
// };

// export const getCurrentMatch = async () => {
//     const { uid } = firebase.auth().currentUser;
//     const matchesRef = db.collection('matches');
//     const currentMatchSnapshot = await matchesRef.where(`players.${uid}`, 'not-in', ['']).limit(1).get();
//     return snapshotToArray(currentMatchSnapshot)[0];
// };
