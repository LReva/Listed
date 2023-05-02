import ResultElement from "../components/ResultElement";

export default function DatabaseResultElement({databaseResult, setPositives, matchHistoryID}) {
  if (databaseResult.data !== "None"){
    setPositives(true)
  }
  return (
    <div className="db-results">
      <h4>Database: {databaseResult.database}</h4>
        {databaseResult.data === 'None' ? (
          <div>
            <p>No positive or potentially positive matches found.</p>
          </div>
        ): databaseResult.data.length > 1 ? (databaseResult.data.map((result) => (<ResultElement result={result} 
                                                                                                 type = {databaseResult.type}
                                                                                                 database = {databaseResult.database}
                                                                                                 matchHistoryID = {matchHistoryID}/>))):
        (<ResultElement result = {databaseResult.data[0]}
                        type = {databaseResult.type}
                        database = {databaseResult.database}/>)} 
    </div>
  )
}