import axios from "axios";
import Router, { useRouter } from "next/router";
import { BaseSyntheticEvent, useEffect, useState } from "react";

let config = {
    headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Headers":  "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, access-control-allow-origin, access-control-allow-headers",
        "Access-Control-Allow-Methods": "POST, OPTIONS, GET, PUT, PATCH, DELETE"
      }
    }

export default function Question() {
    const router = useRouter()
    const id = router.query.id
    const [question, setQuestion] = useState<any>({});
    const [tableRows, setTableRow] = useState<any>([{"loading": 1}])
    
    const [queryContent, setQueryContent] = useState<string>("SELECT *");
    const [queryTableRows, setQueryTableRows] = useState<any>([{"loading":1}]);
    const [result, setResult] = useState<any>({
        'is_correct': undefined,
        'testcases': {}
    });

    useEffect(() => {
        if (router.isReady) {
            axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}`
            axios
            .get(`/api/${id}`, config)
            .then(response => {
                setQuestion(response.data.data);
            })
            .catch(err => {
                console.log("err:", err)
            })

            axios
            .get(`/api/index/${id}`, config)
            .then(response => {
                if (typeof !!response.data.data && typeof response.data.data !== undefined) {
                    console.log(response.data.data)
                    setTableRow(response.data.data)
                }
            })
            .catch(err => {
                console.log("err:", err)
            })

        } else {
            return;
        }
    }, [router.isReady]);

    function handleQueryChange(e: BaseSyntheticEvent) {
        setQueryContent(e.target.value);
    }

    function handleQueryRun(e: BaseSyntheticEvent) {
        axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}`
        axios
        .post(`/query/execute/${id}`, {
            query: queryContent
        }, config)
        .then(response => {
            if (typeof response.data.data !== null) {
                setQueryTableRows(response.data.data)
            }
        })
        .catch(err => {
            console.log("err:", err)
        })
    }

    function handleQuerySubmit(e: BaseSyntheticEvent) {
        axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}`
        axios
        .post(`/query/submit/${id}`, {
            query: queryContent
        }, config)
        .then(response => {
            if (typeof response.data !== null) {
                console.log(response.data)
                setResult(response.data)
            }
        })
        .catch(err => {
            console.log("err:", err)
        })
    }

    return(
        <main>
            <div style={{'color': "black"}}>
                <h1>QUESTION {id}</h1>
                <p>{question ? question.prompt : "loading..."}</p>
            </div>
            <h3>Table: {question.table_name}</h3>
            <table>
                <tbody>
                    <tr>
                        {Object.keys(tableRows?.length > 0 ? tableRows[0] : {"loading...": 1}).map((item:any, idx:number) => (
                            <th key={idx}>{item}</th>
                        ))}
                    </tr>
                    {tableRows.map((row: any, idx:number) => (
                        <tr key={idx}>
                            {Object.keys(row).map((field, idxx) => (
                                <td key={idxx}>{row[field]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Query:</h3>
            <form>
                <textarea 
                    name="queryContent" 
                    value={queryContent} 
                    onChange={handleQueryChange}
                    rows={8}
                    cols={100}
                />
            </form>
            <button onClick={handleQueryRun}>Run (Test)</button>
            <button onClick={handleQuerySubmit}>Submit</button>

            <h3>Submission Result:</h3>
            <p>{result?.is_correct ? "CORRECT" : "FALSE or not submitted"}</p>
            <p>{result.testcases ? "(will not run all, only test cases until error)" : <></>}</p>
            <ul>
                {Object.keys(result.testcases).map((item: any, idx: number) => (
                    <li key={idx}>Testcase {item}: {result.testcases[item] ? "✅" : "💔"}</li>
                ))}
            </ul>

            <h3>Test Output:</h3>
            <table>
                <tbody>
                    <tr>
                        {Object.keys(tableRows?.length > 0 ? tableRows[0] : {"loading...": 1}).map((item:any, idx:number) => (
                            <th key={idx}>{item}</th>
                        ))}
                    </tr>
                    {queryTableRows.map((row: any, idx:number) => (
                        <tr key={idx}>
                            {Object.keys(row).map((field, idxx) => (
                                <td key={idxx}>{row[field]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={e => setQueryContent("")}>clear query</button>
            <button onClick={e => setQueryTableRows([])}>clear output</button>

        </main>
    );
}