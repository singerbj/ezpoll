import { loginAnonymously, savePoll, vote, getPoll } from './FirebaseHelper';

window.ezpollLoaded = new Promise((resolve, reject) => {
    try {
        window.EZPoll = {
            createPoll: async (pollData) => {
                try {
                    await loginAnonymously();
                    await savePoll(pollData);
                } catch (e) {
                    console.error(e);
                }
            },
            getPoll: async (id) => {
                try {
                    await loginAnonymously();
                    await getPoll(id);
                } catch (e) {
                    console.error(e);
                }
            },
            vote: async (pollId, userId, answerId) => {
                try {
                    await loginAnonymously();
                    await vote(pollId, userId, answerId);
                } catch (e) {
                    console.error(e);
                }
            },
        };
        resolve();
    } catch (e) {
        console.error(e);
        reject(e);
    }
});
