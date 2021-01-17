import React, { useState, useContext, useEffect } from 'react';
import { Button, Grid, Paper, Box, TextField, InputAdornment, IconButton, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import ClearIcon from '@material-ui/icons/Clear';
import { AppContext } from '../AppContext';
import { savePoll } from '../FirebaseHelper';
import { QUESTION_MAX_SIZE, ANSWER_MAX_SIZE } from '../Constants.json';

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
        buttonContainer: {
            width: '100%',
            height: '48px',
            position: 'relative',
            marginBottom: theme.spacing(2),
        },
        addButton: {
            position: 'absolute',
            left: 0,
        },
        saveButton: {
            position: 'absolute',
            right: 0,
        },
        input: {
            width: `calc(100% - ${theme.spacing(2)}px)`,
            margin: theme.spacing(),
        },
        questionTextInput: {},
        textInput: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
    };
});

const lastPollObj = JSON.parse(localStorage.getItem('pollObjData'));
let lastPollObjQuestion = '';
let lastPollObjAnswers = ['', ''];
if (lastPollObj && lastPollObj.question) {
    lastPollObjQuestion = lastPollObj.question;
}
if (lastPollObj && lastPollObj.answers) {
    lastPollObjAnswers = [];
    Object.keys(lastPollObj.answers).forEach((key) => {
        const keyAsNum = parseInt(key, 10);
        lastPollObjAnswers[keyAsNum] = lastPollObj.answers[key];
    });
}

const CreatePoll = ({ history }) => {
    const classes = useStyles();
    const [question, setQuestion] = useState(lastPollObjQuestion);
    const [answers, setAnswers] = useState(lastPollObjAnswers);
    const [loading, setLoading] = useState(false);
    const { showError } = useContext(AppContext);

    const buildPoll = () => {
        const answerObj = {};
        answers.forEach((answer, i) => {
            answerObj[i] = answer.trim();
        });
        const currentPollObj = {
            created: Date.now(),
            question: question.trim(),
            answers: answerObj,
            votes: {},
        };
        localStorage.setItem('pollObjData', JSON.stringify(currentPollObj));
        return currentPollObj;
    };

    const validatePoll = () => {
        if (question === undefined || question.trim().length === 0) {
            return 'Please enter a valid question.';
        }
        if (question === undefined || question.trim().length > QUESTION_MAX_SIZE) {
            return `Please enter a question that is less than ${QUESTION_MAX_SIZE} characters long.`;
        }
        if (answers.length < 2) {
            return 'Please enter at least 2 answers.';
        }
        const answerErrors = answers.map((answer, index) => {
            if (answer === undefined || answer.trim().length === 0) {
                return { index, error: 'Please enter a valid answer' };
            }
            if (answer.trim().length > ANSWER_MAX_SIZE) {
                return { index, error: `Please enter an answer that is less than ${ANSWER_MAX_SIZE} characters long.` };
            }
            return undefined;
        });
        const invalidAnswers = answerErrors.filter((answerError) => answerError !== undefined);
        if (invalidAnswers.length > 0) {
            return invalidAnswers;
        }
        return undefined;
    };

    const savePollToDb = async () => {
        setLoading(true);
        try {
            const validationResult = validatePoll();
            if (validationResult === undefined) {
                const createdPollId = await savePoll(buildPoll());
                setQuestion('');
                setAnswers(['', '']);
                localStorage.removeItem('pollObjData');
                lastPollObjQuestion = '';
                lastPollObjAnswers = ['', ''];
                history.push(`/${createdPollId}`);
            } else {
                setLoading(false);
                if (typeof validationResult === 'string') {
                    showError(validationResult);
                } else {
                    showError(`Please enter answers that are no longer than ${ANSWER_MAX_SIZE} characters in length.`);
                }
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            setLoading(false);
        }
    };

    useEffect(() => {
        buildPoll();
    }, [question, answers]);

    return (
        <Grid container spacing={0} align="center" direction="column" className={classes.grid}>
            <Grid item>
                {loading && <LinearProgress />}
                <Paper className={classes.paper}>
                    <Box className={classes.buttonContainer}>
                        <Button
                            className={classes.addButton}
                            variant="contained"
                            onClick={() => {
                                setAnswers([...answers, '']);
                            }}
                            disabled={answers.length >= 10}
                        >
                            Add Answer
                        </Button>
                        <Button
                            className={classes.saveButton}
                            variant="contained"
                            onClick={() => {
                                savePollToDb();
                            }}
                        >
                            Create Poll
                        </Button>
                    </Box>
                    <Box className={classes.questionTextInput}>
                        <TextField
                            className={classes.textInput}
                            required
                            label="Question"
                            variant="filled"
                            value={question}
                            onChange={(e) => {
                                setQuestion(e.target.value);
                            }}
                        />
                    </Box>
                    {Object.keys(answers).map((answerId, i) => {
                        const answer = answers[answerId];
                        return (
                            <Box key={`answer_${i + 1}`}>
                                <TextField
                                    required
                                    className={classes.textInput}
                                    label={`Answer ${i + 1}`}
                                    variant="filled"
                                    value={answer}
                                    onChange={(e) => {
                                        setAnswers((prevAnswers) => {
                                            prevAnswers[answerId] = e.target.value;
                                            return [...prevAnswers];
                                        });
                                    }}
                                    InputProps={
                                        answers.length > 2
                                            ? {
                                                  endAdornment: (
                                                      <InputAdornment position="end">
                                                          <IconButton
                                                              onClick={() => {
                                                                  setAnswers((prevAnswers) => {
                                                                      const arrayCopy = [...prevAnswers];
                                                                      arrayCopy.splice(i, 1);
                                                                      return arrayCopy;
                                                                  });
                                                              }}
                                                          >
                                                              <ClearIcon />
                                                          </IconButton>
                                                      </InputAdornment>
                                                  ),
                                              }
                                            : undefined
                                    }
                                />
                            </Box>
                        );
                    })}
                </Paper>
            </Grid>
        </Grid>
    );
};

CreatePoll.propTypes = {
    history: PropTypes.object,
};

export default withRouter(CreatePoll);
