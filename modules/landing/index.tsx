import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export const LandingPage: React.FC = () => {
  return (
    <>
        <Head>
            <title>Grader Prototype</title>
            <meta name="description" content="Go DAD COMPFEST!!" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="text-center flex flex-col justify-center mt-[20vh]">
            <div className="">
                <h1>PROOF OF CONCEPT: SQL GRADER</h1>
                <p>Go DAD CF!</p>
            </div>
            <div className='flex space-x-6 justify-center mt-[4vh]'>
                <Link href="/question/q1"><button>Q1</button></Link>
                <Link href="/question/q2"><button>Q2</button></Link>
                <Link href="/question/q3"><button>Q3</button></Link>
            </div>
            <div>
                <h2>Some References</h2>
                <p>hackerranks grader, stratascratch</p>
                <p>http://www.cs.toronto.edu/~nn/csc309/guide/pointbase/docs/html/htmlfiles/dev_datatypesandconversionsFIN.html</p>
                <p>repository link</p>
            </div>
        </main>
    </>
  )
}