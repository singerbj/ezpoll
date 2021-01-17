import React, { useState, useEffect, createContext, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { loginAnonymously, onAuthStateChanged, logoutOfFirebase, getCurrentUser } from './FirebaseHelper';

const { VERSION } = window.RESOURCES;

const alertMessages = [];
export const AppContext = createContext({ alertMessages: [] });
export const useAppContext = () => useContext(AppContext);

const AppContextWrapper = withRouter(({ renderContent }) => {
    const [appState, setAppState] = useState({
        loading: true,
    });
    const appStateRef = useRef();
    appStateRef.current = appState;
    const [snackPack, setSnackPack] = React.useState([]);
    const addSnack = (message, severity) => {
        if (['error', 'warning'].includes(severity)) {
            alertMessages.push({
                ...appState,
                snackBar: {
                    message,
                    severity,
                },
            });
        }
        setSnackPack((prev) => [
            ...prev,
            {
                ...appState,
                snackBar: {
                    message,
                    severity,
                },
            },
        ]);
    };
    const showSuccess = (message) => addSnack(message, 'success');
    const showInfo = (message) => addSnack(message, 'info');
    const showWarning = (message) => addSnack(message, 'warning');
    const showError = (message) => addSnack(message, 'error');

    const getSnackPack = () => {
        return snackPack;
    };

    const logout = async () => {
        logoutOfFirebase();
    };

    // const login = async () => {
    //     setAppState({
    //         ...appState,
    //         loading: true,
    //     });
    //     try {
    //         // const { data } = await getBungieAuthUrl();
    //         window.location = data;
    //     } catch (e) {
    //         setAppState({
    //             ...appState,
    //             loading: false,
    //         });
    //         showError('Error logging in. Please try again later.');
    //     }
    // };

    useEffect(() => {
        return onAuthStateChanged(async (user) => {
            if (user) {
                console.log('User is logged in');
                setAppState({
                    ...appState,
                    loading: false,
                });
            } else {
                console.log('No User logged in');
                try {
                    await loginAnonymously();
                    setAppState({
                        ...appState,
                        loading: false,
                    });
                } catch (e) {
                    logout();
                    setAppState({
                        ...appState,
                        loading: false,
                    });
                    showError('Error logging in anonymously. Please try again.');
                }
            }
        });
    }, []);

    return (
        <>
            <AppContext.Provider
                value={{
                    alertMessages,
                    appState,
                    setAppState,
                    snackPack,
                    setSnackPack,
                    showSuccess,
                    showInfo,
                    showWarning,
                    showError,
                    getSnackPack,
                    // login,
                    logout,
                    VERSION,
                }}
            >
                {renderContent(getCurrentUser())}
            </AppContext.Provider>
        </>
    );
});

AppContextWrapper.propTypes = {
    history: PropTypes.object,
    renderContent: PropTypes.func,
};

export { AppContextWrapper };
