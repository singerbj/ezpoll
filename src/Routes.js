import React, { useContext } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { LinearProgress, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from './AppContext';
import CreatePoll from './components/CreatePoll';
import ViewPoll from './components/ViewPoll';

const useStyles = makeStyles((theme) => ({
    progressBar: {
        marginBottom: theme.spacing(),
    },
    loading: {
        textAlign: 'center',
        margin: theme.spacing(2),
    },
}));

const App = () => {
    const classes = useStyles();
    const { appState } = useContext(AppContext);

    if (appState.loading) {
        return (
            <>
                <LinearProgress className={classes.progressBar} color="secondary" />
            </>
        );
    }

    return (
        <>
            {/* {JSON.stringify(appState)} */}
            <Container>
                <Switch>
                    <Route exact path="/">
                        <CreatePoll />
                    </Route>
                    <Route exact path="/:pollId">
                        <ViewPoll />
                    </Route>
                    <Redirect to="/" />
                </Switch>
            </Container>
        </>
    );
};
export default App;
