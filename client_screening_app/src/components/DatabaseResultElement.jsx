import ResultElement from "../components/ResultElement";

export default function DatabaseResultElement({databaseResult}) {
  return (
    <div>
      <h4>Database: {databaseResult.database}</h4>
        {databaseResult.data === 'None' ? (
          <div>
            <p>No positive or potentially positive matches found.</p>
          </div>
        ): databaseResult.data.length > 1 ? (databaseResult.data.map((result) => (<ResultElement result={result}/>))):
        (<ResultElement result = {databaseResult.data[0]}/>)} 
    </div>
  )
}