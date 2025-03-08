import React, { ChangeEvent, useState } from 'react';
import { UpDownThumbs } from './updownthumbs';
import { formatDateFancy, GuessWire } from '@scottglz/trivia2025-shared';
import Button from './button';
import TextInput from './textinput';
import QuestionCard from './questioncard';
import { questionPlus } from '../types/question';
import { useGradeMutation } from '../datahooks';

function GradingGuess(props: {
   guess: GuessWire,
   correct: boolean,
   onChangeGrade: (guess: GuessWire, correct: boolean, event: React.MouseEvent) => void
}) {
   const correct = props.correct;
   const guess = props.guess;
   return (
      <div className="guess flex items-center gap-4">
         <UpDownThumbs value={correct} onChange={(correct, event) => props.onChangeGrade(guess, correct, event)}/>
         <span>{guess.guess}</span>  
      </div>        
   );
}

export interface grade {
   userid: number,
   correct: boolean
}

export interface gradingQuestionProps {
   question: questionPlus
}
   
export function GradingQuestion(props: gradingQuestionProps) {
   const { question } = props;
   const [answer, setAnswer] = useState('');
   const [gradesByUserId, setGradesByUserId] = useState({} as Record<number, boolean>);
   const  { mutate: save, isLoading: saving, isError, error } = useGradeMutation();
   const guesses = Object.values(question.guessesMap);

   function onEditInput(ev: ChangeEvent<HTMLInputElement>) {
      setAnswer(ev.target.value);
   }
   
   function onChangeGrade(guess: GuessWire, correct: boolean, event: React.MouseEvent) {
      if (!answer && correct) {
         // If an answer hasn't been entered yet and we marked something correct,
         // set that guess as the answer
         setAnswer(guess.guess);
      }

      if (event.shiftKey || event.ctrlKey) {
         // If shift or control is held, only specific grade
         setGradesByUserId(oldMap => {
            return { ...oldMap, [guess.userid]: correct};
         });
      } 
      else {
         setGradesByUserId(oldMap => {
            const newMap = { ...oldMap };
            for (const someGuess of guesses) {
               if (someGuess.guess.trim().toLowerCase() === guess.guess.trim().toLowerCase()) {
                  newMap[someGuess.userid] = correct;
               }
            }
            return newMap;
         });
      }
   }
   
   function onClickSubmit() {

      const grades = Object.keys(gradesByUserId).map(userid => ({
         userid: +userid,
         correct: gradesByUserId[+userid]
      }));

      save({
         questionid: question.id,
         answer: answer.trim(),
         grades: grades
      }); 
   }
   

   const ready = !!answer.trim() && !saving && guesses.every(guess =>
      typeof gradesByUserId[guess.userid] === 'boolean'
   );

   return (
      <QuestionCard key={question.day} loading={saving}>
         <div>
            <div className="font-bold text-sm mb-1"><p>Grade this Question</p><p>{formatDateFancy(question.day)}</p></div>
            <div>{question.q}</div> 
         </div>
         <div>
            Correct Answer:
            <TextInput className="ml-3" value={answer} onChange={onEditInput} readOnly={saving}/>
         </div>    
         <div className="flex flex-col gap-2">
            {guesses.map(guess => <GradingGuess key={guess.guessid} guess={guess} correct={gradesByUserId[guess.userid]} onChangeGrade={onChangeGrade}/>)}
         </div>
         <div>
            <Button disabled={!ready} onClick={onClickSubmit}>Submit Grades</Button>
         </div>
         { isError && <p>Something went wrong submitting the grades. [{'' + error}]</p> }
      </QuestionCard>    
   );
};
