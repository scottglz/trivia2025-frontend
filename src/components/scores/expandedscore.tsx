import { default as React,  KeyboardEvent,  ReactNode, useRef, useState } from 'react';
import classNames from 'classnames';
import { formatDateFancy, isUserActive, userFull, GuessWire } from '@scottglz/trivia2025-shared';
import { questionPlus } from '../../types/question';
import QuestionCard from '../questioncard';
import { useEditGradeMutation, useEditAnswerMutation } from '../../datahooks';
import Avatar from '../avatar';
import { isMouseEventInElementRef, useDocumentMouseDown } from '../../uihooks';


function TinyButton(props: {
   children: ReactNode,
   className?: string,
   onClick: () => void
}) {
   const { children, className='', onClick } = props;
   return  <button type="button" onClick={onClick} className={`text-xs text-white border-white border p-0.5 bg-gray-600 ${className}`}>{children}</button>
}


function UserAnswerDetails(props: {
   user: userFull,
   guess: GuessWire,
   editable?: boolean
}) {
   const { user, guess, editable = false } = props;
   const [showingEditChoices, setShowingEditChoices] = useState(false);

   const popupRef = useRef<HTMLDivElement>(null);

   useDocumentMouseDown(function(ev) {
      if (!isMouseEventInElementRef(ev, popupRef)) {
         setShowingEditChoices(false);
      }
   });

   const editGradeMutation = useEditGradeMutation();

   function onClickShowEditChoices() {
      if (editable) {
         setShowingEditChoices((prev) => !prev);
      }
   }

   function onClickEditGrade() {
      editGradeMutation.mutate({questionid: guess.day, userid: guess.userid, correct: !guess.correct });
   }


   const classes = classNames('relative rounded shadow-md py-1 px-2 text-right', guess.correct === true && 'text-black bg-green-200', guess.correct === false && 'text-white bg-rose-500');
   return (
      <div className={classes} onClick={onClickShowEditChoices}>
         <span className="float-left block mr-4 font-bold"><Avatar user={user} size="s" className="inline mr-2 align-top hover:scale-[2] transition-transform"/>{user.username}</span>
         <span>{guess.guess}</span>
         { showingEditChoices && (
            <div ref={popupRef} className="absolute -bottom-2 -right-2 flex gap-2">
              { typeof(guess.correct) === 'boolean' && <TinyButton onClick={onClickEditGrade}>{guess.correct ? 'Change to Wrong': 'Change to Right'}</TinyButton> }
            </div>         
         )}
      </div>
   );
}

UserAnswerDetails.Skeleton = function() {
   const correct = Math.random() < 0.5;
   const classes = classNames('rounded shadow-md py-1 px-4 text-right', correct === true && 'text-black bg-green-200', correct === false && 'text-white bg-rose-500');
   return (
      <div className={classes}>&nbsp;</div>
   );
}

function QuestionDetails(props: {
   question: questionPlus,
   editable?: boolean
}) {

   const [isEditingAnswer, setIsEditingAnswer] = useState(false);
   const [editedAnswer, setEditedAnswer] = useState('');
   const editAnswerMutation = useEditAnswerMutation();

   const onClick = function() {
      if (editable ) {
         setEditedAnswer(question.a || '');
         setIsEditingAnswer(true);
      }
   };

   const onEditAnswerKeyDown = function(event: KeyboardEvent) {
      if (event.key === 'Enter') {
         setIsEditingAnswer(false);
         editAnswerMutation.mutate({questionid: question.id, answer: editedAnswer});
      }
      else if (event.key === 'Escape') {
         setIsEditingAnswer(false);
      }
   };

   const { question, editable=false } = props;
   return ( 
      <QuestionCard className="col-start-1 col-span-2 row-start-1 row-span-3 relative">
         <div>
            <div className="font-bold text-sm mb-2">{formatDateFancy(question.day)}</div>
            <div>{question.q}</div>
         </div>
         { question.a && (
               <div className={`self-end italic text-right ${editable ? 'cursor-pointer' : ''}`} onClick={onClick}>
                  { !isEditingAnswer && question.a}
                  { isEditingAnswer && <input type="text" autoFocus value={editedAnswer} className="px-1" onChange={(e)=>setEditedAnswer(e.target.value)} onKeyDown={onEditAnswerKeyDown}/> }
               </div>
            ) 
}        
      </QuestionCard>   
   );
}

QuestionDetails.Skeleton = function() {
   return ( 
      <QuestionCard className="col-start-1 col-span-2 row-start-1 row-span-3">
      </QuestionCard>   
   );
}

function UsersWithNoAnswer(props: {
   users: userFull[]
}) {
   const { users } = props;
   return (
      <div>
      { 'Waiting on ' + users.map(user => user.username).join(', ') }
      </div>   
   );
}

export function ExpandedScore(props: {
   users: userFull[],
   question: questionPlus,
   editable?: boolean,
   onClickExpanded?: (event: React.MouseEvent) => void
}) {
   const { users, question, editable=false, onClickExpanded } = props;
   const usersWithNoAnswer = users.filter(user =>  !question.guessesMap[user.userid] && isUserActive(user, question.day));
   return ( 
      <div className="grid gap-4 template-columns-auto-180-1fr" onClick={onClickExpanded}>
         <QuestionDetails question={question} editable={editable} />
         {
            users.map(user => {
               const guess = question.guessesMap[user.userid];
               return guess && <UserAnswerDetails key={user.userid} user={user} guess={guess} editable={editable} />
            })
         }
         {
            !!usersWithNoAnswer.length && <UsersWithNoAnswer users={usersWithNoAnswer} /> 
         }
      </div>
   );
}

ExpandedScore.Skeleton = function() {
   return ( 
      <div className="grid gap-4 template-columns-auto-180-1fr animate-skeleton">
         <QuestionDetails.Skeleton />
         {
            [1,2,3,4,5,6].map((id) => <UserAnswerDetails.Skeleton key={id} />)
         }
      </div>
   );
}

