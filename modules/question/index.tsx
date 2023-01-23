import axios from "axios";
import Router, { useRouter } from "next/router";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { QUESTION_TYPE, SUBMIT_RESPONSE_TYPE } from "../../components/types/types";

let config = {}

export function QuestionPage() {
    const router = useRouter()
    const id = router.query.id

    // On initial load
    const [borderX, setBorderX] = useState<number>(800);
    const [question, setQuestion] = useState<QUESTION_TYPE | null>(null);
    const [tableRows, setTableRow] = useState<any[] | null>(null);
    
    // Query text & outcome
    const [queryText, setQueryText] = useState<string>("SELECT * FROM ...");
    const [queryResult, setQueryResult] = useState<string>("result here\n");
    
    // Submission result for each test case
    const [submitResult, setSubmitResult] = useState<SUBMIT_RESPONSE_TYPE>({
        'is_correct': null,
        'testcases': {}
    });

    // Fetch question & sample table
    if (router.isReady && id && (!question || !tableRows)) {
        // resetBorder();

        axios
        .get(`/api/${id}`, config)
        .then(res => res.data.data)
        .then(data => {
            if (data) setQuestion(data);
        })
        .catch(err => {
            console.log("err:", err)
        })

        axios
        .get(`/api/index/${id}`, config)
        .then(res => res.data.data)
        .then(data => {
            if (typeof !!data && typeof data !== undefined) {
                console.log("got res:", data)
                setTableRow(data)
            }
        })
        .catch(err => {
            console.log("err:", err)
        })

    };

    // function resetBorder() {
    //     setBorderX(window.visualViewport?.width * 0.7)
    // }

    function handleQueryChange(e: BaseSyntheticEvent) {
        setQueryText(e.target.value);
    }

    function handleQueryRun(e: BaseSyntheticEvent) {
        axios
        .post(`/query/execute/${id}`, {
            query: queryText
        }, config)
        .then(res => res.data.data)
        .then(data => {
            if (typeof data !== null) {
                setQueryResult(data)
            }
        })
        .catch(err => {
            console.log("err:", err)
        })
    }

    function handleQuerySubmit(e: BaseSyntheticEvent) {
        axios
        .post(`/query/submit/${id}`, {
            query: queryText
        }, config)
        .then(response => {
            if (typeof response.data !== null) {
                console.log(response.data)
                setSubmitResult(response.data)
            }
        })
        .catch(err => {
            console.log("err:", err)
        })
    }

    function preventDragHandler(e: DragEvent) {
        e.preventDefault();
      }

    function handleDrag(e: DragEvent) {
        if (window.visualViewport && e
        .clientX > 50 && e.clientX < window.visualViewport.width - 250) {
            setBorderX(e.clientX);
        }
        console.log(e.clientX, borderX, window.visualViewport?.width );
    }

    return(
        <main className="flex flex-row overflow-hidden">
            <div className="border px-6" style={{'minWidth': `${borderX}px`}}>
                <div>
                    <h1>QUESTION {id}</h1>
                    <p className="whitespace-pre-line">{question ? question.prompt : "loading..."}</p>
                    <br/>
                </div>
                <p className="font-bold">Table: {question?.table_name}</p>
                <table>
                    <tbody>
                        <tr>
                            {Object.keys(tableRows && tableRows.length > 0 ? tableRows[0] : {"loading...": 1}).map((item:any, idx:number) => (
                                <th key={idx}>{item}</th>
                            ))}
                        </tr>
                        {tableRows?.map((row: any, idx:number) => (
                            <tr key={idx}>
                                {Object.keys(row).map((field, idxx) => (
                                    <td key={idxx}>{row[field]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h3>Query:</h3>
                <div className="flex space-x-4 my-2">
                    <button onClick={handleQueryRun}>Run (Test)</button>
                    <button onClick={handleQuerySubmit}>Submit</button>
                    <button onClick={e => setQueryText("")} className="bg-red-300" >clear query</button>
                </div>
                <form>
                    <textarea 
                        name="queryText" 
                        value={queryText} 
                        onChange={handleQueryChange}
                        rows={10}
                        className="font-mono bg-zinc-100 w-full"
                    />
                </form>
            </div>

            <div 
                className=" bg-stone-200 min-w-[10px] cursor-ew-resize" 
                onDrag={e => handleDrag(e)}
                // onDragStart={preventDragHandler}
                draggable
            >
            
            </div>

            <div className="border px-6 w-full">
                <h3>Submission Result:</h3>
                <p>{typeof submitResult.is_correct === 'boolean' ? submitResult.is_correct ? "CORRECT" : "WRONG" : "None"}</p>
                <p>{typeof submitResult.is_correct !== 'boolean' ? "Submit to see if your query was correct or not." : <></>}</p>
                <ul>
                    {submitResult.testcases ? Object.keys(submitResult.testcases).map((item: any, idx: number) => (
                        <li key={idx}>Testcase {item}: {submitResult.testcases[item] ? "✅" : "💔"}</li>
                    )) : <></>}
                </ul>

                <h3>Test Output:</h3>
                <button onClick={e => setQueryResult("result here\n")} className="bg-red-300">clear output</button>
                <button onClick={e => console.log(borderX)}>e</button>
                <div className="bg-zinc-100 py-2 px-6 my-2">
                    <code className="whitespace-pre-line">
                        {queryResult}
                    </code>
                </div>
            </div>

        </main>
    );
}