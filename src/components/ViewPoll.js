import React, { useState, useContext, useEffect } from 'react';
import { Button, Grid, Paper, Box, LinearProgress, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { AppContext } from '../AppContext';
import { watchDoc, vote, getCurrentUser, getPoll } from '../FirebaseHelper';

const useStyles = makeStyles((theme) => {
    return {
        grid: {},
        paper: {
            width: '37em',
            padding: theme.spacing(2),
            margin: theme.spacing(2),
            [theme.breakpoints.down('xs')]: {
                width: `calc(100% - ${theme.spacing(4)}px)`,
            },
        },
        pollContainer: {
            width: '100%',
            textAlign: 'left',
        },
        question: {
            width: '100%',
            height: '48px',
            lineHeight: '48px',
        },
        voteButton: {
            width: '10%',
        },
        textContainer: {
            position: 'relative',
            width: '100%',
            height: '66px',
            marginBottom: theme.spacing(2),
            border: `1px dashed ${theme.palette.grey.A700}`,
            '&:hover': {
                border: '1px dashed white',
                cursor: 'pointer',
            },
        },
        votedTextContainer: {
            position: 'relative',
            width: '100%',
            height: '66px',
            marginBottom: theme.spacing(2),
            border: '1px solid white',
        },
        answerIcon: {
            position: 'absolute',
            right: '15px',
            height: '100%',
        },
        percentBar: {
            margin: theme.spacing(),
            height: `calc(100% - ${theme.spacing(2)}px)`,
            background: theme.palette.grey.A700,
            zIndex: 1,
            position: 'absolute',
            lineHeight: `calc(66px - ${theme.spacing(2)}px)`,
            transition: 'width 0.5s ease-in-out',
        },
        answerContent: {
            marginTop: theme.spacing(),
            marginBottom: theme.spacing(),
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            width: `calc(100% - ${theme.spacing(2)}px)`,
            height: `calc(100% - ${theme.spacing(2)}px)`,
            zIndex: 10,
            position: 'absolute',
            lineHeight: `calc(66px - ${theme.spacing(2)}px)`,
        },
    };
});

const ViewPoll = ({ history, match }) => {
    const classes = useStyles();
    const theme = useTheme();
    const [pollData, setPollData] = useState();
    const { showError } = useContext(AppContext);

    useEffect(() => {
        (async () => {
            const poll = await getPoll(match.params.pollId);
            if (poll.exists) {
                watchDoc(
                    'polls',
                    match.params.pollId,
                    (snapshot) => {
                        setPollData(snapshot);
                    },
                    (e) => {
                        console.error(e);
                        showError('Error getting latest poll data.');
                    }
                );
            } else {
                showError('Poll expired or not found.');
                history.push('/');
            }
        })();
    }, []);

    const makeVote = (answerId) => {
        vote(match.params.pollId, getCurrentUser().uid, answerId);
    };
    const isVotedAnswer = (i) => {
        return pollData.votes && pollData.votes[getCurrentUser().uid] === i;
    };

    const answers = [];
    if (pollData && pollData.answers) {
        Object.keys(pollData.answers).forEach((answerId) => {
            answers[answerId] = pollData.answers[answerId];
        });
    }
    const voteCounts = {};
    let totalVotes = 0;
    if (pollData && pollData.votes) {
        Object.keys(pollData.votes).forEach((uid) => {
            const answerId = pollData.votes[uid];
            totalVotes += 1;
            if (!voteCounts[answerId]) {
                voteCounts[answerId] = 1;
            } else {
                voteCounts[answerId] += 1;
            }
        });
    }
    return (
        <Grid container spacing={0} align="center" direction="column" className={classes.grid}>
            <Grid item>
                {!pollData && <LinearProgress />}
                {pollData && (
                    <>
                        <Paper className={classes.paper}>
                            <Typography className={classes.question} variant="h6">
                                {pollData.question}
                            </Typography>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Box className={classes.pollContainer}>
                                {answers.map((answer, i) => {
                                    const percentage = voteCounts[i] !== undefined ? (voteCounts[i] / totalVotes) * 100 : 0;
                                    return (
                                        <Box
                                            key={`answer_${i + 1}`}
                                            className={isVotedAnswer(i) ? classes.votedTextContainer : classes.textContainer}
                                            // label={`Answer ${i + 1}`}
                                            variant="outlined"
                                            value={answer}
                                            onClick={() => {
                                                makeVote(i);
                                            }}
                                        >
                                            <Box className={classes.percentBar} style={{ width: `calc(${percentage}% - ${theme.spacing(2)}px)` }} />
                                            <Box className={classes.answerContent}>
                                                {answer}
                                                {/* {isVotedAnswer(i) && ( */}
                                                <CheckCircleIcon
                                                    className={classes.answerIcon}
                                                    style={isVotedAnswer(i) ? {} : { opacity: 0.1 }}
                                                    onClick={() => {
                                                        makeVote(i);
                                                    }}
                                                />
                                                {/* )} */}
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Paper>
                        <Button
                            onClick={() => {
                                history.push('/');
                            }}
                        >
                            Create Your Own Poll
                        </Button>
                    </>
                )}
            </Grid>
        </Grid>
    );
};

ViewPoll.propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
};

export default withRouter(ViewPoll);
