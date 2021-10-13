import React, { useState, useEffect } from 'react';
import './Game.css'
import { Button, Spin, Typography, Result } from 'antd';
import { Code } from './types';

const { Title } = Typography;

const Game = (props: { db: any }) => {
    const [questions, setQuestions] = useState<Code[]>([])
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null)
    const [dataLoaded, setDataLoaded] = useState<boolean>(false)
    const [points, setPoints] = useState<number>(0)
    const [time, setTime] = useState<number>(60);
    const [gameFinished, setGameFinished] = useState<boolean>(false)
    const [fetchDataInvoker, setFetchDataInvoker] = useState<boolean>(false)

    // fetch questions from the database on component mount
    useEffect(() => {
        // const test = () => {
        let retrievedData: Code[] = []
        props.db.collection("code_samples").get().then((querySnapshot: any) => {
            querySnapshot.forEach((doc: any) => {
                retrievedData.push(doc.data())
            })
            return retrievedData
        }).then(() => {
            console.log(retrievedData)
            setQuestions(retrievedData)
            setDataLoaded(true)
        })
        // }
    }, [fetchDataInvoker])

    // countdown
    useEffect(() => {
        const timer = setTimeout(() => {
            if (time <= 1) {
                setGameFinished(true)
                return
            }
            setTime(time - 1);
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [time]);

    // after data is fetched choose a random question and start the game
    useEffect(() => {
        chooseRandomQuestion()
        // startTimer()
    }, [dataLoaded])


    // choose a random question and delete it from questions array so it doesn't appear again
    const chooseRandomQuestion = () => {
        if (questions === null || questions.length === 0) {
            setSelectedQuestion(null)
            return
        }
        const questionIndex: number = Math.floor(Math.random() * questions.length)
        setSelectedQuestion(questions[questionIndex])
        if (questionIndex >= 0) {
            const newQuestions = [...questions]
            newQuestions.splice(questionIndex, 1)
            setQuestions(newQuestions)
        }
    }

    // set the game to its initial state
    const setupGame = () => {
        setDataLoaded(false)
        setTime(60)
        setPoints(0)
        setGameFinished(false)
        setFetchDataInvoker(!fetchDataInvoker)
    }

    // after one of the buttons is pressed check if the answer was correct and update points accordingly
    const handleAnswerChosen = (value: string) => {
        // TODO: create a combo option where every guess in a row increases the amount of points to get and a progress bar presenting it
        return (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!selectedQuestion) return
            // const target = e.target as HTMLButtonElement
            console.log(value, selectedQuestion.correct)
            if (value === selectedQuestion.correct) {
                console.log('Correct', selectedQuestion.correct)
                setPoints(points + 1)
            } else {
                console.log('Incorrect', selectedQuestion.correct)
                if(points > 0){
                    setPoints(points - 1)
                }
            }
            chooseRandomQuestion()
        }
    }

    return (
        <>
            {gameFinished ? <Result
                status="success"
                title={`Congratulations! Your score is ${points}`}
                extra={[
                    <Button type="primary" key="reset" onClick={setupGame}>
                        Play again!
                    </Button>
                ]}
            /> : <div className="game-component">
                {selectedQuestion ? <>
                    <Title level={3}>Language: {selectedQuestion.language}</Title>
                    <div className="img-container">
                        <img src={selectedQuestion.image} alt="problem" />
                    </div>
                    <Title>Points: {points} Time: {time}</Title>
                    <div className="buttons">
                        {/* value did not work */}
                        <Button type="primary" onClick={handleAnswerChosen("a")} className="btn" >{selectedQuestion.a}</Button>
                        <Button type="primary" onClick={handleAnswerChosen("b")} className="btn" >{selectedQuestion.b}</Button>
                        <Button type="primary" onClick={handleAnswerChosen("c")} className="btn" >{selectedQuestion.c}</Button>
                    </div>
                </> : <Spin />}

            </div>
            }
        </>
    )
}


// const Timer = () => {
//     const [time, setTime] = useState<number>(60);
//     useEffect(() => {
//       const timer = setTimeout(() => {
//         setTime(time - 1);
//       }, 1000);
//       return () => {
//         clearTimeout(timer);
//       };
//     }, [time]);

//     return <Title>Time: {time}</Title>
// }

export default Game