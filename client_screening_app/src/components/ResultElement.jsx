export default function ResultElement({result}){
  console.log(result)
  return (
    <div>
      <p>Name: {result.name}</p>
      <p>Aliases: {result.aliases}</p>
      <p>Gender: {result.sex}</p>
      <p>DOB: {result.DOB}</p>
      <p>Race: {result.race}</p>
      <p>Nationality: {result.nationality}</p>
      <p>Eyes: {result.eyes}</p>
      <p>Hair: {result.hair}</p>
      <p>Scars and marks: {result.scars_and_marks}</p>
      <p>Charge: {result.caution}</p>
      <img src={result.photo} alt="No image available" />
    </div>
  )
}